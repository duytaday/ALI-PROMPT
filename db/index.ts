import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: postgres.Sql | undefined;

/**
 * Keep each warm serverless instance within a small, predictable connection
 * budget. POSTGRES_URL must point at the Supabase transaction pooler for
 * request traffic; migrations use POSTGRES_MIGRATION_URL separately.
 */
export const RUNTIME_DATABASE_OPTIONS = {
  max: 1,
  prepare: false,
  connect_timeout: 5,
  idle_timeout: 20,
} as const;

export function hasDatabaseUrl() {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function databaseUrl() {
  const value = process.env.POSTGRES_URL?.trim();
  if (!value) {
    throw new Error("POSTGRES_URL is required for database-backed ALIPROMPT routes.");
  }
  return value;
}

export function getDb() {
  client ??= postgres(databaseUrl(), RUNTIME_DATABASE_OPTIONS);
  return drizzle(client, { schema });
}

export async function closeDatabase() {
  const activeClient = client;
  client = undefined;
  if (activeClient) await activeClient.end({ timeout: 5 });
}
