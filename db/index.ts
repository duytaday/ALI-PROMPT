import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let leadStorageReady: Promise<void> | undefined;

const LEGACY_LAST_SUBMITTED_AT = "1970-01-01 00:00:00";

function getD1() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}

export async function ensureLeadStorage() {
  if (!leadStorageReady) {
    const d1 = getD1();
    leadStorageReady = d1
      .batch([
        d1.prepare(`CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          contact TEXT NOT NULL,
          role_or_industry TEXT NOT NULL,
          stage_or_intent TEXT NOT NULL,
          source TEXT NOT NULL,
          consent INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
          submission_count INTEGER DEFAULT 1 NOT NULL,
          last_submitted_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
          CONSTRAINT leads_stage_allowed CHECK(stage_or_intent IN ('workshop', 'agent_waitlist', 'prompt_pack')),
          CONSTRAINT leads_consent_required CHECK(consent = 1)
        )`),
        d1.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_contact_stage
          ON leads(contact, stage_or_intent)`),
        d1.prepare("PRAGMA optimize"),
      ])
      .then(async () => {
        const columnInfo = await d1
          .prepare("PRAGMA table_info(leads)")
          .all<{ name: string }>();
        const columnNames = new Set(
          columnInfo.results.map((column) => column.name),
        );
        const upgrades = [];
        const requiredColumns: string[] = [];

        if (!columnNames.has("submission_count")) {
          requiredColumns.push("submission_count");
          upgrades.push(
            d1.prepare(
              "ALTER TABLE leads ADD COLUMN submission_count INTEGER DEFAULT 1 NOT NULL",
            ),
          );
        }

        if (!columnNames.has("last_submitted_at")) {
          requiredColumns.push("last_submitted_at");
          upgrades.push(
            d1.prepare(
              `ALTER TABLE leads ADD COLUMN last_submitted_at TEXT DEFAULT '${LEGACY_LAST_SUBMITTED_AT}' NOT NULL`,
            ),
          );
        }

        if (upgrades.length > 0) {
          try {
            await d1.batch(upgrades);
          } catch (error) {
            const refreshedInfo = await d1
              .prepare("PRAGMA table_info(leads)")
              .all<{ name: string }>();
            const refreshedNames = new Set(
              refreshedInfo.results.map((column) => column.name),
            );

            if (requiredColumns.some((column) => !refreshedNames.has(column))) {
              throw error;
            }
          }
        }

        if (!columnNames.has("last_submitted_at")) {
          await d1
            .prepare(
              "UPDATE leads SET last_submitted_at = created_at WHERE last_submitted_at = ?",
            )
            .bind(LEGACY_LAST_SUBMITTED_AT)
            .run();
        }
      })
      .catch((error) => {
        leadStorageReady = undefined;
        throw error;
      });
  }

  await leadStorageReady;
}
