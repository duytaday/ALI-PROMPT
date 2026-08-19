import { and, eq, isNull } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { auditEvents, entitlements, products, users } from "../../../../db/schema";
import { getAdminUser } from "../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const grantSchema = z.object({ action: z.literal("grant"), email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()), productId: z.string().uuid(), reason: z.string().trim().min(4).max(1000) });
const revokeSchema = z.object({ action: z.literal("revoke"), entitlementId: z.string().uuid(), reason: z.string().trim().min(4).max(1000) });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const form = await request.formData().catch(() => null);
  if (!form) return noStoreJson({ error: "Invalid entitlement request." }, 400);
  const action = form?.get("action");
  if (action === "grant") return grant(form, admin.id, request);
  if (action === "revoke") return revoke(form, admin.id, request);
  return noStoreJson({ error: "Choose a valid entitlement action." }, 400);
}

async function grant(form: FormData, actorId: string, request: NextRequest) {
  const parsed = grantSchema.safeParse({ action: form.get("action"), email: form.get("email"), productId: form.get("productId"), reason: form.get("reason") });
  if (!parsed.success) return noStoreJson({ error: "Provide a valid member email, product, and reason." }, 400);
  const db = getDb();
  const [user, product] = await Promise.all([
    db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1),
    db.select({ id: products.id }).from(products).where(and(eq(products.id, parsed.data.productId), eq(products.status, "active"), eq(products.sellerKind, "aliprompt"))).limit(1),
  ]);
  if (!user[0] || !product[0]) return noStoreJson({ error: "Member or active ALIPROMPT product was not found." }, 404);
  await db.transaction(async (tx) => {
    const [before] = await tx.select({ id: entitlements.id, revokedAt: entitlements.revokedAt }).from(entitlements).where(and(eq(entitlements.userId, user[0].id), eq(entitlements.productId, product[0].id))).limit(1);
    const [entitlement] = await tx.insert(entitlements).values({ userId: user[0].id, productId: product[0].id, grantSource: "admin" }).onConflictDoUpdate({ target: [entitlements.userId, entitlements.productId], set: { revokedAt: null, grantSource: "admin" } }).returning({ id: entitlements.id });
    await tx.insert(auditEvents).values({ actorId, entityType: "entitlement", entityId: entitlement.id, action: "entitlement.admin_granted", reason: parsed.data.reason, before: before ? { revokedAt: before.revokedAt } : null, after: { userId: user[0].id, productId: product[0].id } });
  });
  return Response.redirect(new URL("/admin/entitlements", request.url), 303);
}

async function revoke(form: FormData, actorId: string, request: NextRequest) {
  const parsed = revokeSchema.safeParse({ action: form.get("action"), entitlementId: form.get("entitlementId"), reason: form.get("reason") });
  if (!parsed.success) return noStoreJson({ error: "Provide a valid entitlement and reason." }, 400);
  const db = getDb();
  try {
    await db.transaction(async (tx) => {
      const [before] = await tx.select({ id: entitlements.id, userId: entitlements.userId, productId: entitlements.productId }).from(entitlements).where(and(eq(entitlements.id, parsed.data.entitlementId), isNull(entitlements.revokedAt))).limit(1);
      if (!before) throw new Error("ENTITLEMENT_INACTIVE");
      const [revoked] = await tx.update(entitlements).set({ revokedAt: new Date().toISOString() }).where(and(eq(entitlements.id, before.id), isNull(entitlements.revokedAt))).returning({ id: entitlements.id });
      if (!revoked) throw new Error("ENTITLEMENT_INACTIVE");
      await tx.insert(auditEvents).values({ actorId, entityType: "entitlement", entityId: before.id, action: "entitlement.admin_revoked", reason: parsed.data.reason, before: { userId: before.userId, productId: before.productId }, after: { revokedAt: true } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ENTITLEMENT_INACTIVE") return noStoreJson({ error: "That entitlement is no longer active." }, 409);
    throw error;
  }
  return Response.redirect(new URL("/admin/entitlements", request.url), 303);
}
