import { createHash } from "node:crypto";
import { normalizeText } from "./canonical";
import type { CorpusRecord, NearDuplicateCandidate, NearDuplicateConfig } from "./types";

function shingles(value: string, size: number): Set<string> {
  const words = normalizeText(value).split(" ").filter(Boolean);
  const out = new Set<string>();
  for (let index = 0; index <= words.length - size; index += 1) out.add(words.slice(index, index + size).join(" "));
  return out;
}
function jaccard(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right]);
  let common = 0; for (const token of left) if (right.has(token)) common += 1;
  return union.size ? common / union.size : 0;
}
function simHash(tokens: Set<string>): number {
  const bits = Array<number>(32).fill(0);
  for (const token of tokens) {
    const digest = createHash("sha256").update(token).digest();
    const number = digest.readUInt32BE(0);
    for (let bit = 0; bit < 32; bit += 1) bits[bit] += (number & (1 << bit)) === 0 ? -1 : 1;
  }
  return bits.reduce((hash, weight, bit) => weight >= 0 ? hash | (1 << bit) : hash, 0);
}
function hamming(left: number, right: number): number {
  let xor = left ^ right, count = 0; while (xor) { count += 1; xor &= xor - 1; } return count;
}

/** Candidate-only signal. Thresholds must be calibrated and recorded from a human-reviewed pilot. */
export function findNearDuplicateCandidates(records: readonly CorpusRecord[], config: NearDuplicateConfig): NearDuplicateCandidate[] {
  if (!config.calibrationId) throw new Error("A pilot calibrationId is required for near-duplicate candidate detection.");
  const size = config.shingleSize ?? 3;
  const fingerprints = records.map((record) => {
    const tokens = shingles(`${record.canonicalImagePrompt} ${record.localizations.en.title}`, size);
    return { record, tokens, simHash: simHash(tokens) };
  });
  const candidates: NearDuplicateCandidate[] = [];
  for (let left = 0; left < fingerprints.length; left += 1) for (let right = left + 1; right < fingerprints.length; right += 1) {
    const score = jaccard(fingerprints[left].tokens, fingerprints[right].tokens);
    const distance = hamming(fingerprints[left].simHash, fingerprints[right].simHash);
    if (score >= config.jaccardThreshold || distance <= config.simHashMaxDistance) candidates.push({ leftPromptKey: fingerprints[left].record.promptKey, rightPromptKey: fingerprints[right].record.promptKey, jaccard: score, simHashDistance: distance });
  }
  return candidates;
}
