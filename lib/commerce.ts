import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "../db";
import { entitlements, orders, products, prompts } from "../db/schema";

export async function getActiveProductBySlug(slug: string) {
  const [product] = await getDb().select({
    id: products.id, slug: products.slug, title: products.title, description: products.description,
    priceAmount: products.priceAmount, currency: products.currency, contentPromptId: products.contentPromptId, contentPromptSlug: prompts.slug,
  }).from(products).leftJoin(prompts, eq(products.contentPromptId, prompts.id))
    .where(and(eq(products.slug, slug), eq(products.status, "active"), eq(products.sellerKind, "aliprompt"))).limit(1);
  return product ?? null;
}

export async function hasActiveEntitlement(userId: string | undefined, productId: string | null) {
  if (!userId || !productId) return false;
  const [entitlement] = await getDb().select({ id: entitlements.id }).from(entitlements)
    .where(and(eq(entitlements.userId, userId), eq(entitlements.productId, productId), isNull(entitlements.revokedAt))).limit(1);
  return Boolean(entitlement);
}

export async function getOrderForUser(orderId: string | undefined, userId: string | undefined) {
  if (!orderId || !userId) return null;
  const [order] = await getDb().select({ id: orders.id, status: orders.status, amount: orders.amount, currency: orders.currency, productId: orders.productId, createdAt: orders.createdAt })
    .from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, userId))).orderBy(desc(orders.createdAt)).limit(1);
  return order ?? null;
}
