# TASK-PDN-002 — Author developer implementation prompt for AP-PDN-001

## Metadata

- Status: Done
- DRI: `product-owner`
- Independent reviewer: `qa-release-reviewer`
- Human approver: ALIPROMPT human owner
- Risk level: Low — instruction/documentation only
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `../product/ACTIVE-PRODUCT-CONTRACT.md`

## Sprint envelope

- `sprintId`: `S0`
- `predecessorSprintId`: `null`
- `predecessorAcceptance`: `START`
- `applicableGates`: `G0`, `G1`
- `exitAcceptance`: `S0_ACCEPTED`
- `evidenceRefs`: AP-PDN-001 PRD, domain model, migration roadmap and acceptance matrix
- `reviewerAcceptance`: independent reviewer required before the prompt or resulting work is treated as S0 accepted

## Problem and evidence

AP-PDN-001 defines the approved-next product and system target, but the existing general developer prompt still emphasizes a one-level catalog and does not encode Question, Answer, Version, Attempt, duplicate, reputation-ledger or reversible legacy mapping semantics. A bounded developer prompt is required to prevent implementation drift.

## Target actor and outcome

The actor is a Lead Dev/AI coding agent. The desired outcome is an executable instruction set that begins with repository evidence and exact sprint authorization, then implements one reversible knowledge-network slice with testable business invariants.

## Scope

- Create a Vietnamese developer prompt for AP-PDN-001.
- Reference all authoritative product artifacts and current delivery controls.
- Encode domain model, routes, invariants, migration mapping, security, tests, stop conditions and handoff.
- Link it from the existing developer/product entrypoints and learning checklist.

## Non-scope

- Application, database, migration, deployment or production changes.
- Granting S0 acceptance, dispatching S1 or waiving any reviewer/gate.
- Choosing unresolved numeric metrics, limits, policy thresholds or production providers.

## Current behavior and constraints

The repository is dirty with user/concurrent application changes. Documentation edits must preserve them. The canonical sprint registry remains S0–S7, while K0–K6 are product-delivery slices that must be mapped inside a valid sprint Task Contract rather than replacing sprint authority.

## Required behavior

The prompt must tell the dev to audit first, preserve dirty work, create and validate a Task Contract, prove predecessor acceptance, implement only one authorized slice, keep vote/accept/attempt separate, preserve prompt versions, protect uploads/PII and stop at production/destructive/authority boundaries.

## Acceptance criteria

1. The new prompt is self-contained and references Active Product Contract 1.3.0 plus all four AP-PDN-001 artifacts.
2. It specifies target entities, business invariants, routes, migration mapping and K0–K6 slices.
3. It requires PK-01–PK-24, repository quality commands and evidence-backed handoff.
4. It cannot be interpreted as production approval or automatic sprint advancement.
5. Existing developer prompt points to the specialized prompt and no longer cites Active Product Contract 1.2.0.

## Negative, permission, and edge cases

- Missing predecessor acceptance yields S0/K0 audit only.
- Aggregate legacy likes cannot create voters or reputation.
- Dirty application work is not overwritten.
- Production credentials, migrations, deployments, DNS and live money remain approval-gated.

## Security, privacy, payment, and protected-content impact

The prompt carries forward upload quarantine/sanitization, server authorization, public DTO PII exclusion, analytics redaction and single-seller commerce isolation. It introduces no data processing itself.

## Analytics and observability impact

No runtime event is emitted by this documentation task. The prompt requires the target WVSA event vocabulary without inventing a numeric target or logging raw content/PII.

## Dependencies

- Active Product Contract 1.3.0.
- AP-PDN-001 product artifacts.
- Task Contract validator, sprint catalog, policy hooks and handoff schema.

## Allowed write paths

- `agent-pack/PROMPT-IMPLEMENT-PROMPT-KNOWLEDGE-NETWORK.md`
- `agent-pack/PROMPT-CHO-CHAT-DEV.md`
- `agent-pack/product/README.md`
- `agent-pack/tasks/TASK-PDN-002-author-implementation-prompt.md`
- `docs/product-owner-learning-checklist.md`

## Required approvals

- Owner request authorizes writing the developer prompt.
- Independent review remains required for S0 acceptance and any later implementation result.

## Test evidence required

- Task Contract validator and self-test pass.
- AI contract validation passes.
- Search confirms current Product Contract reference and required AP-PDN-001/K0–K6/PK-* content.

## Migration, rollout, and rollback

Documentation-only. Rollback removes the specialized prompt and its entrypoint links; it does not change application/runtime state. Reversing AP-PDN-001 itself requires a new owner Product Contract decision.

## Risks, assumptions, and unresolved decisions

- ASSUMPTION: the dev agent can read repository-local artifacts before acting.
- RISK: a single long prompt may be partially followed; authoritative local file references, Task Contract validation and one-slice stop rules reduce drift.
- UNKNOWN: which exact implementation sprint is currently accepted; the prompt must discover rather than assume it.

## Definition of Ready result

Ready. Owner explicitly requested a dev implementation prompt; authoritative product artifacts exist, scope is documentation-only and no unresolved choice is needed to author safe execution instructions.

## Completion evidence

- Specialized implementation prompt created and linked from developer/product entrypoints.
- Active contract reference updated to 1.3.0 in the general developer prompt.
- Product Owner learning checklist records the artifact without marking human mastery.
- No application/runtime/database file changed by this task.
