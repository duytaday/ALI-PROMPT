export interface SpendLedger { approvalId: string; maxSpend: number; spent: number; attempts: number; retryCeiling: number; stopped: boolean }

/** Uses provider-supplied estimates only; unit pricing is intentionally not embedded in source. */
export function authorizeAttempt(ledger: SpendLedger, providerEstimatedCost: number): SpendLedger {
  if (!ledger.approvalId) throw new Error("Paid generation requires an explicit approval ID.");
  if (!Number.isFinite(providerEstimatedCost) || providerEstimatedCost < 0) throw new Error("Provider estimate must be a non-negative finite amount.");
  if (ledger.stopped || ledger.attempts >= ledger.retryCeiling || ledger.spent + providerEstimatedCost > ledger.maxSpend) return { ...ledger, stopped: true };
  return { ...ledger, attempts: ledger.attempts + 1, spent: ledger.spent + providerEstimatedCost };
}

export interface PilotStorageMetrics { acceptedImages: number; averageBytes: number; p95Bytes: number }
export function storageProjectionFormula(metrics: PilotStorageMetrics, targetImages: number) {
  if (metrics.acceptedImages < 1 || metrics.averageBytes < 0 || metrics.p95Bytes < 0 || targetImages < 0) throw new Error("Measured pilot metrics are required.");
  return {
    averageFormula: `${targetImages} × measured_pilot_average_bytes`,
    p95Formula: `${targetImages} × measured_pilot_p95_bytes`,
    observedAverageBytes: metrics.averageBytes,
    observedP95Bytes: metrics.p95Bytes,
  };
}

export function imageSpendFormula(targetImages: number, attempts: number) {
  if (targetImages < 0 || attempts < 0) throw new Error("Counts must be non-negative.");
  return `${attempts} provider-attempts (for ${targetImages} target images) × provider-approved per-attempt estimate`;
}
