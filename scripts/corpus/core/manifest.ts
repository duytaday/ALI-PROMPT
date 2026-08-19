import { readFile } from "node:fs/promises";
import { contentHash, sha256, stableStringify } from "./canonical";
import { exists, writeAtomic } from "./jsonl";
import type { CorpusRecord, ImmutableManifest, ManifestEntry } from "./types";

function material(runId: string, records: ManifestEntry[]): Omit<ImmutableManifest, "hash"> {
  return { schemaVersion: "data10k-manifest/1", runId, createdAt: "deterministic", records };
}

export function createManifest(runId: string, records: readonly CorpusRecord[]): ImmutableManifest {
  const entries = records.map((record) => ({
    promptKey: record.promptKey, contentHash: contentHash(record), categorySlug: record.categorySlug, promptVersion: record.promptVersion,
  })).sort((a, b) => a.promptKey.localeCompare(b.promptKey));
  const duplicate = entries.find((entry, index) => index > 0 && entries[index - 1].promptKey === entry.promptKey);
  if (duplicate) throw new Error(`Cannot manifest duplicate promptKey: ${duplicate.promptKey}`);
  const body = material(runId, entries);
  return { ...body, hash: sha256(stableStringify(body)) };
}

export function verifyManifest(manifest: ImmutableManifest): boolean {
  const { hash, ...body } = manifest;
  return hash === sha256(stableStringify(body));
}

/** Existing output is accepted only when byte-equivalent in its deterministic representation. */
export async function writeImmutableManifest(filePath: string, manifest: ImmutableManifest): Promise<void> {
  if (!verifyManifest(manifest)) throw new Error("Refusing to write a manifest with an invalid hash.");
  const serialized = `${stableStringify(manifest)}\n`;
  if (await exists(filePath)) {
    if (await readFile(filePath, "utf8") !== serialized) throw new Error(`Immutable manifest already exists with different content: ${filePath}`);
    return;
  }
  await writeAtomic(filePath, serialized);
}
