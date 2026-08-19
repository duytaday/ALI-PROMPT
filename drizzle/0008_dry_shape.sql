CREATE TABLE "prompt_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_id" uuid NOT NULL,
	"version" varchar(32) NOT NULL,
	"body" text NOT NULL,
	"variable_definitions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"usage_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_schema" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_tested_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_versions_prompt_version_unique" ON "prompt_versions" USING btree ("prompt_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_versions_active_lookup_index" ON "prompt_versions" USING btree ("prompt_id","is_active","created_at");