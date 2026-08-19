import { readFile } from "node:fs/promises";
import { exists, writeAtomic } from "./jsonl";
import type { BatchCheckpoint } from "./types";

export async function loadCheckpoint(filePath: string): Promise<BatchCheckpoint | undefined> {
  if (!(await exists(filePath))) return undefined;
  const candidate = JSON.parse(await readFile(filePath, "utf8")) as BatchCheckpoint;
  if (!candidate.runId || !candidate.batchId || !Number.isInteger(candidate.completedLine)) {
    throw new Error(`Invalid checkpoint: ${filePath}`);
  }
  return candidate;
}

export async function saveCheckpointAtomic(filePath: string, checkpoint: BatchCheckpoint): Promise<void> {
  await writeAtomic(filePath, `${JSON.stringify(checkpoint, null, 2)}\n`);
}

export function assertCheckpointSource(checkpoint: BatchCheckpoint | undefined, sourceHash: string): void {
  if (checkpoint && checkpoint.sourceHash !== sourceHash) {
    throw new Error("Checkpoint sourceHash differs from batch source; create a new batch ID rather than replaying altered input.");
  }
}
