ALTER TABLE "auth_rate_limits" DROP CONSTRAINT "auth_rate_limits_action_allowed";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "content_prompt_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_content_prompt_id_prompts_id_fk" FOREIGN KEY ("content_prompt_id") REFERENCES "public"."prompts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "products_content_prompt_unique" ON "products" USING btree ("content_prompt_id");--> statement-breakpoint
ALTER TABLE "auth_rate_limits" ADD CONSTRAINT "auth_rate_limits_action_allowed" CHECK ("auth_rate_limits"."action" IN ('login', 'register', 'password_reset', 'submission', 'report', 'checkout'));