CREATE TABLE "prompt_collection_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_id" uuid NOT NULL,
	"prompt_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(280),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt_id" uuid NOT NULL,
	"prompt_version" varchar(32) NOT NULL,
	"copy_format" varchar(16) NOT NULL,
	"idempotency_key" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_rate_limits" DROP CONSTRAINT "auth_rate_limits_action_allowed";--> statement-breakpoint
ALTER TABLE "prompt_collection_items" ADD CONSTRAINT "prompt_collection_items_collection_id_prompt_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."prompt_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_collection_items" ADD CONSTRAINT "prompt_collection_items_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_collections" ADD CONSTRAINT "prompt_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_notes" ADD CONSTRAINT "prompt_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_notes" ADD CONSTRAINT "prompt_notes_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_usage_events" ADD CONSTRAINT "prompt_usage_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_usage_events" ADD CONSTRAINT "prompt_usage_events_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_collection_items_collection_prompt_unique" ON "prompt_collection_items" USING btree ("collection_id","prompt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_collection_items_prompt_collection_index" ON "prompt_collection_items" USING btree ("prompt_id","collection_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_collections_owner_updated_index" ON "prompt_collections" USING btree ("user_id","updated_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_notes_owner_prompt_unique" ON "prompt_notes" USING btree ("user_id","prompt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_usage_events_owner_idempotency_unique" ON "prompt_usage_events" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_usage_events_owner_recent_index" ON "prompt_usage_events" USING btree ("user_id","created_at","id");--> statement-breakpoint
ALTER TABLE "auth_rate_limits" ADD CONSTRAINT "auth_rate_limits_action_allowed" CHECK ("auth_rate_limits"."action" IN ('login', 'register', 'password_reset', 'submission', 'report', 'checkout', 'workspace'));