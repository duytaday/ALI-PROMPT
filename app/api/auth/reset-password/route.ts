import { and, eq, gt, isNull } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { auditEvents, passwordResetTokens, sessions, users } from "../../../../db/schema";
import { hashPassword, isValidPassword } from "../../../../lib/auth";
import { hashPasswordResetToken } from "../../../../lib/password-reset";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({ token: z.string().min(32).max(128), password: z.string().min(12).max(128) });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isValidPassword(parsed.data.password)) return noStoreJson({ error: "Provide a valid reset token and password." }, 400);
  const db = getDb();
  try {
    await db.transaction(async (tx) => {
      const [record] = await tx.select({ id: passwordResetTokens.id, userId: passwordResetTokens.userId }).from(passwordResetTokens).where(and(eq(passwordResetTokens.tokenHash, hashPasswordResetToken(parsed.data.token)), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date().toISOString()))).limit(1);
      if (!record) throw new Error("RESET_TOKEN_INVALID");
      const [used] = await tx.update(passwordResetTokens).set({ usedAt: new Date().toISOString() }).where(and(eq(passwordResetTokens.id, record.id), isNull(passwordResetTokens.usedAt))).returning({ id: passwordResetTokens.id });
      if (!used) throw new Error("RESET_TOKEN_INVALID");
      await tx.update(users).set({ passwordHash: await hashPassword(parsed.data.password), updatedAt: new Date().toISOString() }).where(eq(users.id, record.userId));
      await tx.delete(sessions).where(eq(sessions.userId, record.userId));
      await tx.insert(auditEvents).values({ actorId: record.userId, entityType: "user", entityId: record.userId, action: "auth.password_reset" });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_INVALID") return noStoreJson({ error: "This recovery link is invalid or has expired." }, 400);
    throw error;
  }
  return noStoreJson({ ok: true });
}
