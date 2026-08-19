import "server-only";

import { list } from "@vercel/blob";
import postgres from "postgres";
import { evaluatePlatformReadiness } from "./readiness";
import { inspectRuntimeEnvironment } from "./runtime-env";

async function probePostgres(databaseUrl: string, timeoutMs: number) {
  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: Math.max(1, Math.ceil(timeoutMs / 1_000)),
    idle_timeout: 1,
  });

  try {
    await client`select 1 as ready`;
    const requiredPublicTables = [
      "users",
      "prompts",
      "prompt_versions",
      "favorites",
      "entitlements",
    ];
    const result = await client<
      { table_schema: string | null; table_name: string | null }[]
    >`
      select table_schema, table_name
      from information_schema.tables
      where (
        table_schema = 'public'
        and table_name in ${client(requiredPublicTables)}
      ) or (
        table_schema = 'drizzle'
        and table_name = '__drizzle_migrations'
      )
    `;
    const availableTables = new Set(
      result.map(({ table_schema, table_name }) => `${table_schema}.${table_name}`),
    );
    const hasRequiredSchema =
      requiredPublicTables.every((table) => availableTables.has(`public.${table}`)) &&
      availableTables.has("drizzle.__drizzle_migrations");
    if (!hasRequiredSchema) {
      throw new Error("Required schema tables are unavailable.");
    }
  } finally {
    await client.end({ timeout: 1 }).catch(() => undefined);
  }
}

async function probeBlob(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await list({ limit: 1, abortSignal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPlatformReadiness(
  environment: Record<string, string | undefined> = process.env,
) {
  const inspection = inspectRuntimeEnvironment(environment);
  return evaluatePlatformReadiness({
    inspection,
    databaseUrl: environment.POSTGRES_URL?.trim(),
    probeDatabase: probePostgres,
    probeBlob,
  });
}
