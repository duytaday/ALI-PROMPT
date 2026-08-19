import { sha256 } from "./contracts";

export interface BlobIntent { environment: "preview"; corpusRunId: string; promptKey: string; promptVersion: string; sanitizedSha256: string }
export interface OrphanCleanupReceipt { blobKey: string; corpusRunId: string; reason: "upload_failed" | "db_link_failed" | "validation_failed"; cleanupStatus: "pending" | "deleted" | "manual_review"; createdAt: string }

/** Content-addressed preview-only key makes retry uploads converge before any Blob call. */
export function previewBlobKey(intent: BlobIntent): string {
  if (intent.environment !== "preview") throw new Error("Corpus media keys are restricted to isolated Preview.");
  const stable = sha256(`${intent.corpusRunId}\n${intent.promptKey}\n${intent.promptVersion}\n${intent.sanitizedSha256}`);
  return `corpus/${intent.corpusRunId}/media/${stable.slice(0, 2)}/${stable}.webp`;
}

export function orphanReceipt(blobKey: string, corpusRunId: string, reason: OrphanCleanupReceipt["reason"], now = new Date().toISOString()): OrphanCleanupReceipt {
  return { blobKey, corpusRunId, reason, cleanupStatus: "pending", createdAt: now };
}
