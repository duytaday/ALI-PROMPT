import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { paymentProviderIsConfigured, verifyHmacTestEvent } from "../lib/payment";

const originalEnvironment = { ...process.env };

function restoreEnvironment() {
  for (const key of Object.keys(process.env)) if (!(key in originalEnvironment)) delete process.env[key];
  Object.assign(process.env, originalEnvironment);
}

test("HMAC fixture payments are accepted only in development or Preview with an exact signature", () => {
  try {
    process.env.ALIPROMPT_ENVIRONMENT = "preview";
    process.env.ALIPROMPT_PAYMENT_PROVIDER = "hmac_test";
    process.env.ALIPROMPT_PAYMENT_WEBHOOK_SECRET = "test-only-secret";
    const raw = JSON.stringify({ id: "payment-event-001", orderId: "11111111-1111-4111-8111-111111111111", amount: 150000, currency: "vnd", status: "paid" });
    const signature = createHmac("sha256", process.env.ALIPROMPT_PAYMENT_WEBHOOK_SECRET).update(raw).digest("hex");
    assert.equal(paymentProviderIsConfigured(), true);
    assert.deepEqual(verifyHmacTestEvent(raw, signature), { id: "payment-event-001", orderId: "11111111-1111-4111-8111-111111111111", amount: 150000, currency: "VND", status: "paid" });
    assert.equal(verifyHmacTestEvent(raw, "00".repeat(32)), null);
    assert.equal(verifyHmacTestEvent("not-json", signature), null);
    process.env.ALIPROMPT_ENVIRONMENT = "production";
    assert.equal(paymentProviderIsConfigured(), false);
    assert.equal(verifyHmacTestEvent(raw, signature), null);
  } finally {
    restoreEnvironment();
  }
});
