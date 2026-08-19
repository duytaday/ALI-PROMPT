import { del, get, head, put } from "@vercel/blob";

const MAX_MEDIA_BYTES = 3 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function assertPromptMedia(file: File) {
  if (!ALLOWED_MEDIA_TYPES.has(file.type)) throw new Error("Unsupported media type.");
  if (file.size < 1 || file.size > MAX_MEDIA_BYTES) throw new Error("Media exceeds the allowed size.");
}

export async function stagePromptMedia(key: string, file: File) {
  assertPromptMedia(file);
  return put(key, file, { access: "private", addRandomSuffix: true, contentType: file.type });
}

export async function verifyPromptMedia(key: string) {
  const blob = await head(key);
  if (!blob || !ALLOWED_MEDIA_TYPES.has(blob.contentType)) throw new Error("Staged media could not be verified.");
  return blob;
}

export async function discardStagedPromptMedia(key: string) {
  await del(key);
}

export async function readPromptMedia(key: string) {
  const result = await get(key, { access: "private" });
  if (!result || !result.stream || !ALLOWED_MEDIA_TYPES.has(result.blob.contentType)) return null;
  return result;
}
