CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`role_or_industry` text NOT NULL,
	`stage_or_intent` text NOT NULL,
	`source` text NOT NULL,
	`consent` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "leads_stage_allowed" CHECK("leads"."stage_or_intent" IN ('workshop', 'agent_waitlist', 'prompt_pack')),
	CONSTRAINT "leads_consent_required" CHECK("leads"."consent" = 1)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_leads_contact_stage` ON `leads` (`contact`,`stage_or_intent`);