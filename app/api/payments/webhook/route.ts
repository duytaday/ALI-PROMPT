import { NextRequest } from "next/server";
import { paymentProviderIsConfigured, processVerifiedPaymentEvent, verifyHmacTestEvent } from "../../../../lib/payment";
import { noStoreJson } from "../../../../lib/request-security";

export async function POST(request: NextRequest) {
  if (!paymentProviderIsConfigured()) return noStoreJson({ error: "Payment webhook is not configured." }, 503);
  const rawBody = await request.text();
  const event = verifyHmacTestEvent(rawBody, request.headers.get("x-aliprompt-signature"));
  if (!event) return noStoreJson({ error: "Invalid webhook signature or payload." }, 401);
  const result = await processVerifiedPaymentEvent(event, JSON.parse(rawBody));
  return noStoreJson({ ok: true, ...result });
}
