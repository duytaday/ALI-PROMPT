import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("applies baseline browser security headers to every route", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

  for (const header of [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security",
  ]) {
    assert.match(config, new RegExp(header));
  }
  assert.match(config, /source:\s*"\/:path\*"/);
});
