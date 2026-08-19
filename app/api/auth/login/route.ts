import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, serializeSessionCookie, verifyPassword } from "../../../../lib/auth";
import { consumeAuthRateLimit, requestIdentity } from "../../../../lib/auth-rate-limit";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Invalid email or password." }, 400);

  const allowed = await consumeAuthRateLimit({
    action: "login",
    identity: `${requestIdentity(request)}:${parsed.data.email}`,
    maximum: 10,
  });
  if (!allowed) return noStoreJson({ error: "Too many attempts. Please try again later." }, 429);

  const [user] = await getDb().select({ id: users.id, displayName: users.displayName, passwordHash: users.passwordHash })
    .from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return noStoreJson({ error: "Invalid email or password." }, 401);
  }

  const session = await createSession(user.id);
  const response = noStoreJson({ ok: true, user: { displayName: user.displayName } });
  response.headers.append("Set-Cookie", serializeSessionCookie(session.token, session.expiresAt));
  return response;
}
