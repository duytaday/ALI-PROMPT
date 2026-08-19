import { and, eq, gt, isNull } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { passwordResetTokens, users } from "../../../../db/schema";
import { consumeAuthRateLimit, requestIdentity } from "../../../../lib/auth-rate-limit";
import { isPasswordResetDeliveryConfigured, sendPasswordResetEmail } from "../../../../lib/email";
import { createPasswordResetToken } from "../../../../lib/password-reset";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({ email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()) });
const neutralMessage = "If an eligible account exists, recovery instructions will be sent when email delivery is configured.";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Provide a valid email address." }, 400);
  const allowed = await consumeAuthRateLimit({ action: "password_reset", identity: `${requestIdentity(request)}:${parsed.data.email}`, maximum: 5 });
  if (!allowed) return noStoreJson({ error: "Too many recovery requests. Please try again later." }, 429);
  if (!isPasswordResetDeliveryConfigured()) return noStoreJson({ ok: true, message: neutralMessage });
  const [user] = await getDb().select({ id: users.id, email: users.email }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!user) return noStoreJson({ ok: true, message: neutralMessage });
  const reset = createPasswordResetToken();
  await getDb().delete(passwordResetTokens).where(and(eq(passwordResetTokens.userId, user.id), isNull(passwordResetTokens.usedAt)));
  await getDb().insert(passwordResetTokens).values({ userId: user.id, tokenHash: reset.tokenHash, expiresAt: reset.expiresAt });
  const delivered = await sendPasswordResetEmail(user.email, reset.token);
  if (!delivered) await getDb().delete(passwordResetTokens).where(and(eq(passwordResetTokens.tokenHash, reset.tokenHash), gt(passwordResetTokens.expiresAt, new Date().toISOString())));
  return noStoreJson({ ok: true, message: neutralMessage });
}
