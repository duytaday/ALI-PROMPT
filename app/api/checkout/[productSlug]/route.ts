import { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { auditEvents, orders } from "../../../../db/schema";
import { getCurrentUser } from "../../../../lib/auth";
import { consumeAuthRateLimit, requestIdentity } from "../../../../lib/auth-rate-limit";
import { getActiveProductBySlug, hasActiveEntitlement } from "../../../../lib/commerce";
import { paymentProviderIsConfigured } from "../../../../lib/payment";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

export async function POST(request: NextRequest, { params }: { params: Promise<{ productSlug: string }> }) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ error: "Sign in is required." }, 401);
  if (!paymentProviderIsConfigured()) return noStoreJson({ error: "Checkout is not configured for this environment." }, 503);
  const allowed = await consumeAuthRateLimit({ action: "checkout", identity: `${requestIdentity(request)}:${user.id}`, maximum: 10 });
  if (!allowed) return noStoreJson({ error: "Too many checkout attempts. Please try again later." }, 429);
  const { productSlug } = await params;
  const product = await getActiveProductBySlug(productSlug);
  if (!product) return noStoreJson({ error: "This product is unavailable." }, 404);
  if (await hasActiveEntitlement(user.id, product.id)) return noStoreJson({ ok: true, alreadyEntitled: true, libraryUrl: "/library" });
  const [order] = await getDb().insert(orders).values({ userId: user.id, productId: product.id, amount: product.priceAmount, currency: product.currency, status: "pending" }).returning({ id: orders.id });
  await getDb().insert(auditEvents).values({ actorId: user.id, entityType: "order", entityId: order.id, action: "checkout.started", after: { productId: product.id, amount: product.priceAmount, currency: product.currency } });
  return noStoreJson({ ok: true, orderId: order.id, status: "pending", message: "Awaiting a verified payment event." }, 201);
}
