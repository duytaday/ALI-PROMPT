CREATE TABLE "auth_rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(32) NOT NULL,
	"key_hash" varchar(128) NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_rate_limits_action_allowed" CHECK ("auth_rate_limits"."action" IN ('login', 'register', 'password_reset')),
	CONSTRAINT "auth_rate_limits_count_positive" CHECK ("auth_rate_limits"."count" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "auth_rate_limits_action_key_window_unique" ON "auth_rate_limits" USING btree ("action","key_hash","window_start");