import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { auditEvents, entitlements, orders, paymentEvents } from "../db/schema";

const verifiedEventSchema = z.object({
  id: z.string().trim().min(8).max(255),
  orderId: z.string().uuid(),
  amount: z.number().int().nonnegative(),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  status: z.literal("paid"),
});

export type VerifiedPaymentEvent = z.infer<typeof verifiedEventSchema>;

export function paymentProviderIsConfigured() {
  return process.env.ALIPROMPT_PAYMENT_PROVIDER === "hmac_test"
    && (process.env.ALIPROMPT_ENVIRONMENT === "development" || process.env.ALIPROMPT_ENVIRONMENT === "preview")
    && Boolean(process.env.ALIPROMPT_PAYMENT_WEBHOOK_SECRET);
}

export function verifyHmacTestEvent(rawBody: string, signature: string | null) {
  const secret = process.env.ALIPROMPT_PAYMENT_WEBHOOK_SECRET;
  if (!paymentProviderIsConfigured() || !secret || !signature) return null;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "hex");
  const expectedBytes = Buffer.from(expected, "hex");
  if (received.length !== expectedBytes.length || !timingSafeEqual(received, expectedBytes)) return null;
  let body: unknown;
  try { body = JSON.parse(rawBody); } catch { return null; }
  const payload = verifiedEventSchema.safeParse(body);
  return payload.success ? payload.data : null;
}

export async function processVerifiedPaymentEvent(event: VerifiedPaymentEvent, payload: unknown) {
  return getDb().transaction(async (tx) => {
    const [recorded] = await tx.insert(paymentEvents).values({
      provider: "hmac_test", providerEventId: event.id, orderId: event.orderId, verifiedAt: new Date().toISOString(), payload,
    }).onConflictDoNothing().returning({ id: paymentEvents.id });
    if (!recorded) return { state: "duplicate" as const };

    const [order] = await tx.select({ id: orders.id, userId: orders.userId, productId: orders.productId, amount: orders.amount, currency: orders.currency, status: orders.status })
      .from(orders).where(eq(orders.id, event.orderId)).limit(1);
    const matchesOrder = order && order.amount === event.amount && order.currency === event.currency;
    if (!matchesOrder || order.status !== "pending") {
      await tx.insert(auditEvents).values({ entityType: "payment_event", entityId: recorded.id, action: "payment.rejected", reason: !order ? "unknown_order" : "amount_currency_or_state_mismatch", after: { orderId: event.orderId, amount: event.amount, currency: event.currency } });
      return { state: "rejected" as const };
    }
    const [paidOrder] = await tx.update(orders).set({ status: "paid", providerReference: event.id, updatedAt: new Date().toISOString() })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending"))).returning({ id: orders.id });
    if (!paidOrder) return { state: "duplicate" as const };
    await tx.insert(entitlements).values({ userId: order.userId, productId: order.productId, orderId: order.id, grantSource: "payment" }).onConflictDoNothing();
    await tx.insert(auditEvents).values({ entityType: "order", entityId: order.id, action: "payment.entitlement_granted", after: { productId: order.productId, provider: "hmac_test", providerEventId: event.id } });
    return { state: "paid" as const, orderId: order.id };
  });
}
