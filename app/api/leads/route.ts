import { ensureLeadStorage, getDb } from "../../../db";
import { leads } from "../../../db/schema";

const MAX_BODY_BYTES = 8 * 1024;
const ALLOWED_STAGES = new Set([
  "workshop",
  "agent_waitlist",
  "prompt_pack",
]);

type JsonObject = Record<string, unknown>;

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim().replace(/\s+/gu, " ");
  if (!cleaned || cleaned.length > maxLength) return null;

  return cleaned;
}

function normalizeContact(value: unknown) {
  const contact = cleanSingleLine(value, 254);
  if (!contact) return null;

  if (contact.includes("@")) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(contact);
    return isEmail ? contact.toLowerCase() : null;
  }

  if (!/^[+()\d\s.-]+$/u.test(contact)) return null;

  const digits = contact.replace(/\D/gu, "");
  if (digits.length < 8 || digits.length > 15) return null;

  return `${contact.startsWith("+") ? "+" : ""}${digits}`;
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return { error: errorResponse("Content-Type must be application/json.", 415) };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { error: errorResponse("Request body is too large.", 413) };
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    return { error: errorResponse("Request body is too large.", 413) };
  }

  try {
    const payload: unknown = JSON.parse(body);
    if (!isJsonObject(payload)) {
      return { error: errorResponse("Invalid request body.", 400) };
    }
    return { payload };
  } catch {
    return { error: errorResponse("Invalid JSON body.", 400) };
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await readPayload(request);
    if (parsed.error) return parsed.error;

    const payload = parsed.payload;
    const name = cleanSingleLine(payload.name, 100);
    const contact = normalizeContact(payload.contact);
    const role = cleanSingleLine(payload.role, 120);
    const stage = cleanSingleLine(payload.stage, 32);
    const source = cleanSingleLine(payload.source, 80);

    if (!name) return errorResponse("A valid name is required.", 400);
    if (!contact) {
      return errorResponse("A valid email address or phone number is required.", 400);
    }
    if (!role) return errorResponse("A valid role or industry is required.", 400);
    if (!stage || !ALLOWED_STAGES.has(stage)) {
      return errorResponse("A valid registration intent is required.", 400);
    }
    if (!source) return errorResponse("A valid source is required.", 400);
    if (payload.consent !== true) {
      return errorResponse("Consent is required.", 400);
    }

    await ensureLeadStorage();
    const db = getDb();
    await db
      .insert(leads)
      .values({
        id: crypto.randomUUID(),
        name,
        contact,
        role,
        stage: stage as "workshop" | "agent_waitlist" | "prompt_pack",
        source,
        consent: true,
      })
      .onConflictDoNothing({ target: [leads.contact, leads.stage] });

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return errorResponse(
      "Unable to save your request right now. Please try again.",
      500
    );
  }
}
