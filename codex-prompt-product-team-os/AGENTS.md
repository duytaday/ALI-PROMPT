# Repository operating agreement

## Mission
Build a trustworthy Prompt Product Platform that can evolve from single prompts into prompt packs, workflows, assistant blueprints, and agent templates without corrupting product semantics, entitlements, or customer trust.

## Truth hierarchy
When information conflicts, use this order:
1. Executable repository behavior and tests.
2. Approved ADRs and domain documents.
3. The active Task Contract.
4. Other project documentation.
5. Explicitly labeled assumptions.

Never silently invent a product, architecture, pricing, licensing, security, or data-retention decision.

## Before work
1. Read `.ai/project.json`, `.ai/active-task.json`, and `.ai/context/CURRENT_STATE.md`.
2. Read the closest applicable `AGENTS.md` or `AGENTS.override.md`.
3. Confirm the task has an owner, scope, non-scope, acceptance criteria, allowed write paths, and required approvals.
4. If Definition of Ready is not met, stop implementation and return a Task Contract gap list.

## Delegation
- Use subagents for bounded, independent work.
- Prefer parallel agents for exploration, test analysis, documentation verification, triage, and review.
- Do not let multiple agents write the same path in the same worktree.
- Parallel write work requires isolated worktrees and non-overlapping ownership.
- The parent agent remains accountable for integration and final evidence.

## Ownership
- One DRI owns each artifact and decision.
- Respect `.ai/ownership.json` and `docs/OWNERSHIP.md`.
- Agents may recommend outside their domain but may not silently decide outside it.
- Security may block critical security/privacy defects.
- QA may block release for unmet acceptance criteria or release-blocking regressions.
- The human Founder approves pricing, licensing policy, collection of new personal data, irreversible migrations, production release, and material scope changes.

## Implementation rules
- Implement the smallest coherent vertical slice that satisfies the Task Contract.
- Reuse existing components and utilities before creating new ones.
- Do not change unrelated code.
- Do not add a production dependency without documenting why the existing stack is insufficient.
- Database changes require a migration, backward-compatibility assessment, and rollback/backfill plan.
- Public behavior changes require tests and documentation updates.
- Every user-facing feature must address loading, empty, error, permission, and success states where applicable.

## Prompt-product rules
Every sellable prompt product must define:
- Product type: single prompt, pack, workflow/stack, assistant blueprint, or agent template.
- Audience, job-to-be-done, expected outcome, and prerequisites.
- Input variables with type, validation, defaults, examples, and sensitivity classification.
- Model/provider compatibility and known limitations.
- Version, change log, compatibility policy, and customer entitlement behavior.
- Preview/redaction policy that avoids leaking the full paid asset.
- Example input/output and evaluation criteria.
- License and permitted usage.

Do not store secrets, payment credentials, or unnecessary personal data inside prompt templates, examples, logs, analytics, or eval fixtures.

## Validation
Before claiming completion:
- Map each acceptance criterion to evidence.
- Run configured format, lint, typecheck, unit, integration, and E2E checks relevant to the change.
- Report commands and outcomes exactly; never claim a test ran when it did not.
- Review auth, entitlement, payment, privacy, prompt-injection, and abuse implications when relevant.

## Handoff
Every implementation or review handoff must include:
- `OUTCOME`
- `FILES_CHANGED` or `FILES_REVIEWED`
- `ACCEPTANCE_EVIDENCE`
- `TEST_EVIDENCE`
- `DECISIONS`
- `RISKS`
- `UNRESOLVED`
- `NEXT_OWNER`
