import { sha256, stableStringify } from "./canonical";
import type { StructuredModelAdapter, StructuredModelRequest, TokenLedger } from "./types";

export interface RepairableBatch { request: StructuredModelRequest; diagnosedCause: string; }
export interface StructuredGenerationResult { jsonl: string; ledger: TokenLedger; repairs: string[]; }

/** No provider implementation belongs here: this enforces JSONL-only responses and non-identical retries. */
export async function generateStructuredJsonl(adapter: StructuredModelAdapter, initial: StructuredModelRequest, repair: (failure: Error, prior: StructuredModelRequest) => Promise<RepairableBatch>, maxAttempts = 3): Promise<StructuredGenerationResult> {
  if (!initial.stablePrefix || !initial.dynamicBatch || maxAttempts < 1) throw new Error("Stable prefix, dynamic batch, and a positive retry ceiling are required.");
  let request = initial; let previousSignature = ""; const ledger: TokenLedger = { inputTokens: 0, outputTokens: 0, attempts: 0 }; const repairs: string[] = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const signature = sha256(stableStringify(request));
    if (signature === previousSignature) throw new Error("Retry refused: diagnosed cause did not change the model request.");
    previousSignature = signature; ledger.attempts += 1;
    try {
      const response = await adapter.generate(request);
      const lines = response.jsonl.trim().split(/\r?\n/u);
      if (!response.jsonl.trim() || lines.some((line) => { try { const parsed: unknown = JSON.parse(line); return !parsed || Array.isArray(parsed) || typeof parsed !== "object"; } catch { return true; } })) throw new Error("Adapter returned narration, an array, or invalid JSON instead of JSONL objects.");
      ledger.inputTokens += response.inputTokens ?? 0; ledger.outputTokens += response.outputTokens ?? 0; return { jsonl: response.jsonl, ledger, repairs };
    }
    catch (failure) { if (attempt === maxAttempts) throw failure; const next = await repair(failure instanceof Error ? failure : new Error("Unknown adapter failure"), request); if (!next.diagnosedCause.trim()) throw new Error("Retry requires a diagnosed cause."); repairs.push(next.diagnosedCause); request = next.request; }
  }
  throw new Error("Unreachable retry state");
}
