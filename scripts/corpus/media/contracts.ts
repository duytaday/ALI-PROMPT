import { createHash } from "node:crypto";

export const DELIVERY_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type DeliveryMediaType = (typeof DELIVERY_MEDIA_TYPES)[number];
export type DemoKind = "placeholder_cover" | "generated_demo";
export type Environment = "local" | "preview" | "production";

export type CanonicalVariables = Record<string, string | number | boolean>;

export interface GenerationRequest {
  corpusRunId: string;
  promptKey: string;
  promptVersion: string;
  promptHash: string;
  canonicalVariables: CanonicalVariables;
  adapterId: string;
  model: string;
  configSnapshot: string;
}

export interface ProviderImageOutput {
  bytes: Uint8Array;
  reportedMimeType?: string;
  providerRequestId?: string;
  modelSnapshot?: string;
}

/** An adapter is supplied only by a separately approved runtime configuration. */
export interface ImageGenerationAdapter {
  readonly id: string;
  generate(request: GenerationRequest): Promise<ProviderImageOutput>;
}

export interface GenerationProvenance {
  kind: DemoKind;
  corpusRunId: string;
  promptKey: string;
  promptVersion: string;
  promptHash: string;
  canonicalVariables: CanonicalVariables;
  adapterId?: string;
  model?: string;
  configSnapshot?: string;
  providerRequestId?: string;
  modelSnapshot?: string;
  generatedAt: string;
}

export interface DecodedImage {
  width: number;
  height: number;
  mimeType: DeliveryMediaType;
  isBlank: boolean;
}

/** Decoder/re-encoder implementations are deliberately injected; no unsafe parser is bundled. */
export interface ImageCodec {
  decode(bytes: Uint8Array, mimeType: DeliveryMediaType): Promise<DecodedImage>;
  reencode(decoded: DecodedImage, source: Uint8Array, policy: ReencodePolicy): Promise<Uint8Array>;
}

export interface ReencodePolicy {
  outputMimeType: DeliveryMediaType;
  maxWidth: number;
  maxHeight: number;
  quality: number;
  stripMetadata: true;
}

export interface VisualQaAdapter {
  perceptualHash(decoded: DecodedImage, sanitized: Uint8Array): Promise<string>;
  inspect(decoded: DecodedImage, sanitized: Uint8Array): Promise<VisualQaFinding[]>;
}

export type VisualQaCode = "unsafe" | "text_or_logo" | "watermark" | "severe_artifact" | "bad_crop" | "visual_mismatch";
export interface VisualQaFinding { code: VisualQaCode; severity: "block" | "review"; detail?: string }

export interface SanitizedMedia {
  bytes: Uint8Array;
  mimeType: DeliveryMediaType;
  width: number;
  height: number;
  sha256: string;
  perceptualHash: string;
  findings: VisualQaFinding[];
}

export const sha256 = (bytes: Uint8Array | string) => createHash("sha256").update(bytes).digest("hex");

export function assertGeneratedDemo(provenance: GenerationProvenance): void {
  if (provenance.kind !== "generated_demo") throw new Error("A placeholder_cover cannot satisfy the generated_demo media gate.");
  for (const key of ["adapterId", "model", "configSnapshot"] as const) if (!provenance[key]) throw new Error(`generated_demo provenance is missing ${key}.`);
}
