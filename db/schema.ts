import { sql } from "drizzle-orm";
import {
  check,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    contact: text("contact").notNull(),
    role: text("role_or_industry").notNull(),
    stage: text("stage_or_intent", {
      enum: ["workshop", "agent_waitlist", "prompt_pack"],
    }).notNull(),
    source: text("source").notNull(),
    consent: integer("consent", { mode: "boolean" }).notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    submissionCount: integer("submission_count").notNull().default(1),
    lastSubmittedAt: text("last_submitted_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_leads_contact_stage").on(table.contact, table.stage),
    check(
      "leads_stage_allowed",
      sql`${table.stage} IN ('workshop', 'agent_waitlist', 'prompt_pack')`
    ),
    check("leads_consent_required", sql`${table.consent} = 1`),
  ]
);
