import assert from "node:assert/strict";
import test from "node:test";
import { assertGeneratedDemo, type GenerationProvenance, type ImageCodec, type VisualQaAdapter } from "../../../scripts/corpus/media/contracts";
import { detectImageMime, generateAndSanitize, sanitizeProviderOutput } from "../../../scripts/corpus/media/validation";
import { authorizeAttempt, imageSpendFormula, storageProjectionFormula } from "../../../scripts/corpus/media/spend";
import { orphanReceipt, previewBlobKey } from "../../../scripts/corpus/media/receipts";

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1]);
const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 4, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 1]);
const codec: ImageCodec = { decode: async (_bytes, mimeType) => ({ width: 640, height: 480, mimeType, isBlank: false }), reencode: async () => webp };
const qa: VisualQaAdapter = { perceptualHash: async () => "f00d", inspect: async () => [] };
const provenance: GenerationProvenance = { kind: "generated_demo", corpusRunId: "run-001", promptKey: "poster-001", promptVersion: "1.0.0", promptHash: "a".repeat(64), canonicalVariables: { subject: "synthetic fruit" }, adapterId: "approved-at-runtime", model: "runtime-model", configSnapshot: "snapshot-1", generatedAt: "2026-08-19T00:00:00.000Z" };

test("accepts only magic-verified, decoded, sanitized derivatives", async () => {
  assert.equal(detectImageMime(png), "image/png");
  const result = await sanitizeProviderOutput(png, provenance, codec, qa);
  assert.equal(result.mimeType, "image/webp");
  assert.equal(result.width, 640);
  assert.equal(result.sha256.length, 64);
  await assert.rejects(() => sanitizeProviderOutput(new Uint8Array([1, 2, 3]), provenance, codec, qa), /magic bytes/);
  await assert.rejects(() => sanitizeProviderOutput(png, provenance, codec, { ...qa, inspect: async () => [{ code: "watermark", severity: "block" }] }), /Visual QA blocked/);
});

test("placeholder covers cannot pass the generated-demo gate", () => {
  assert.throws(() => assertGeneratedDemo({ ...provenance, kind: "placeholder_cover", adapterId: undefined }), /placeholder_cover/);
  assert.doesNotThrow(() => assertGeneratedDemo(provenance));
});

test("generation request must be linked to the exact provenance record", async () => {
  const request = { corpusRunId: provenance.corpusRunId, promptKey: provenance.promptKey, promptVersion: provenance.promptVersion, promptHash: provenance.promptHash, canonicalVariables: provenance.canonicalVariables, adapterId: "approved-at-runtime", model: "runtime-model", configSnapshot: "snapshot-1" };
  const adapter = { id: "mock", generate: async () => ({ bytes: png }) };
  await assert.rejects(() => generateAndSanitize(adapter, { ...request, promptVersion: "2.0.0" }, provenance, codec, qa), /does not match/);
  assert.equal((await generateAndSanitize(adapter, request, provenance, codec, qa)).mimeType, "image/webp");
});

test("spend and storage remain bounded by approvals and measured inputs", () => {
  const stopped = authorizeAttempt({ approvalId: "DATA10K_PILOT_APPROVED", maxSpend: 10, spent: 9, attempts: 0, retryCeiling: 2, stopped: false }, 2);
  assert.equal(stopped.stopped, true);
  assert.match(imageSpendFormula(100, 120), /provider-approved/);
  assert.deepEqual(storageProjectionFormula({ acceptedImages: 10, averageBytes: 10, p95Bytes: 20 }, 100).averageFormula, "100 × measured_pilot_average_bytes");
});

test("preview Blob retries use a stable key and receive cleanup receipts", () => {
  const intent = { environment: "preview" as const, corpusRunId: "run-001", promptKey: "poster-001", promptVersion: "1.0.0", sanitizedSha256: "b".repeat(64) };
  assert.equal(previewBlobKey(intent), previewBlobKey(intent));
  assert.throws(() => previewBlobKey({ ...intent, environment: "production" as never }), /isolated Preview/);
  assert.deepEqual(orphanReceipt("corpus/run-001/media/a.webp", "run-001", "db_link_failed", "2026-08-19T00:00:00.000Z").cleanupStatus, "pending");
});
