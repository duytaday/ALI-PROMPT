import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { prompts, reports } from "../../../../../db/schema";
import { getCurrentUser } from "../../../../../lib/auth";
import { consumeAuthRateLimit, requestIdentity } from "../../../../../lib/auth-rate-limit";
import { isSameOrigin, noStoreJson } from "../../../../../lib/request-security";

const payloadSchema = z.object({
  reason: z.enum(["copyright", "unsafe", "spam", "misleading", "other"]),
  details: z.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ error: "Sign in is required." }, 401);
  const { promptId } = await params;
  const payload = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return noStoreJson({ error: "Choose a report reason." }, 400);
  const allowed = await consumeAuthRateLimit({ action: "report", identity: `${requestIdentity(request)}:${user.id}`, maximum: 5 });
  if (!allowed) return noStoreJson({ error: "Too many reports. Please try again later." }, 429);
  const [prompt] = await getDb().select({ id: prompts.id }).from(prompts)
    .where(and(eq(prompts.id, promptId), eq(prompts.moderationStatus, "approved"))).limit(1);
  if (!prompt) return noStoreJson({ error: "Prompt is unavailable." }, 404);
  await getDb().insert(reports).values({ promptId: prompt.id, reporterId: user.id, reason: payload.data.reason, details: payload.data.details || null });
  return noStoreJson({ ok: true }, 201);
}
