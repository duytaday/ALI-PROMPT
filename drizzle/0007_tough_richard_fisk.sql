ALTER TABLE "prompts" ADD COLUMN "model_compatibility" varchar(120) DEFAULT 'General AI chat' NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "content_language" varchar(12) DEFAULT 'vi' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_created_at_index" ON "favorites" USING btree ("user_id","created_at");--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_content_language_allowed" CHECK ("prompts"."content_language" IN ('vi', 'en', 'multilingual'));