# TASK-S0-K0 — Audit and K0 contract for Prompt Knowledge Network

> This scoped work order follows `agent-pack/templates/task-contract.md`. It references `agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md`; it does not replace that product record, authorize a later sprint, waive a gate, or authorize application changes.

## Metadata

- Status: In review
- DRI: orchestrator
- Independent reviewer: qa-release-reviewer
- Human approver: ALIPROMPT human owner
- Risk level: Medium
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md`

## Sprint envelope

- `sprintId`: S0
- `predecessorSprintId`: null
- `predecessorAcceptance`: START
- `applicableGates`: G0, G1
- `exitAcceptance`: S0_ACCEPTED
- `evidenceRefs`: E-REPO-STATUS-20260818, E-NO-PREDECESSOR-20260818, E-CONTRACT-1.4.0, E-KN-PRD-AP-PDN-001, E-LOCAL-BASELINE-20260818
- `reviewerAcceptance`: independent `qa-release-reviewer` review is required; the DRI cannot self-accept.

## Problem and evidence

The repository contains a large dirty, uncommitted migration from an earlier baseline and product-target documents marked `approved_next`. There is no schema-valid, independently accepted S0 handoff or any exact predecessor acceptance artifact that binds revision, environment, applicable gates, evidence, reviewer identity, decision, and timestamp. `Sx_ACCEPTED` strings found in the agent pack are workflow templates, not acceptance evidence.

## Target actor and outcome

The technical orchestrator and independent QA reviewer need a truthful, reproducible S0/K0 audit before any Prompt Knowledge Network application work. The outcome is a bounded K0 audit/ADR/data-inventory plan and a schema-valid handoff that either supports independent S0 acceptance or accurately records its blockers.

## Scope

- Audit the repository, active contract, K0 target, exact sprint sequence, dirty-tree ownership risk, runtime, schema, migrations, routes, tests, and existing evidence artifacts.
- Create a current-versus-approved-target/gap record, K0 data-inventory plan, decision ledger, trust-boundary and test-plan evidence in the S0 handoff.
- Validate this Task Contract and the handoff schema with repository-provided tooling.

## Non-scope

- No application, schema, migration, dependency, environment, infrastructure, provider, deployment, DNS, payment, production, or runtime change.
- No assertion that S0, K0, any PK-* item, or a later sprint is accepted, implemented, verified, or released.
- No copy of reference source, assets, copy, data, prompts, or private APIs.

## Current behavior and constraints

- Git branch is `main` at `944121f3fc8313cf52eaf7f8f9068c5f2591b26a`; the working tree is dirty with broad modified, deleted, and untracked paths.
- `agent-pack/` and multiple implementation paths are untracked. They are preserved as pre-existing/concurrent work and are read-only for this task except the explicitly allowed S0 documentation files.
- `.ai/project.json`, `.ai/active-task.json`, `.ai/context/CURRENT_STATE.md`, `.ai/ownership.json`, and `docs/OWNERSHIP.md` are absent.
- Current package/runtime/schema/test facts must be gathered from the working tree and not inferred from plans or target documents.

## Required behavior

- Treat `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 and `AP-PDN-001` as approved target intent, not proof of current implementation.
- Keep S0/K0 documentation separate from application code and preserve every existing dirty path.
- Mark G0/G1 and S0 status truthfully as passed, blocked, partial, or not-run only with evidence.
- Stop after the S0/K0 handoff. A later sprint requires a new invocation and an exact independent predecessor acceptance.

## Acceptance criteria

1. The Task Contract validates with `node agent-pack/scripts/validate-task-contract.mjs --all --self-test` and contains the canonical S0 envelope.
2. The audit captures repository revision, dirty-tree status, absence/presence of exact predecessor evidence, and missing task-control manifests.
3. The handoff maps current implementation, approved target, K0 data/ADR requirements, applicable PK IDs, risks, trust boundaries, test plan, migration prohibition, and rollback.
4. The S0 handoff validates against `agent-pack/schemas/handoff.schema.json` and does not self-issue `S0_ACCEPTED`.
5. The task changes no path outside this contract and the S0 handoff.

## Negative, permission, and edge cases

- A later-sprint implementation claim without an exact accepted predecessor is blocked.
- A roadmap, task prompt, code presence, or a generic `Sx_ACCEPTED` string is not acceptance evidence.
- Untracked or dirty application files are user/concurrent work unless an explicit ownership handoff says otherwise.
- No production credential, deployment, data mutation, provider activation, or DNS action is permitted.

## Allowed write paths

- `docs/TASK-S0-K0-PROMPT-KNOWLEDGE-NETWORK.md`
- `docs/S0-PROMPT-KNOWLEDGE-NETWORK-ADR-EVIDENCE.md`
- `docs/HO-S0-K0-PROMPT-KNOWLEDGE-NETWORK.json`
- `docs/HO-S0-ADR-EVIDENCE-20260818.json`

## Required approvals

- Independent `qa-release-reviewer` acceptance for any `S0_ACCEPTED` decision.
- ALIPROMPT human owner for the S0 decisions still explicitly reserved to the owner (WVSA target/window, upload numeric limits, self-accept wait, reputation policy, moderation SLA, initial non-vertical tags, retention/appeal).

## Security, privacy, payment, and protected-content impact

This task creates only redacted documentation. It must not place secrets, raw PII, protected prompt bodies, payment data, signed URLs, or reference-site data in the contract or handoff. It records current security gaps without changing enforcement.

## Analytics and observability impact

No telemetry or runtime instrumentation changes. The K0 plan specifies that future WVSA and discovery events must exclude raw prompt, email, inputs/outputs, and PII.

## Dependencies

- `agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md` v1.4.0
- `agent-pack/product/PROMPT-KNOWLEDGE-*.md`
- `agent-pack/skills/catalog.yaml`, `agent-pack/hooks/policy-pipeline.yaml`, `agent-pack/evals/quality-gates.md`
- `agent-pack/sprints/vi/S0-audit-contracts-adrs.prompt.md`
- Independent QA review and owner decisions listed above.

## Test evidence required

- Read-only repository discovery commands with command output and exit status.
- Task-contract validator self-test and all-contract validation.
- JSON Schema validation of the final 19-key handoff.
- A final scoped diff check proving no application code/configuration was changed by this task.

## Migration, rollout, and rollback

No migration, rollout, or deployment is permitted. K0 records the future additive `legacy_entity_map`/reconciliation/feature-flag/rollback requirements only. Documentation rollback is removal of these two task-owned files after owner direction; existing repository work remains untouched.

## Risks, assumptions, and unresolved decisions

- Exact predecessor acceptance is absent; all K1–K6 execution is blocked.
- Dirty/untracked paths make provenance and ownership ambiguous until an independent reviewer establishes a baseline/lease.
- No runtime database/provider/Preview evidence has been established by this task.
- S0 owner decisions listed in the PRD remain unresolved and must not be invented.

## Owner decision packet required before S0 acceptance

The owner must resolve each row explicitly. An unanswered row remains fail-closed and must not be converted into a coded default by an implementation agent.

| Decision ID | Owner must provide | Safe behavior while pending | Evidence required for closure |
|---|---|---|---|
| OD-S0-01 WVSA | Absolute target, first measurement window, cohort start, and minimum eligible sample | Instrument the metric contract only; do not claim product success from prompt, view, copy, or like counts | Dated owner decision plus a privacy-safe query/test fixture matching the accepted WVSA definition |
| OD-S0-02 Upload caps | Per-type byte, image pixel, and PDF page limits, supported formats, and cost/security rationale | Retain the stricter existing limit; never broaden file types or public exposure | Dated limits, threat/cost rationale, boundary tests, and rollback configuration |
| OD-S0-03 Self-answer acceptance | Waiting period and whether an override role exists | Self-answer may be authored but cannot be accepted or generate reputation | Dated policy, authorization/time-boundary tests, and audit-event requirement |
| OD-S0-04 Reputation | Versioned points per event, reversal policy, abuse caps, and privilege thresholds | Ledger remains signal-only; no automatic sensitive privilege | Dated policy version, double-entry/idempotency tests, reversal tests, and abuse review |
| OD-S0-05 Moderation SLA | Priority classes, response targets, staffing coverage, escalation, and backlog stop threshold | Content remains pending/quarantined; no automatic publication on timeout | Dated operating policy, queue observability, escalation owner, and breach alert test |
| OD-S0-06 Initial tags | Canonical non-vertical tags, synonym owner, naming rule, and merge/deprecation policy | Seed only the approved 31 vertical mappings; user-created tags stay unavailable | Dated taxonomy manifest, uniqueness/synonym tests, and reversible seed migration |
| OD-S0-07 Retention and appeal | Retention periods by data class, deletion/anonymization behavior, appeal window, and legal/ops owner | Minimize public data, retain no new optional sensitive field, and avoid irreversible purge automation | Dated legal/ops approval, lifecycle matrix, access/deletion tests, and rollback/export procedure |

For every row, the decision record must identify the decision maker, timestamp, environments, rationale, guardrail, change owner, and rollback trigger. Provider activation, Production migration/deployment, DNS, and real-money actions remain separate action-specific approvals and are not granted by these product decisions.

## Independent reviewer verdict contract

The `qa-release-reviewer` must bind its verdict to this exact handoff version, Git revision, documented dirty-tree baseline, environment scope, G0/G1 evidence references, reviewer identity, decision, and timestamp. Only `passed` plus an explicit `S0_ACCEPTED` decision can unlock the next Task Contract; `partial`, `blocked`, `changes-requested`, missing fields, or a prose approval cannot.

## Completion evidence for independent review

- `npm test` passed on the current dirty worktree: AI contract validation, Drizzle schema consistency, the Next.js 16.2.6 production build, 29 Node tests, and 1 TypeScript payment test all completed successfully.
- `npm run lint` passed.
- `node agent-pack/scripts/validate-task-contract.mjs --all --self-test` passed for the Team OS and PDN task contracts.
- `git diff --check` reported no whitespace error; existing CRLF conversion warnings are not treated as application changes or acceptance evidence.
- The route and schema inventory still shows a legacy one-level prompt catalog. No Question, Prompt Answer, Prompt Version, Attempt, knowledge-tag graph, duplicate-link, reputation-ledger, or transactional-outbox implementation is evidenced.
- The SQL migration inventory contains the current catalog/community/auth/commerce migrations only; the future knowledge-network migration remains prohibited until a later accepted slice.
- No Preview environment, Supabase data inventory, browser E2E, media-sanitization integration, production action, or independent QA verdict was produced by this task.
- Review state is therefore **partial / in review**, not `S0_ACCEPTED`. The next actor is the independent `qa-release-reviewer`.

## Definition of Ready result

Ready for S0/K0 documentation-only audit: the active product contract, canonical S0 envelope, source-of-truth artifacts, scope, non-scope, allowed documentation paths, required independent reviewer, test procedure, rollback boundary, and unresolved owner decisions are explicit. Not ready for S1 or any K1–K6 application work because no independently accepted `S0_ACCEPTED` artifact binds the required evidence.
