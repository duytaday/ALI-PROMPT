# TASK-PDN-003 — Author QA and DevOps deployment-preparation prompts

## Metadata

- Status: Done
- DRI: `product-owner`
- Independent reviewer: `qa-release-reviewer`
- Human approver: ALIPROMPT human owner
- Risk level: Low — documentation/instruction only; no deployment action
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `../product/ACTIVE-PRODUCT-CONTRACT.md`

## Sprint envelope

- `sprintId`: `S0`
- `predecessorSprintId`: `null`
- `predecessorAcceptance`: `START`
- `applicableGates`: `G0`, `G1`
- `exitAcceptance`: `S0_ACCEPTED`
- `evidenceRefs`: AP-PDN-001 product artifacts, QA role contract, S7 prompt, Vercel deployment contract and current official Vercel documentation
- `reviewerAcceptance`: independent reviewer required before this work is treated as S0 accepted

## Problem and evidence

The developer prompt exists, but the knowledge-network target lacks candidate-specific independent QA instructions and a separate DevOps preparation prompt that cannot be mistaken for Production authority. Existing generic QA/S7 material predates AP-PDN-001 semantics and current deployment documentation must be re-verified before action.

## Target actor and outcome

QA receives an evidence-first traceability/release prompt for PK-01–PK-24. DevOps receives a prepare-only prompt for environment isolation, migration rehearsal, Preview, observability and rollback, with explicit external-action gates.

## Scope

- Create a specialized QA prompt for the Prompt Knowledge Network.
- Create a specialized Vercel DevOps preparation prompt.
- Preserve QA independence and human Production authority.
- Link the prompts from product documentation and the learning checklist.

## Non-scope

- Running tests on a feature candidate.
- Installing CLI/provider/integration, linking Vercel, changing env, deploying, migrating, promoting or changing DNS.
- Editing application/database/runtime source.
- Accepting S0/S7 or Production risk.

## Current behavior and constraints

Repository state is dirty and must be preserved. Vercel project linkage, credentials and Preview/Production resources are not assumed. K0–K6 remain product slices that must map to canonical S0–S7 envelopes.

## Required behavior

QA must require exact candidate/revision/environment evidence, independently run relevant gates, cover domain/security/data/a11y/SEO/commerce regressions and return an honest verdict. DevOps must default to PREPARE_ONLY and require exact action-specific approval for every external or Production mutation.

## Acceptance criteria

1. QA prompt covers PK traceability, core multi-user journey, invariants, uploads, migration, security/privacy, ranking, accessibility, SEO, commerce regression, severity and verdict.
2. DevOps prompt covers current-doc verification, environment/resource isolation, env inventory, Postgres/Blob preparation, deterministic build, Preview, Production packet, observability and rollback.
3. DevOps prompt explicitly blocks project linking, provider/resource creation, env mutation, deployment, migration, promotion and DNS without approval.
4. Both prompts reference the current Product Contract/AP-PDN-001 and preserve canonical sprint/gate authority.
5. Task/AI validation passes and no application/runtime file changes.

## Negative, permission, and edge cases

- Missing candidate SHA/QA handoff/environment returns blocked/prep-not-ready.
- Build pass cannot become Production readiness.
- QA cannot fix app source or accept its own risk.
- DevOps cannot expose secrets or reuse Production resources in Preview.
- Env changes require a new deployment and are not assumed retroactive.

## Security, privacy, payment, and protected-content impact

Prompts require PII/secret redaction, private raw Blob quarantine, public sanitized artifacts, server authorization, single-seller commerce and separate approval for live money. No data is processed by this task.

## Analytics and observability impact

Documentation defines required evidence and target telemetry only. It prohibits raw prompt/email/output/secret logging and requires environment-scoped dashboards/cost guardrails.

## Dependencies

- AP-PDN-001 product artifacts and implementation prompt.
- QA role, quality gates, handoff schema and S7 prompt.
- Vercel deployment contract and current official provider documentation.

## Allowed write paths

- `agent-pack/PROMPT-QA-PROMPT-KNOWLEDGE-NETWORK.md`
- `agent-pack/PROMPT-DEVOPS-PREPARE-VERCEL-DEPLOY.md`
- `agent-pack/product/README.md`
- `agent-pack/tasks/TASK-PDN-003-author-qa-devops-prompts.md`
- `docs/product-owner-learning-checklist.md`

## Required approvals

- Owner request authorizes prompt documentation.
- QA/release acceptance and every external/Production action remain separately gated.

## Test evidence required

- Task Contract validator/self-test passes.
- AI contract validation passes.
- Search confirms required contract/AP-PDN-001/PK/prepare-only/production-blocker semantics.

## Migration, rollout, and rollback

Documentation-only. Rollback removes these prompts/links; no project, data or deployment state changes.

## Risks, assumptions, and unresolved decisions

- ASSUMPTION: QA and DevOps agents can access repository-local artifacts.
- UNKNOWN: exact deployment project, provider, plan, region, resource IDs, secret path and candidate SHA.
- RISK: operator may interpret a prompt as approval; prepare-only default and exact-action gates fail closed.

## Definition of Ready result

Ready. Owner explicitly requested QA and DevOps preparation prompts; authoritative requirements exist and no external action is needed to author them.

## Completion evidence

- Specialized QA and DevOps prompts created.
- Current official Vercel environment, env-var, Marketplace Postgres, Blob and promotion documentation consulted.
- No tests/deployments/providers/env/migrations or runtime files changed.
