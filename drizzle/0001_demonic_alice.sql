CREATE TABLE `__new_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`role_or_industry` text NOT NULL,
	`stage_or_intent` text NOT NULL,
	`source` text NOT NULL,
	`consent` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`submission_count` integer DEFAULT 1 NOT NULL,
	`last_submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "leads_stage_allowed" CHECK("__new_leads"."stage_or_intent" IN ('workshop', 'agent_waitlist', 'prompt_pack')),
	CONSTRAINT "leads_consent_required" CHECK("__new_leads"."consent" = 1)
);
--> statement-breakpoint
INSERT INTO `__new_leads` (
	`id`,
	`name`,
	`contact`,
	`role_or_industry`,
	`stage_or_intent`,
	`source`,
	`consent`,
	`created_at`,
	`submission_count`,
	`last_submitted_at`
)
SELECT
	`id`,
	`name`,
	`contact`,
	`role_or_industry`,
	`stage_or_intent`,
	`source`,
	`consent`,
	`created_at`,
	1,
	`created_at`
FROM `leads`;
--> statement-breakpoint
DROP TABLE `leads`;
--> statement-breakpoint
ALTER TABLE `__new_leads` RENAME TO `leads`;
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_leads_contact_stage` ON `leads` (`contact`, `stage_or_intent`);
--> statement-breakpoint
PRAGMA optimize;
