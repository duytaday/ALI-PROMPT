# TASK-PDN-004 — Pin Vercel + Supabase deployment target

## Metadata

- Status: Done
- DRI: `product-owner`
- Independent reviewer: `qa-release-reviewer`
- Human approver: ALIPROMPT human owner
- Risk level: Medium — provider decision changes deployment preparation; no external action
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `../product/ACTIVE-PRODUCT-CONTRACT.md`

## Sprint envelope

- `sprintId`: `S0`
- `predecessorSprintId`: `null`
- `predecessorAcceptance`: `START`
- `applicableGates`: `G0`, `G1`
- `exitAcceptance`: `S0_ACCEPTED`
- `evidenceRefs`: owner instruction, repository Drizzle/Postgres evidence, official Vercel and Supabase documentation
- `reviewerAcceptance`: independent reviewer required before implementation/deployment treats this provider design as accepted

## Problem and evidence

The target previously specified provider-neutral PostgreSQL through a Vercel integration without pinning a provider. The owner explicitly selected Vercel plus Supabase. Deployment prompts must distinguish Vercel application runtime from Supabase managed PostgreSQL and prevent accidental adoption of additional Supabase products or competing migration authorities.

## Target actor and outcome

Architect, Data, DevOps, QA and developers share one unambiguous target: Next.js on Vercel, PostgreSQL on Supabase, Drizzle-controlled schema migrations, isolated environments and separately gated Production actions.

## Scope

- Record provider decision `AP-PLATFORM-001` in Active Product Contract 1.4.0.
- Update developer, QA and DevOps prompts for Vercel + Supabase.
- Define runtime pooling vs migration/backup connection responsibilities.
- Preserve Vercel Blob and current auth unless a later ADR/owner decision expands Supabase scope.
- Update deployment documentation and learning checklist.

## Non-scope

- Provisioning Supabase/Vercel resources or Marketplace integration.
- Installing CLIs, linking projects, changing env, deploying or migrating remote databases.
- Adopting Supabase Auth, Storage, Realtime, Edge Functions or Data API.
- Selecting paid plans, region, backup/PITR policy, RPO/RTO or billing ownership.

## Current behavior and constraints

The repository uses Drizzle, Postgres.js and typed environment checks. Vercel and Supabase project/resource/secret evidence is not available in this task. Supabase connection modes, Branching, backup and plan capabilities vary and require project-specific verification.

## Required behavior

Application runtime must use a Supabase connection mode suitable for Vercel serverless after verification; migrations/backups must use a suitable direct/session path. Drizzle remains canonical schema history. Preview and Production Supabase resources/credentials must be isolated, and no secret value may enter source, prompts, logs or reports.

## Acceptance criteria

1. Active contract is v1.4.0 and names `AP-PLATFORM-001`.
2. Dev/QA/DevOps prompts reference Vercel + Supabase and retain Production gates.
3. DevOps prompt covers pooling/prepared statements, IPv4/IPv6, plan/region, backup/PITR, branching, RLS exposure and migration-authority conflicts.
4. Supabase Auth/Storage/Realtime/Data API remain out of scope by default.
5. Task and AI contract validation pass with no runtime/external mutation.

## Negative, permission, and edge cases

- Do not use one Production Supabase project for destructive Preview testing.
- Do not put a service-role key or connection string in client bundles/logs/chat.
- Do not run Drizzle and Supabase CLI migrations as independent authorities.
- Do not assume Branching, PITR, downloadable backups, IPv4 or custom environments are available on the selected plan.

## Security, privacy, payment, and protected-content impact

Server-only database credentials remain secrets. If Supabase Data API exposure exists, RLS/publication policy must be audited even when the app intends server-only access. Commerce and Blob boundaries are unchanged.

## Analytics and observability impact

Deployment observability adds Supabase pool/compute/disk/migration/backup health requirements. No runtime telemetry is added by this documentation task.

## Dependencies

- Vercel project/team and Supabase organization/project decisions.
- Architect/Data ADR for connection and migration execution.
- Selected plan/region/network/backup evidence.
- QA and human Production approvals.

## Allowed write paths

- `agent-pack/product/**`
- `agent-pack/PROMPT-*.md`
- `agent-pack/tasks/**`
- `docs/vercel-deployment.md`
- `docs/product-owner-learning-checklist.md`

## Required approvals

- Owner instruction approves Vercel + Supabase as the target.
- Provisioning path, plan/billing, environment resources and every deployment/migration action require separate approval.

## Test evidence required

- Task Contract validator/self-test passes.
- AI contract validation passes.
- Search confirms active v1.4.0 references and Supabase scope/migration-authority guardrails.

## Migration, rollout, and rollback

Documentation only. No resource or data rollout occurred. Reversing the provider target requires a new owner Product Contract decision; implementation rollout must keep legacy data recoverable until rehearsed cutover and rollback pass.

## Risks, assumptions, and unresolved decisions

- ASSUMPTION: Supabase managed Postgres satisfies the provider-neutral SQL/Drizzle contract after S0/S1 verification.
- UNKNOWN: provisioning route, plan, region, pooling mode, backup/PITR, Preview strategy and RPO/RTO.
- RISK: using transaction pooling with unsupported prepared statements or dual migration histories can fail at runtime/cutover.

## Definition of Ready result

Ready for documentation. The owner selected both platforms; scope is limited to pinning target responsibilities and fail-closed preparation rules without provisioning or deployment.

## Completion evidence

- Product Contract advanced to v1.4.0 with AP-PLATFORM-001.
- Dev, QA, DevOps and deployment documentation updated.
- Official Supabase connection, migration, Branching, production and Vercel integration documentation consulted.
- No external resource, secret, deployment or database was changed.
