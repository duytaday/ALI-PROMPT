import assert from "node:assert/strict";
import test from "node:test";
import { importTypeScript } from "./helpers/import-typescript.mjs";

const runtimeEnv = await importTypeScript(
  new URL("../lib/platform/runtime-env.ts", import.meta.url),
);

const validPreviewEnvironment = {
  VERCEL: "1",
  VERCEL_ENV: "preview",
  ALIPROMPT_ENVIRONMENT: "preview",
  ALIPROMPT_APP_URL: "https://preview.aliprompt.example",
  POSTGRES_URL: "postgresql://aliprompt:top-secret@preview-db.example/aliprompt",
  ALIPROMPT_DATABASE_ENVIRONMENT: "preview",
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_top_secret_token_123456",
  ALIPROMPT_BLOB_ENVIRONMENT: "preview",
};

test("accepts a fully tagged Vercel Preview configuration without exposing secrets", () => {
  const result = runtimeEnv.inspectRuntimeEnvironment(validPreviewEnvironment);
  const serialized = JSON.stringify(result);

  assert.equal(result.ok, true);
  assert.equal(result.provider, "vercel");
  assert.equal(result.environment, "preview");
  assert.doesNotMatch(serialized, /top-secret|top_secret|postgresql:\/\//);
});

test("fails closed when Preview is tagged with Production resources", () => {
  const result = runtimeEnv.inspectRuntimeEnvironment({
    ...validPreviewEnvironment,
    ALIPROMPT_DATABASE_ENVIRONMENT: "production",
    ALIPROMPT_BLOB_ENVIRONMENT: "production",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.code),
    ["database_environment_mismatch", "blob_environment_mismatch"],
  );
});

test("rejects missing, malformed, and locally unsafe environment configuration", () => {
  const missing = runtimeEnv.inspectRuntimeEnvironment({ VERCEL: "1" });
  assert.equal(missing.ok, false);
  assert.ok(missing.issues.some((issue) => issue.code === "missing_vercel_environment"));
  assert.ok(missing.issues.some((issue) => issue.code === "missing_application_url"));
  assert.ok(missing.issues.some((issue) => issue.code === "missing_database_url"));

  const malformed = runtimeEnv.inspectRuntimeEnvironment({
    ...validPreviewEnvironment,
    POSTGRES_URL: "https://not-a-postgres-database.example",
    ALIPROMPT_APP_URL: "http://preview.aliprompt.example/has-a-path",
    BLOB_READ_WRITE_TOKEN: "<development-blob-token>",
  });
  assert.ok(malformed.issues.some((issue) => issue.code === "invalid_database_url"));
  assert.ok(malformed.issues.some((issue) => issue.code === "invalid_application_url"));
  assert.ok(malformed.issues.some((issue) => issue.code === "invalid_blob_token"));

  const localProduction = runtimeEnv.inspectRuntimeEnvironment({
    ...validPreviewEnvironment,
    VERCEL: undefined,
    VERCEL_ENV: undefined,
    ALIPROMPT_ENVIRONMENT: "production",
    ALIPROMPT_DATABASE_ENVIRONMENT: "production",
    ALIPROMPT_BLOB_ENVIRONMENT: "production",
  });
  assert.ok(
    localProduction.issues.some(
      (issue) => issue.code === "non_development_environment_outside_vercel",
    ),
  );
});
