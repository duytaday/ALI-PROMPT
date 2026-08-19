import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", {
  withTimezone: true,
  mode: "string",
}).notNull().defaultNow();

const updatedAt = timestamp("updated_at", {
  withTimezone: true,
  mode: "string",
}).notNull().defaultNow();

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 254 }).notNull(),
    passwordHash: text("password_hash"),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    role: varchar("role", { length: 24 }).notNull().default("member"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: "string" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    check("users_role_allowed", sql`${table.role} IN ('member', 'contributor', 'editor', 'admin')`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
    createdAt,
  },
  (table) => [uniqueIndex("sessions_token_hash_unique").on(table.tokenHash)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true, mode: "string" }),
    createdAt,
  },
  (table) => [uniqueIndex("password_reset_tokens_hash_unique").on(table.tokenHash)],
);

export const authRateLimits = pgTable(
  "auth_rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: varchar("action", { length: 32 }).notNull(),
    keyHash: varchar("key_hash", { length: 128 }).notNull(),
    windowStart: timestamp("window_start", { withTimezone: true, mode: "string" }).notNull(),
    count: integer("count").notNull().default(1),
    createdAt,
  },
  (table) => [
    uniqueIndex("auth_rate_limits_action_key_window_unique").on(table.action, table.keyHash, table.windowStart),
    check("auth_rate_limits_action_allowed", sql`${table.action} IN ('login', 'register', 'password_reset', 'submission', 'report', 'checkout', 'workspace')`),
    check("auth_rate_limits_count_positive", sql`${table.count} > 0`),
  ],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    contact: varchar("contact", { length: 254 }).notNull(),
    role: varchar("role_or_industry", { length: 120 }).notNull(),
    stage: varchar("stage_or_intent", { length: 32 }).notNull(),
    source: varchar("source", { length: 80 }).notNull(),
    consent: boolean("consent").notNull(),
    createdAt,
    submissionCount: integer("submission_count").notNull().default(1),
    lastSubmittedAt: timestamp("last_submitted_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("leads_contact_stage_unique").on(table.contact, table.stage),
    check("leads_stage_allowed", sql`${table.stage} IN ('workshop', 'agent_waitlist', 'prompt_pack')`),
    check("leads_consent_required", sql`${table.consent} = true`),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 96 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    description: varchar("description", { length: 280 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("categories_slug_unique").on(table.slug)],
);

export const prompts = pgTable(
  "prompts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: varchar("summary", { length: 500 }).notNull(),
    body: text("body").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    contributorId: uuid("contributor_id").references(() => users.id, { onDelete: "set null" }),
    guestAuthorName: varchar("guest_author_name", { length: 120 }),
    sourceKind: varchar("source_kind", { length: 24 }).notNull().default("aliprompt"),
    moderationStatus: varchar("moderation_status", { length: 24 }).notNull().default("draft"),
    accessKind: varchar("access_kind", { length: 16 }).notNull().default("free"),
    modelCompatibility: varchar("model_compatibility", { length: 120 }).notNull().default("General AI chat"),
    contentLanguage: varchar("content_language", { length: 12 }).notNull().default("vi"),
    viewCount: integer("view_count").notNull().default(0),
    likeCount: integer("like_count").notNull().default(0),
    dislikeCount: integer("dislike_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("prompts_slug_unique").on(table.slug),
    check("prompts_source_allowed", sql`${table.sourceKind} IN ('aliprompt', 'community')`),
    check("prompts_status_allowed", sql`${table.moderationStatus} IN ('draft', 'pending', 'approved', 'rejected', 'archived')`),
    check("prompts_access_allowed", sql`${table.accessKind} IN ('free', 'paid')`),
    check("prompts_content_language_allowed", sql`${table.contentLanguage} IN ('vi', 'en', 'multilingual')`),
  ],
);

export const promptMedia = pgTable(
  "prompt_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    blobKey: varchar("blob_key", { length: 512 }).notNull(),
    altText: varchar("alt_text", { length: 240 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("staged"),
    bytes: integer("bytes").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("prompt_media_blob_key_unique").on(table.blobKey),
    check("prompt_media_status_allowed", sql`${table.status} IN ('staged', 'validated', 'public', 'rejected', 'deleted')`),
  ],
);

export const promptVersions = pgTable(
  "prompt_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 32 }).notNull(),
    body: text("body").notNull(),
    variableDefinitions: jsonb("variable_definitions").notNull().default(sql`'[]'::jsonb`),
    usageMetadata: jsonb("usage_metadata").notNull().default(sql`'{}'::jsonb`),
    outputSchema: jsonb("output_schema"),
    isActive: boolean("is_active").notNull().default(true),
    lastTestedAt: timestamp("last_tested_at", { withTimezone: true, mode: "string" }),
    createdAt,
  },
  (table) => [
    uniqueIndex("prompt_versions_prompt_version_unique").on(table.promptId, table.version),
    uniqueIndex("prompt_versions_active_lookup_index").on(table.promptId, table.isActive, table.createdAt),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    uniqueIndex("favorites_user_prompt_unique").on(table.userId, table.promptId),
    uniqueIndex("favorites_user_created_at_index").on(table.userId, table.createdAt),
  ],
);

export const promptCollections = pgTable(
  "prompt_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    description: varchar("description", { length: 280 }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("prompt_collections_owner_updated_index").on(table.userId, table.updatedAt, table.id),
  ],
);

export const promptCollectionItems = pgTable(
  "prompt_collection_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id").notNull().references(() => promptCollections.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    uniqueIndex("prompt_collection_items_collection_prompt_unique").on(table.collectionId, table.promptId),
    uniqueIndex("prompt_collection_items_prompt_collection_index").on(table.promptId, table.collectionId),
  ],
);

export const promptUsageEvents = pgTable(
  "prompt_usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    promptVersion: varchar("prompt_version", { length: 32 }).notNull(),
    copyFormat: varchar("copy_format", { length: 16 }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 80 }).notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("prompt_usage_events_owner_idempotency_unique").on(table.userId, table.idempotencyKey),
    uniqueIndex("prompt_usage_events_owner_recent_index").on(table.userId, table.createdAt, table.id),
  ],
);

export const promptNotes = pgTable(
  "prompt_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("prompt_notes_owner_prompt_unique").on(table.userId, table.promptId),
  ],
);

export const promptReactions = pgTable(
  "prompt_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    value: integer("value").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("prompt_reactions_user_prompt_unique").on(table.userId, table.promptId),
    check("prompt_reactions_value_allowed", sql`${table.value} IN (-1, 1)`),
  ],
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "set null" }),
    reason: varchar("reason", { length: 64 }).notNull(),
    details: varchar("details", { length: 1000 }),
    status: varchar("status", { length: 24 }).notNull().default("open"),
    createdAt,
    resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [check("reports_status_allowed", sql`${table.status} IN ('open', 'resolved', 'dismissed')`)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
    contentPromptId: uuid("content_prompt_id").references(() => prompts.id, { onDelete: "restrict" }),
    sellerKind: varchar("seller_kind", { length: 24 }).notNull().default("aliprompt"),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    priceAmount: integer("price_amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("VND"),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    uniqueIndex("products_content_prompt_unique").on(table.contentPromptId),
    check("products_only_aliprompt_seller", sql`${table.sellerKind} = 'aliprompt'`),
    check("products_status_allowed", sql`${table.status} IN ('draft', 'active', 'archived')`),
    check("products_price_nonnegative", sql`${table.priceAmount} >= 0`),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("pending"),
    providerReference: varchar("provider_reference", { length: 255 }),
    createdAt,
    updatedAt,
  },
  (table) => [check("orders_status_allowed", sql`${table.status} IN ('pending', 'paid', 'cancelled', 'failed', 'refunded')`)],
);

export const paymentEvents = pgTable(
  "payment_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: varchar("provider", { length: 48 }).notNull(),
    providerEventId: varchar("provider_event_id", { length: 255 }).notNull(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    verifiedAt: timestamp("verified_at", { withTimezone: true, mode: "string" }),
    payload: jsonb("payload").notNull(),
    createdAt,
  },
  (table) => [uniqueIndex("payment_events_provider_event_unique").on(table.provider, table.providerEventId)],
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    grantSource: varchar("grant_source", { length: 24 }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "string" }),
    createdAt,
  },
  (table) => [
    uniqueIndex("entitlements_user_product_unique").on(table.userId, table.productId),
    check("entitlements_source_allowed", sql`${table.grantSource} IN ('payment', 'admin')`),
  ],
);

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }).notNull(),
    body: text("body").notNull(),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("articles_slug_unique").on(table.slug),
    check("articles_status_allowed", sql`${table.status} IN ('draft', 'scheduled', 'published', 'archived')`),
  ],
);

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: uuid("entity_id"),
  action: varchar("action", { length: 120 }).notNull(),
  reason: varchar("reason", { length: 1000 }),
  before: jsonb("before"),
  after: jsonb("after"),
  createdAt,
});
