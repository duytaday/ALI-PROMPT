#!/usr/bin/env tsx
import { join, resolve } from "node:path";
import { createManifest, writeImmutableManifest } from "./manifest";
import { artifactRunDirectory, processBatch } from "./pipeline";
import { readJsonl } from "./jsonl";
import type { CorpusRecord } from "./types";
import { validateCorpus } from "./validate";

function usage(): never { throw new Error("Usage: tsx scripts/corpus/core/cli.ts <plan|pilot|generate|validate> --run <run-id> --input <batch.jsonl> [--batch <batch-id>]"); }
function args(argv: string[]): Record<string, string> { const out: Record<string, string> = {}; for (let index = 0; index < argv.length; index += 2) { const key = argv[index]; const value = argv[index + 1]; if (!key?.startsWith("--") || !value) usage(); out[key.slice(2)] = value; } return out; }
async function records(input: string): Promise<CorpusRecord[]> { const out: CorpusRecord[] = []; for await (const row of readJsonl<CorpusRecord>(input)) out.push(row.value); return out; }
async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2); if (!command || command === "--help") usage(); const flags = args(rest); const runId = flags.run; const input = flags.input; if (!runId || !input) usage();
  const root = artifactRunDirectory(runId); const source = resolve(input); const data = await records(source);
  if (command === "plan") { const issues = validateCorpus(data); if (issues.length) throw new Error(`Plan validation failed: ${JSON.stringify(issues)}`); const manifest = createManifest(runId, data); const path = join(root, "manifest.json"); await writeImmutableManifest(path, manifest); console.log(JSON.stringify({ command, manifestPath: path, hash: manifest.hash, canonicalCount: data.length })); return; }
  if (command === "validate") { const issues = validateCorpus(data); console.log(JSON.stringify({ command, input: source, canonicalCount: data.length, valid: !issues.length, issues })); if (issues.length) process.exitCode = 1; return; }
  if (command === "pilot" || command === "generate") { if (command === "generate") console.warn("No provider is invoked by this core CLI; generate only validates/checkpoints a locally supplied JSONL batch."); const batchId = flags.batch ?? "batch-001"; const result = await processBatch({ runId, batchId, inputPath: source, artifactDirectory: join(root, "receipts") }); console.log(JSON.stringify({ command, ...result })); return; }
  usage();
}
main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
