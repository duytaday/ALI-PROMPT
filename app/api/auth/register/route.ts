import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, hashPassword, isValidPassword, serializeSessionCookie } from "../../../../lib/auth";
import { consumeAuthRateLimit, requestIdentity } from "../../../../lib/auth-rate-limit";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isValidPassword(parsed.data.password)) {
    return noStoreJson({ error: "Please provide a valid name, email, and password." }, 400);
  }

  const allowed = await consumeAuthRateLimit({
    action: "register",
    identity: `${requestIdentity(request)}:${parsed.data.email}`,
    maximum: 5,
  });
  if (!allowed) return noStoreJson({ error: "Too many attempts. Please try again later." }, 429);

  let user: { id: string; displayName: string };
  try {
    [user] = await getDb().insert(users).values({
      displayName: parsed.data.displayName,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
    }).returning({ id: users.id, displayName: users.displayName });
  } catch (error) {
    if (isUniqueViolation(error)) return noStoreJson({ error: "An account already exists for this email." }, 409);
    throw error;
  }
  const session = await createSession(user.id);
  const response = noStoreJson({ ok: true, user: { displayName: user.displayName } }, 201);
  response.headers.append("Set-Cookie", serializeSessionCookie(session.token, session.expiresAt));
  return response;
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
