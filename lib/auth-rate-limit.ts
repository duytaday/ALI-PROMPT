import { sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import { getDb } from "../db";
import { authRateLimits } from "../db/schema";

const WINDOW_MS = 15 * 60 * 1000;

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function windowStart(now = Date.now()) {
  return new Date(Math.floor(now / WINDOW_MS) * WINDOW_MS).toISOString();
}

export function requestIdentity(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",", 1)[0]?.trim() || "unknown";
}

export async function consumeAuthRateLimit({
  action,
  identity,
  maximum,
}: {
  action: "login" | "register" | "password_reset" | "submission" | "report" | "checkout" | "workspace";
  identity: string;
  maximum: number;
}) {
  const start = windowStart();
  const [record] = await getDb()
    .insert(authRateLimits)
    .values({ action, keyHash: hashKey(identity), windowStart: start })
    .onConflictDoUpdate({
      target: [authRateLimits.action, authRateLimits.keyHash, authRateLimits.windowStart],
      set: { count: sql`${authRateLimits.count} + 1` },
    })
    .returning({ count: authRateLimits.count });

  return record.count <= maximum;
}
