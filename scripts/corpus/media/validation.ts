import {
  DELIVERY_MEDIA_TYPES, type DecodedImage, type DeliveryMediaType, type ImageCodec, type ImageGenerationAdapter,
  type ReencodePolicy, type SanitizedMedia, type VisualQaAdapter, type GenerationProvenance, sha256,
} from "./contracts";

const MAX_BYTES = 3 * 1024 * 1024;

export function detectImageMime(bytes: Uint8Array): DeliveryMediaType | null {
  const has = (...magic: number[]) => magic.every((value, index) => bytes[index] === value);
  if (has(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (has(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (has(0x52, 0x49, 0x46, 0x46) && bytes.length >= 12 && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

export interface ValidationPolicy extends ReencodePolicy { maxBytes: number; minWidth: number; minHeight: number }
export const defaultValidationPolicy: ValidationPolicy = {
  outputMimeType: "image/webp", maxWidth: 2048, maxHeight: 2048, quality: 82, stripMetadata: true,
  maxBytes: MAX_BYTES, minWidth: 64, minHeight: 64,
};

function assertDecoded(decoded: DecodedImage, policy: ValidationPolicy) {
  if (!DELIVERY_MEDIA_TYPES.includes(decoded.mimeType)) throw new Error("Decoder produced an unsupported delivery MIME type.");
  if (!Number.isSafeInteger(decoded.width) || !Number.isSafeInteger(decoded.height) || decoded.width < policy.minWidth || decoded.height < policy.minHeight) throw new Error("Image dimensions are outside the approved range.");
  if (decoded.width > policy.maxWidth || decoded.height > policy.maxHeight) throw new Error("Image dimensions exceed the approved range.");
  if (decoded.isBlank) throw new Error("Blank image output is rejected.");
}

/** Validates raw magic/decode, then only exposes a re-encoded metadata-stripped derivative. */
export async function sanitizeProviderOutput(
  raw: Uint8Array, provenance: GenerationProvenance, codec: ImageCodec, qa: VisualQaAdapter, policy = defaultValidationPolicy,
): Promise<SanitizedMedia> {
  if (raw.length < 1 || raw.length > policy.maxBytes) throw new Error("Raw image byte length is outside the approved range.");
  const magicMime = detectImageMime(raw);
  if (!magicMime) throw new Error("Raw image magic bytes are not an allowed image type.");
  const decoded = await codec.decode(raw, magicMime);
  if (decoded.mimeType !== magicMime) throw new Error("Decoded MIME type does not match image magic bytes.");
  assertDecoded(decoded, policy);
  const sanitized = await codec.reencode(decoded, raw, policy);
  if (sanitized.length < 1 || sanitized.length > policy.maxBytes) throw new Error("Sanitized image byte length is outside the approved range.");
  const outputMime = detectImageMime(sanitized);
  if (outputMime !== policy.outputMimeType) throw new Error("Re-encoder did not produce the approved delivery type.");
  const outputDecoded = await codec.decode(sanitized, outputMime);
  assertDecoded(outputDecoded, policy);
  const findings = await qa.inspect(outputDecoded, sanitized);
  if (findings.some((finding) => finding.severity === "block")) throw new Error("Visual QA blocked this media output.");
  return { bytes: sanitized, mimeType: outputMime, width: outputDecoded.width, height: outputDecoded.height, sha256: sha256(sanitized), perceptualHash: await qa.perceptualHash(outputDecoded, sanitized), findings };
}

/** No default provider exists: calling code must resolve an approved runtime adapter. */
export async function generateAndSanitize(
  adapter: ImageGenerationAdapter, request: Parameters<ImageGenerationAdapter["generate"]>[0], provenance: GenerationProvenance,
  codec: ImageCodec, qa: VisualQaAdapter, policy?: ValidationPolicy,
): Promise<SanitizedMedia> {
  if (request.corpusRunId !== provenance.corpusRunId || request.promptKey !== provenance.promptKey || request.promptVersion !== provenance.promptVersion || request.promptHash !== provenance.promptHash) {
    throw new Error("Generation request does not match its media provenance linkage.");
  }
  if (request.adapterId !== provenance.adapterId || request.model !== provenance.model || request.configSnapshot !== provenance.configSnapshot) {
    throw new Error("Generation provider configuration does not match its media provenance linkage.");
  }
  const output = await adapter.generate(request);
  if (output.reportedMimeType && !DELIVERY_MEDIA_TYPES.includes(output.reportedMimeType as DeliveryMediaType)) throw new Error("Provider reported an unsupported MIME type.");
  return sanitizeProviderOutput(output.bytes, provenance, codec, qa, policy);
}
