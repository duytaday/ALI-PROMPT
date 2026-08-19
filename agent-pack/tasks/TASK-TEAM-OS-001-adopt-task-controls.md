# TASK-TEAM-OS-001 — Adopt scoped task controls for ALIPROMPT

## Metadata

- Status: Done
- DRI: `product-owner`
- Independent reviewer: `qa-release-reviewer`
- Human approver: ALIPROMPT human owner
- Risk level: Low — documentation and local validation tooling only
- Parent product contract: `ALIPROMPT-COMMERCE-COMMUNITY-V1` v1.4.0 (`approved_next`), `../product/ACTIVE-PRODUCT-CONTRACT.md`
- Historical execution note: this task originally completed against v1.2.0; the parent reference was advanced after owner decision `AP-PDN-001`. That later product decision does not retroactively expand this task's scope or completion evidence.

## Sprint envelope

- `sprintId`: `S0`
- `predecessorSprintId`: `null`
- `predecessorAcceptance`: `START`
- `applicableGates`: `G0`, `G1`
- `exitAcceptance`: `S0_ACCEPTED`
- `evidenceRefs`: repository paths and recorded local command output
- `reviewerAcceptance`: independent `qa-release-reviewer` review required before this work is treated as accepted

## Problem and evidence

`agent-pack` already has product truth, canonical S0–S7 sequencing, specialist roles, quality gates, and a 19-key machine handoff. It lacks a compact, reusable work-order artifact and structural validator for an individual scoped task. `codex-prompt-product-team-os` provides useful generic examples, but its generic ownership, TBD stack configuration, and separate active-task model must not become ALIPROMPT authority.

## Target actor and outcome

The immediate actors are ALIPROMPT agents and reviewers preparing one bounded sprint. Their outcome is a reviewable work order with explicit authority, scope, acceptance, and technical evidence requirements before any write work begins.

## Scope

- Add a task-contract template and validator that bind every work order to the active product contract and canonical sprint envelope.
- Add an optional prose review-notes template that precedes, but never replaces, the canonical JSON handoff.
- Add an explicit registry and runner for existing repository technical commands as evidence only.
- Document how these artifacts fit into the existing ALIPROMPT runbook.

## Non-scope

- Application, database, migration, deployment, provider, credential, payment, entitlement, catalog, or user-facing behavior changes.
- Replacing `ACTIVE-PRODUCT-CONTRACT.md`, the S0–S7 catalog/hook sequence, the 19-key handoff schema, QA verdict, or human production approval.
- Copying generic role prompts, custom-agent definitions, hooks, or `active-task.json` from the reference kit.
- Choosing real pricing, licenses, retention, providers, or production actions.

## Current behavior and constraints

The approved target is commerce/community as `APPROVED NEXT`; the current repository is a separate baseline/gap. Canonical sprint progression and quality gates already reside in `../skills/catalog.yaml`, `../hooks/policy-pipeline.yaml`, `../evals/quality-gates.md`, and `../schemas/handoff.schema.json`.

## Required behavior

Every new scoped task can use one template, validate required structure locally, name its exact sprint context, preserve the active product contract as authority, and map technical commands to evidence without allowing a script to declare product or release acceptance.

## Acceptance criteria

1. A task-contract template requires parent active contract, all seven canonical sprint-envelope fields, DRI, reviewer, scope/non-scope, acceptance, allowed paths, approvals, risks, test evidence, and DoR result.
2. A local validator rejects missing required sections, unresolved placeholders, incomplete sprint context, missing acceptance criteria, missing allowed paths, or a parent contract mismatch.
3. Optional prose review notes state that they are not a machine handoff and retain the schema-valid 19-key JSON handoff as the only canonical machine artifact.
4. A technical-command registry uses only existing ALIPROMPT commands and explicitly states that command success is technical evidence, not G0–G7, QA, product, or production acceptance.
5. The runbook links the new artifacts and states that they cannot override the active product contract or authorize a later sprint.
6. No application source, runtime configuration, database, migration, provider, credential, production resource, or existing canonical schema is changed.

## Negative, permission, and edge cases

- A task that requests S2 work with S1 evidence or an incorrect acceptance label is rejected by the validator.
- A task cannot use `TBD`, `UNSET`, or an empty scope/approval/allowed-path field as a ready contract.
- A successful technical command cannot be used to self-accept an exit gate, waive a blocker, or dispatch a later sprint.

## Security, privacy, payment, and protected-content impact

No new user data, secret, payment, entitlement, or prompt-content processing is introduced. The artifacts explicitly preserve the existing prohibition on embedding secrets, raw PII, protected paid bodies, or credentials in tasks, review notes, or command output.

## Analytics and observability impact

No analytics events are introduced. The command runner prints command identity and exit status only; it inherits repository redaction requirements for any retained evidence.

## Dependencies

- Existing Node.js runtime and the root repository `js-yaml` dependency already used by ALIPROMPT validation.
- Canonical active product contract, sprint catalog, hook sequence, quality gates, and handoff schema remain available at their existing paths.

## Allowed write paths

- `agent-pack/tasks/**`
- `agent-pack/templates/**`
- `agent-pack/scripts/**`
- `agent-pack/quality/**`
- `agent-pack/RUNBOOK.md`
- `docs/product-owner-learning-checklist.md`

## Required approvals

- No new human approval is required to add workflow-only documentation and local validation tooling.
- Independent `qa-release-reviewer` review is required for `S0_ACCEPTED` evidence.
- Any future hook installation, production command, or change to product/architecture authority requires a new task and the relevant owner approval.

## Test evidence required

- The new validator passes this task contract and rejects at least one intentionally incomplete temporary fixture.
- The technical runner succeeds in dry-run mode and records which existing commands it would run.
- Existing `npm run ai:validate` and `npm run lint` are run if available; pre-existing failures are reported separately.

## Migration, rollout, and rollback

No data or runtime migration. Rollback is deletion of only the files created by this task and reversal of the runbook references; it does not alter app state.

## Risks, assumptions, and unresolved decisions

- ASSUMPTION: `npm run ai:validate` and `npm run lint` remain the repository-native technical checks until S0 establishes a fuller quality matrix.
- UNKNOWN: final Next.js/Vercel migration tooling and production providers; this task does not decide them.

## Definition of Ready result

Ready. The ALIPROMPT human owner explicitly authorized adopting useful workflow controls from the reference kit; scope is documentation/local tooling only, the active contract is pinned, and no material product or technical decision is being made.

## Completion evidence

- `node agent-pack/scripts/validate-task-contract.mjs --all --self-test` passed; the self-test rejects missing sections plus `TBD` scope, allowed-path, and approval fixtures.
- `node agent-pack/scripts/run-technical-quality-gates.mjs --only ai-contracts,lint,full-test` passed.
- Independent read-only QA review passed after validator content/placeholder checks were added.
- The implementation changed only task-control artifacts under the allowed paths; it did not change application source, database, runtime configuration, providers, credentials, or canonical product/handoff contracts.
