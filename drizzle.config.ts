import { defineConfig } from "drizzle-kit";

const localFallbackUrl = "postgres://postgres:postgres@localhost:5432/aliprompt";
const runningLocally =
  process.env.VERCEL !== "1" &&
  (!process.env.ALIPROMPT_ENVIRONMENT || process.env.ALIPROMPT_ENVIRONMENT === "development");
const migrationUrl =
  process.env.POSTGRES_MIGRATION_URL?.trim() ||
  (runningLocally ? process.env.POSTGRES_URL?.trim() || localFallbackUrl : undefined);

if (!migrationUrl) {
  throw new Error(
    "POSTGRES_MIGRATION_URL is required for Preview and Production migration commands. Runtime POSTGRES_URL is intentionally not used.",
  );
}

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
});
