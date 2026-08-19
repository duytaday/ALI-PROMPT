import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { contentHash, sha256 } from "./canonical";
import { assertCheckpointSource, loadCheckpoint, saveCheckpointAtomic } from "./checkpoint";
import { appendJsonl, readJsonl } from "./jsonl";
import type { BatchCheckpoint, CorpusRecord, RecordValidator, ValidationOptions } from "./types";
import { validateRecord } from "./validate";

export interface ProcessBatchOptions { runId: string; batchId: string; inputPath: string; artifactDirectory: string; validation?: ValidationOptions; recordValidator?: RecordValidator; }
export interface ProcessBatchResult { sourceHash: string; processed: number; accepted: number; rejected: number; resumedFromLine: number; checkpointPath: string; receiptPath: string; }

/** Processes an immutable input stream. Source JSONL is never repaired or rewritten on rejection. */
export async function processBatch(options: ProcessBatchOptions): Promise<ProcessBatchResult> {
  const sourceHash = sha256(await readFile(options.inputPath));
  const safeBatch = basename(options.batchId);
  if (safeBatch !== options.batchId || !safeBatch) throw new Error("batchId must be a single safe path segment");
  const checkpointPath = join(options.artifactDirectory, `${safeBatch}.checkpoint.json`);
  const receiptPath = join(options.artifactDirectory, `${safeBatch}.receipts.jsonl`);
  const prior = await loadCheckpoint(checkpointPath); assertCheckpointSource(prior, sourceHash);
  const checkpoint: BatchCheckpoint = prior ?? { schemaVersion: "data10k-checkpoint/1", runId: options.runId, batchId: options.batchId, sourceHash, completedLine: 0, acceptedKeys: [], rejected: [], updatedAt: new Date(0).toISOString() };
  if (checkpoint.runId !== options.runId || checkpoint.batchId !== options.batchId) throw new Error("Checkpoint belongs to another run or batch.");
  // Rebuild accepted identities from immutable input on resume; the checkpoint stays compact.
  const keys = new Set<string>(); const slugs = new Set<string>(); const hashes = new Set<string>();
  let processed = 0, accepted = 0, rejected = 0;
  for await (const { line, value } of readJsonl<CorpusRecord>(options.inputPath)) {
    if (line <= checkpoint.completedLine) {
      if (checkpoint.acceptedKeys.includes(value.promptKey)) { keys.add(value.promptKey); slugs.add(value.slug); hashes.add(contentHash(value)); }
      continue;
    }
    processed += 1;
    const result = options.recordValidator ? options.recordValidator(value) : validateRecord(value, options.validation);
    if (result.valid && (keys.has(value.promptKey) || slugs.has(value.slug) || hashes.has(result.contentHash!))) {
      result.valid = false;
      result.issues.push({ code: keys.has(value.promptKey) ? "PROMPT_KEY_DUPLICATE" : slugs.has(value.slug) ? "SLUG_DUPLICATE" : "CONTENT_HASH_DUPLICATE", path: "/", message: "Duplicate accepted identity/content within this batch" });
    }
    const receipt = result.valid ? { line, promptKey: value.promptKey, status: "accepted", contentHash: result.contentHash } : { line, promptKey: typeof value?.promptKey === "string" ? value.promptKey : null, status: "rejected", reasonCodes: result.issues.map((issue) => issue.code) };
    await appendJsonl(receiptPath, receipt);
    if (result.valid) { checkpoint.acceptedKeys.push(value.promptKey); keys.add(value.promptKey); slugs.add(value.slug); hashes.add(result.contentHash!); accepted += 1; } else { checkpoint.rejected.push({ line, reasonCodes: result.issues.map((issue) => issue.code) }); rejected += 1; }
    checkpoint.completedLine = line; checkpoint.updatedAt = new Date().toISOString();
    await saveCheckpointAtomic(checkpointPath, checkpoint);
  }
  return { sourceHash, processed, accepted, rejected, resumedFromLine: prior?.completedLine ?? 0, checkpointPath, receiptPath };
}

export function artifactRunDirectory(runId: string): string {
  if (!/^[a-z0-9][a-z0-9-]{2,127}$/u.test(runId)) throw new Error("runId must be lowercase letters, digits, and hyphens");
  return join(".codex-artifacts", "data10k", "runs", runId);
}
