import { createReadStream } from "node:fs";
import { appendFile, mkdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class JsonlParseError extends Error {
  constructor(public readonly line: number, message: string) {
    super(`JSONL line ${line}: ${message}`);
  }
}

export async function* readJsonl<T>(filePath: string): AsyncGenerator<{ line: number; value: T }> {
  const stream = createReadStream(filePath, { encoding: "utf8" });
  let buffered = "";
  let line = 0;
  for await (const chunk of stream) {
    buffered += chunk;
    let index: number;
    while ((index = buffered.indexOf("\n")) >= 0) {
      const raw = buffered.slice(0, index).replace(/\r$/u, "");
      buffered = buffered.slice(index + 1);
      line += 1;
      if (!raw.trim()) continue;
      try { yield { line, value: JSON.parse(raw) as T }; }
      catch (error) { throw new JsonlParseError(line, error instanceof Error ? error.message : "invalid JSON"); }
    }
  }
  if (buffered.length > 0) {
    line += 1;
    try { yield { line, value: JSON.parse(buffered.replace(/\r$/u, "")) as T }; }
    catch (error) { throw new JsonlParseError(line, `truncated or invalid final record: ${error instanceof Error ? error.message : "invalid JSON"}`); }
  }
}

/** A line is appended only after it can be serialized; checkpoints make replay idempotent. */
export async function appendJsonl(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

/** Write immutable artifacts via sibling temp + rename, never exposing a partially-written target. */
export async function writeAtomic(filePath: string, data: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temporary, data, "utf8");
    await rename(temporary, filePath);
  } finally {
    await unlink(temporary).catch(() => undefined);
  }
}

export async function exists(filePath: string): Promise<boolean> {
  return stat(filePath).then(() => true, () => false);
}
