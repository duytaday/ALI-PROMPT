# TASK-PDN-001 — Design Prompt Knowledge Network target model

## Metadata

- Status: Done
- DRI: `product-owner`
- Independent reviewer: `qa-release-reviewer`
- Human approver: ALIPROMPT human owner
- Risk level: Medium — changes approved product direction and target documentation; no application/runtime mutation
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `../product/ACTIVE-PRODUCT-CONTRACT.md`

## Sprint envelope

- `sprintId`: `S0`
- `predecessorSprintId`: `null`
- `predecessorAcceptance`: `START`
- `applicableGates`: `G0`, `G1`
- `exitAcceptance`: `S0_ACCEPTED`
- `evidenceRefs`: PromptVN read-only observation, repository schema/catalog evidence, product artifacts created by this task
- `reviewerAcceptance`: independent `qa-release-reviewer` review required before implementation work treats the design as technically accepted

## Problem and evidence

The current PromptVN reference exposes a one-level prompt gallery with 31 categories, search, prompt-plus-image submission, like/dislike, favorite, report, view shelves and a contributor leaderboard. The owner wants ALIPROMPT to operate like Stack Overflow: user problems receive multiple prompt answers, outputs and independent verification, with voting, accepted answers, tags, reputation and community moderation. Existing ALIPROMPT target artifacts describe moderated prompt contribution but do not define this knowledge-network domain or a reversible mapping from the current catalog schema.

## Target actor and outcome

The immediate actors are the ALIPROMPT owner, Product Owner, Architect, Engineering, Security, Data and QA. They need one approved product model, domain/data target, migration sequence and testable acceptance matrix so later implementation tasks do not confuse prompt popularity with verified usefulness or destroy current catalog data.

## Scope

- Record PromptVN current reference capabilities and gaps without copying code/assets/data.
- Define Question, Prompt Answer, Prompt Version, Output Evidence, Attempt, vote, accepted answer, tag, duplicate, reputation and moderation semantics.
- Define bounded contexts, logical entities, invariants, state machines and a modular-monolith target architecture.
- Map the current ALIPROMPT catalog schema to an additive, reversible migration.
- Define MVP scope, delivery slices, metrics, guardrails and acceptance scenarios.
- Advance the active product contract and product entrypoint to decision `AP-PDN-001` v1.3.0.

## Non-scope

- Application code, database schema, migrations, Blob configuration, deployment, DNS, providers or production data.
- Copying PromptVN source code, visual assets, prompt content, member data or private implementation.
- Final architecture ADR, reputation thresholds, file limits, moderation staffing/SLA or numeric WVSA target.
- Contributor pricing, payout, multi-vendor commerce or live-money changes.
- Claiming the target model is implemented, verified or released.

## Current behavior and constraints

The repository currently has `prompts`, `prompt_media`, `prompt_reactions`, `favorites`, categories, reports and single-seller commerce tables. Guest submission is disabled in the active ALIPROMPT target. Production actions remain approval-gated. Existing uncommitted application changes belong to the user/other work and must not be modified by this documentation task.

## Required behavior

The artifacts must make the problem-centered content graph unambiguous, separate usefulness votes from empirical attempts, preserve prompt-version history, prevent public PII, define safe artifact handling, retain single-seller commerce boundaries and offer a no-destructive-write migration path from each relevant current table.

## Acceptance criteria

1. PRD documents baseline evidence, thesis, actors, journeys, business rules, ranking, scope, outcome, WVSA and guardrails.
2. Domain model includes bounded contexts, ER model, logical tables, state machines, command invariants, public DTO boundaries, security/privacy controls and target architecture.
3. Migration roadmap maps all current community tables, refuses synthetic voters/reputation from aggregate counters, defines canonical URLs, delivery slices, gates and rollback.
4. Acceptance matrix covers success, unauthorized, file safety, concurrency, idempotency, duplicate, version, privacy and migration branches.
5. Active Product Contract version 1.3.0 records `AP-PDN-001` as `APPROVED NEXT` while preserving commerce and production approval boundaries.
6. Product Owner learning checklist includes teach-back for the new model.
7. Repository contract validation passes and no application/runtime file is changed by this task.

## Negative, permission, and edge cases

- Self-vote, non-owner acceptance and evidence-free publish are explicitly rejected.
- Self-attempt does not count as independent WVSA.
- Prompt edits append versions and do not rewrite historical attempts.
- Duplicate chains cannot cycle; old URLs remain signposts/canonical redirects.
- Aggregate legacy likes do not manufacture users, votes or reputation.
- Public leaderboard/profile/search/cache never returns email or private artifact metadata.

## Security, privacy, payment, and protected-content impact

The design requires verified-account writes, quarantine/scan/MIME validation/sanitization for uploads, no raw PII or prompt bodies in analytics, and immutable moderation/audit decisions. Payment and entitlement ownership remain unchanged; community contributors gain no pricing or payout authority.

## Analytics and observability impact

The design introduces a target event vocabulary and WVSA definition only. Numeric targets remain pending S0 owner evidence. Analytics must use versioned schemas and exclude email, raw prompt, input/output files and PII.

## Dependencies

- Active product contract and Product Owner role artifacts.
- Current `db/schema.ts` and `lib/catalog.ts` as baseline evidence.
- Architect ADR before database implementation.
- Security/privacy review before upload or public profile implementation.
- Data audit and rollback rehearsal before production migration.

## Allowed write paths

- `agent-pack/product/**`
- `agent-pack/tasks/TASK-PDN-001-design-prompt-knowledge-network.md`
- `agent-pack/tasks/TASK-TEAM-OS-001-adopt-task-controls.md`
- `docs/product-owner-learning-checklist.md`

## Required approvals

- The owner's explicit request approves the product-direction documentation and active-contract refinement.
- Independent QA/release reviewer evidence is required before `S0_ACCEPTED` or implementation dispatch.
- Architect, Security, Data and human production approvals remain required for their later gates.

## Test evidence required

- `npm run ai:validate` passes.
- `node agent-pack/scripts/validate-task-contract.mjs --all --self-test` passes.
- Contract/version references are consistent and all four product artifacts exist.
- Git path review confirms no application/runtime file was changed by this task.

## Migration, rollout, and rollback

This task changes documentation only. Reverting decision `AP-PDN-001` requires a new owner decision and versioned Product Contract rather than silent deletion. Future data migration must use expand/backfill/verify/cutover/contract with feature flags and preserve legacy source until rollback evidence is accepted.

## Risks, assumptions, and unresolved decisions

- ASSUMPTION: existing catalog rows can be represented as self-answered Questions; incomplete rows require an enrichment queue.
- UNKNOWN: production data volume, legacy identity quality, artifact MIME distribution and moderation staffing.
- UNKNOWN: numeric WVSA target, reputation policy, safe file caps and self-answer acceptance delay.
- RISK: copying Stack Overflow mechanics without sufficient community density may create empty queues or privilege gaming; MVP keeps sensitive privileges manual.

## Definition of Ready result

Ready. The owner explicitly selected a Stack Overflow-like prompt model and asked for documents/system design based on the observed site. Scope is bounded to product/architecture target documentation, evidence sources are available, application writes are excluded and unresolved operational numbers are explicitly deferred to S0 evidence rather than invented.

## Completion evidence

- PromptVN homepage, submit form, leaderboard and prompt detail were observed read-only on 2026-08-17.
- Four versioned target artifacts were created and linked from the product entrypoint.
- Active Product Contract was advanced to v1.3.0 with `AP-PDN-001` and WVSA definition.
- Product Owner learning checklist received a dedicated knowledge-network gate and teach-back.
- Application source, database schema, migration and production state were not changed by this task.
