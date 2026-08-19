import assert from "node:assert/strict";
import test from "node:test";
import { importTypeScript } from "./helpers/import-typescript.mjs";

const [runtimeEnv, readiness] = await Promise.all([
  importTypeScript(new URL("../lib/platform/runtime-env.ts", import.meta.url)),
  importTypeScript(new URL("../lib/platform/readiness.ts", import.meta.url)),
]);

const validEnvironment = {
  VERCEL: "1",
  VERCEL_ENV: "preview",
  ALIPROMPT_ENVIRONMENT: "preview",
  ALIPROMPT_APP_URL: "https://preview.aliprompt.example",
  POSTGRES_URL: "postgresql://aliprompt:never-return-me@preview-db.example/aliprompt",
  ALIPROMPT_DATABASE_ENVIRONMENT: "preview",
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_never_return_me_123456",
  ALIPROMPT_BLOB_ENVIRONMENT: "preview",
};

test("reports ready only after the database probe succeeds", async () => {
  let probeCalls = 0;
  const result = await readiness.evaluatePlatformReadiness({
    inspection: runtimeEnv.inspectRuntimeEnvironment(validEnvironment),
    databaseUrl: validEnvironment.POSTGRES_URL,
    probeDatabase: async () => {
      probeCalls += 1;
    },
    probeBlob: async () => undefined,
    now: () => new Date("2026-08-17T00:00:00.000Z"),
  });

  assert.equal(probeCalls, 1);
  assert.equal(result.status, "ready");
  assert.deepEqual(
    result.checks.map((check) => check.status),
    ["pass", "pass", "pass"],
  );
});

test("redacts database failures and never probes an invalid configuration", async () => {
  const rejected = await readiness.evaluatePlatformReadiness({
    inspection: runtimeEnv.inspectRuntimeEnvironment(validEnvironment),
    databaseUrl: validEnvironment.POSTGRES_URL,
    probeDatabase: async () => {
      throw new Error(`connection failed: ${validEnvironment.POSTGRES_URL}`);
    },
    probeBlob: async () => undefined,
  });
  assert.equal(rejected.status, "not_ready");
  assert.match(JSON.stringify(rejected), /database_unavailable/);
  assert.doesNotMatch(JSON.stringify(rejected), /never-return-me|postgresql:\/\//);

  let unsafeProbeCalls = 0;
  const invalid = await readiness.evaluatePlatformReadiness({
    inspection: runtimeEnv.inspectRuntimeEnvironment({}),
    databaseUrl: undefined,
    probeDatabase: async () => {
      unsafeProbeCalls += 1;
    },
    probeBlob: async () => undefined,
  });
  assert.equal(invalid.status, "not_ready");
  assert.equal(unsafeProbeCalls, 0);
});

test("fails closed when a schema or Blob dependency cannot be verified", async () => {
  const schemaFailure = await readiness.evaluatePlatformReadiness({
    inspection: runtimeEnv.inspectRuntimeEnvironment(validEnvironment),
    databaseUrl: validEnvironment.POSTGRES_URL,
    probeDatabase: async () => {
      throw new Error("expected table missing");
    },
    probeBlob: async () => undefined,
  });
  assert.equal(schemaFailure.status, "not_ready");
  assert.equal(
    schemaFailure.checks.find((check) => check.name === "database")?.code,
    "database_unavailable",
  );

  const blobFailure = await readiness.evaluatePlatformReadiness({
    inspection: runtimeEnv.inspectRuntimeEnvironment(validEnvironment),
    databaseUrl: validEnvironment.POSTGRES_URL,
    probeDatabase: async () => undefined,
    probeBlob: async () => {
      throw new Error("Blob token rejected");
    },
  });
  assert.equal(blobFailure.status, "not_ready");
  assert.equal(
    blobFailure.checks.find((check) => check.name === "blob")?.code,
    "blob_unavailable",
  );
});
