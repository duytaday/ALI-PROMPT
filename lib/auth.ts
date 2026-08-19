import { and, eq, gt } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "../db";
import { sessions, users } from "../db/schema";

const SESSION_COOKIE = "__Host-aliprompt-session";
const SESSION_TTL_DAYS = 30;

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
  role: "member" | "contributor" | "editor" | "admin";
};

function tokenHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isValidPassword(value: string) {
  return value.length >= 12 && value.length <= 128;
}

export async function hashPassword(value: string) {
  return hash(value, 12);
}

export async function verifyPassword(value: string, passwordHash: string | null) {
  if (!passwordHash) return false;
  return compare(value, passwordHash);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [record] = await getDb()
    .select({ id: users.id, email: users.email, displayName: users.displayName, role: users.role })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash(token)), gt(sessions.expiresAt, new Date().toISOString())))
    .limit(1);

  if (!record || !isRole(record.role)) return null;
  return { ...record, role: record.role };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await getDb().insert(sessions).values({ userId, tokenHash: tokenHash(token), expiresAt: expiresAt.toISOString() });
  return { token, expiresAt };
}

export async function destroyCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await getDb().delete(sessions).where(eq(sessions.tokenHash, tokenHash(token)));
}

export function serializeSessionCookie(value: string, expiresAt: Date) {
  return `__Host-aliprompt-session=${value}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}; Expires=${expiresAt.toUTCString()}`;
}

export function expiredSessionCookie() {
  return `__Host-aliprompt-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

function isRole(value: string): value is AuthenticatedUser["role"] {
  return value === "member" || value === "contributor" || value === "editor" || value === "admin";
}
