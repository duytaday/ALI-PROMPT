import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  contentHash, createManifest, findNearDuplicateCandidates, generateStructuredJsonl, processBatch,
  readJsonl, validateCorpus, validateData10kContractRecord, validateRecord, writeImmutableManifest,
} from "../../../scripts/corpus/core/index";
import type { CorpusRecord } from "../../../scripts/corpus/core/types";

function record(overrides: Partial<CorpusRecord> = {}): CorpusRecord {
  const base: CorpusRecord = {
    schemaVersion: "1.0.0", corpusRunId: "run-001", promptKey: "coastal-poster-001", slug: "coastal-poster", categorySlug: "poster-design", promptVersion: 1,
    localizations: {
      vi: { title: "Áp phích lễ hội biển", summary: "Thiết kế áp phích cho lễ hội ven biển.", usageInstructions: "Điền biến và dùng bố cục phân cấp rõ ràng.", promptTemplate: "Thiết kế áp phích {{event_name}} với màu {{palette}}." },
      en: { title: "Coastal festival poster", summary: "Design a poster for a coastal festival.", usageInstructions: "Fill the variables and preserve clear hierarchy.", promptTemplate: "Design a {{event_name}} poster with a {{palette}} palette." },
    },
    canonicalImagePrompt: "Create a poster for {{event_name}} with {{palette}}, a clear headline zone, balanced hierarchy, and no logos or watermarks.",
    variableDefinitions: [{ name: "event_name", type: "string", example: "Harbor Lights" }, { name: "palette", type: "string", example: "coral and navy" }],
    usageMetadata: { useCase: "event promotion", expectedResult: "print-ready poster direction", difficulty: "intermediate", setupTimeMinutes: 10, outputType: "poster", steps: ["Fill variables", "Generate image"] },
    designMetadata: { objective: "Promote a community event", deliverable: "poster", subject: "coastal festival", context: "public event", composition: "centered headline", visualHierarchy: "headline then details", artDirection: "modern editorial", aspectRatio: "4:5", negativeConstraints: "No logos or watermarks" },
    modelCompatibility: "Unknown", safetyFlags: ["clean-room"], provenance: { generatorTemplateVersion: "g0", originalContentDeclaration: true, createdAt: "2026-08-19T00:00:00.000Z", reviewerState: "pending" },
  };
  return { ...base, ...overrides };
}

test("validates hashes, variables, Unicode, enums, and corpus uniqueness deterministically", () => {
  const first = record(); const hashed = { ...first, contentHash: contentHash(first) };
  assert.equal(validateRecord(hashed, { requireVietnameseDiacritic: true }).valid, true);
  const bad = record({ promptKey: "coastal-poster-002", slug: "coastal-poster-2", canonicalImagePrompt: "Create {{event_name}} only." });
  assert.ok(validateRecord(bad).issues.some((issue) => issue.code === "PLACEHOLDER_ROUND_TRIP"));
  assert.ok(validateCorpus([first, record({ promptKey: "coastal-poster-002" })]).some((issue) => issue.code === "SLUG_DUPLICATE"));
  assert.equal(contentHash(first), contentHash(record({ promptKey: "different-key", slug: "different-slug", provenance: { ...first.provenance, createdAt: "2026-08-20T00:00:00.000Z" } })), "identity and audit timestamps must not hide duplicate authored content");
  assert.ok(validateCorpus([first], { quotaPolicy: { quotas: { "poster-design": 0 } } }).some((issue) => issue.code === "QUOTA"));
});

test("immutable manifests hash stable sorted content and reject conflicting rewrites", async () => {
  const directory = await mkdtemp(join(tmpdir(), "data10k-core-")); const path = join(directory, "manifest.json");
  const manifest = createManifest("run-001", [record({ promptKey: "z-record", slug: "z-record" }), record({ promptKey: "a-record", slug: "a-record" })]);
  assert.deepEqual(manifest.records.map((entry) => entry.promptKey), ["a-record", "z-record"]);
  await writeImmutableManifest(path, manifest); await writeImmutableManifest(path, manifest);
  await assert.rejects(() => writeImmutableManifest(path, { ...manifest, hash: "0".repeat(64) }));
});

test("checkpoint makes a corrupt partial JSONL resumable without duplicating receipt records", async () => {
  const directory = await mkdtemp(join(tmpdir(), "data10k-core-")); const input = join(directory, "batch.jsonl"); const artifacts = join(directory, "artifacts");
  const first = record(); const second = record({ promptKey: "coastal-poster-002", slug: "coastal-poster-2", canonicalImagePrompt: "Create a travel poster for {{event_name}} with {{palette}}, a layered map-inspired hierarchy, and no logos or watermarks." });
  await writeFile(input, `${JSON.stringify(first)}\n{bad`, "utf8");
  await assert.rejects(() => processBatch({ runId: "run-001", batchId: "batch-001", inputPath: input, artifactDirectory: artifacts }));
  await writeFile(input, `${JSON.stringify(first)}\n${JSON.stringify(second)}\n`, "utf8");
  // The altered source is deliberately rejected: it prevents replaying a changed batch under one ID.
  await assert.rejects(() => processBatch({ runId: "run-001", batchId: "batch-001", inputPath: input, artifactDirectory: artifacts }), /sourceHash differs/);
  const result = await processBatch({ runId: "run-001", batchId: "batch-002", inputPath: input, artifactDirectory: artifacts });
  assert.equal(result.accepted, 2);
  const replay = await processBatch({ runId: "run-001", batchId: "batch-002", inputPath: input, artifactDirectory: artifacts });
  assert.equal(replay.processed, 0);
  const receipts = []; for await (const item of readJsonl(join(artifacts, "batch-002.receipts.jsonl"))) receipts.push(item);
  assert.equal(receipts.length, 2);
});

test("schema mismatch, forbidden terms, and calibrated near-duplicate candidates are surfaced", () => {
  assert.ok(validateRecord(record({ schemaVersion: "2.0.0" }), { schemaVersion: "1.0.0" }).issues.some((issue) => issue.code === "SCHEMA" || issue.code === "SCHEMA_VERSION"));
  assert.ok(validateRecord(record({ canonicalImagePrompt: "Create a disney inspired {{event_name}} with {{palette}} in a clear composition." })).issues.some((issue) => issue.code === "FORBIDDEN_TERM"));
  const twin = record({ promptKey: "coastal-poster-002", slug: "coastal-poster-2" });
  assert.equal(findNearDuplicateCandidates([record(), twin], { calibrationId: "pilot-01", jaccardThreshold: 0.9, simHashMaxDistance: 2 }).length, 1);
});

test("model interface refuses narration and retries only after a diagnosed changed request", async () => {
  let calls = 0;
  const result = await generateStructuredJsonl({ generate: async () => ({ jsonl: calls++ === 0 ? "narration" : "{\"ok\":true}\n", inputTokens: 2, outputTokens: 3 }) }, { stablePrefix: "schema", dynamicBatch: { slice: 1 }, schemaVersion: "1.0.0" }, async () => ({ diagnosedCause: "removed narration instruction ambiguity", request: { stablePrefix: "schema", dynamicBatch: { slice: 2 }, schemaVersion: "1.0.0" } }));
  assert.equal(result.ledger.attempts, 2); assert.deepEqual(result.repairs, ["removed narration instruction ambiguity"]);
  await assert.rejects(() => generateStructuredJsonl({ generate: async () => ({ jsonl: "narration" }) }, { stablePrefix: "schema", dynamicBatch: { slice: 1 }, schemaVersion: "1.0.0" }, async (_error, request) => ({ diagnosedCause: "but unchanged", request })), /did not change/);
});

test("accepts the architect-owned versioned DATA10K contract without weakening the baseline validator", () => {
  const sample = JSON.parse(readFileSync("data/corpus/contracts/samples/packaging-herbal-infusion-refill.v1.0.0.json", "utf8"));
  assert.equal(validateData10kContractRecord(sample).valid, true);
  assert.equal(validateRecord(sample).valid, false, "the legacy core contract must not silently masquerade as the canonical DATA10K schema");
  assert.equal(validateData10kContractRecord({ ...sample, provenance: { ...sample.provenance, generatedAt: "not-a-date" } }).valid, false, "provenance timestamps must satisfy the versioned contract");
});

test("processes a strict DATA10K record through the resumable pipeline adapter", async () => {
  const directory = await mkdtemp(join(tmpdir(), "data10k-contract-adapter-"));
  const input = join(directory, "architect-sample.jsonl");
  const sample = JSON.parse(readFileSync("data/corpus/contracts/samples/packaging-herbal-infusion-refill.v1.0.0.json", "utf8"));
  await writeFile(input, `${JSON.stringify(sample)}\n`, "utf8");
  const result = await processBatch({ runId: "data10k-g0", batchId: "architect-sample", inputPath: input, artifactDirectory: join(directory, "receipts"), recordValidator: validateData10kContractRecord });
  assert.equal(result.accepted, 1);
  assert.equal(result.rejected, 0);
});
