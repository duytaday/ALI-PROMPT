import { createHash } from "node:crypto";
import type { CorpusRecord, JsonObject } from "./types";

/** Stable JSON representation: object keys are lexical, arrays retain their meaningful order. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const object = value as JsonObject;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
    .join(",")}}`;
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Excludes only the derived hash itself; all authored content remains in the digest. */
export function normalizedRecord(record: CorpusRecord): JsonObject {
  // Run/identity fields cannot make a noun-swap duplicate look novel. They remain in the
  // manifest entry, but are intentionally outside the semantic-content fingerprint.
  const authored: JsonObject = { ...record };
  // Provenance tracks auditability but must not mask identical authored content across
  // runs, timestamps, or review states.
  for (const field of ["contentHash", "corpusRunId", "promptKey", "slug", "provenance"]) delete authored[field];
  return authored;
}

export function contentHash(record: CorpusRecord): string {
  return sha256(stableStringify(normalizedRecord(record)));
}

export function normalizeText(input: string): string {
  return input.normalize("NFC").replace(/\s+/gu, " ").trim().toLocaleLowerCase("en-US");
}
