import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let leadStorageReady: Promise<void> | undefined;

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
          CONSTRAINT leads_stage_allowed CHECK(stage_or_intent IN ('workshop', 'agent_waitlist', 'prompt_pack')),
          CONSTRAINT leads_consent_required CHECK(consent = 1)
        )`),
        d1.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_contact_stage
          ON leads(contact, stage_or_intent)`),
        d1.prepare("PRAGMA optimize"),
      ])
      .then(() => undefined)
      .catch((error) => {
        leadStorageReady = undefined;
        throw error;
      });
  }

  await leadStorageReady;
}
