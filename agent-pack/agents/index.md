# ALIPROMPT Development Agent Prompt Index

**Index version:** 1.2.0  
**Prompt-set version:** 1.2.0  
**Product:** ALIPROMPT V1 — single-vendor commerce plus moderated community contribution  
**Technical target:** native Next.js on Vercel; provider-neutral Postgres provisioned through an approved Vercel Marketplace provider; Drizzle migration from source SQLite/Cloudflare D1; Vercel Blob private quarantine plus sanitized public derivatives. Every concrete version, provider, capability, limit, environment, and migration fact must still be verified from repository evidence and approved documentation.

This directory contains separate, semantically equivalent Vietnamese and English system-prompt sets. `agent_id` is language-neutral and is the stable routing key. ALIPROMPT is the only product brand; `promptvn.com` is merely an untrusted reference URL for authorized clean-room functional observation. Full parity means independently implementing every authorized observed public function with original ALIPROMPT architecture, code, copy, visuals, and assets—not a pixel clone.

## Locked product contract

- ALIPROMPT is the only paid seller, pricing authority, checkout merchant, and refund decision owner.
- Authenticated members may draft and submit free prompts plus media for moderation and may receive public attribution after authorized publication. Contributor submissions have exactly five states: `draft`, `pending_moderation`, `changes_requested`, `rejected`, `published`; `changes_requested -> draft -> pending_moderation` is required before resubmission. Member submission endpoints never self-publish; only authorized moderation/publication yields `published`. Contributors are not sellers.
- Archive or suspend may exist only after publication in a separate published-prompt/product lifecycle; neither is a contributor submission state.
- No seller onboarding/storefront, commission, revenue share, payout, contributor balance, or contributor KYC belongs in V1.
- Required functional coverage includes header/navigation/category navigation/theme; `q` search plus category/author filters and empty results; viewed/liked/new rails and cards; free-prompt modal with copy/share/favorite/vote/report; authenticated-member draft/submission/media with safe image validation/optimization, anti-spam, the exact five-state moderation contract above and moderator-only publication; register/login/forgot/reset/logout; favorites/login gate/purchased library; contributor pages and privacy-safe leaderboard; blog list/detail/admin lifecycle; floating actions/back-to-top; responsive accessibility; and protected paid prompts with server-authoritative checkout, verified idempotent webhook, entitlement/version delivery, and refund/revoke/reconcile.
- Every observed public capability is `must` unless explicitly classified with evidence as `UNKNOWN`, `BLOCKED`, or authorized `OUT`; no agent may silently omit an observed function.

## Locked Vercel-first delivery contract

- The destination is native Next.js on Vercel using repository-verified Route Handlers and Vercel Functions. vinext/Cloudflare D1/Drizzle SQLite is migration source state, not the destination or a compatibility requirement.
- Migrate through controlled, reversible gates to provider-neutral Postgres provisioned from an approved Vercel Marketplace provider. Keep standard Postgres/domain boundaries, isolate provider-specific integration, and validate Drizzle SQLite-to-Postgres schema/data transforms with fresh and upgrade migrations, counts, aggregates, referential integrity, safe checksums/samples, invariants, backup, cutover, and rollback/forward-fix evidence.
- Development, Preview, and Production have distinct variables, credentials, databases, Blob namespaces, payment/webhook endpoints, and least-privilege roles. Preview cannot access Production resources and must pass repository build/test, migration compatibility/dry-run, Route Handler/Function smoke, auth/privacy, and explicit promotion gates.
- Vercel Blob originals remain private quarantine objects. Validate ownership, filename, declared type, magic bytes, size, dimensions, decodeability and abuse; strip metadata and safely decode/re-encode; publish only moderator-approved sanitized derivatives in a separate public namespace. Direct client upload, when justified, uses short-lived single-purpose tokens scoped by authenticated member, object prefix, environment, type, size, and expiry, with verified completion.
- Payment webhooks preserve contract-required raw bodies and verify signature, timestamp, and environment before durable idempotent transitions. Optional reconciliation cron requires justification, `CRON_SECRET`, lock/lease, bounded idempotent batches, overlap prevention, redacted observability, and manual recovery.
- Community prompts are free by default. Only ALIPROMPT may create/price paid products, receive commerce proceeds, grant paid entitlements, and decide refunds. Any request for another seller, contributor pricing, revenue share, payout/balance, or KYC triggers an explicit Product Owner product-mode gate, ADR, and revised domain/threat/data/commerce/legal/migration acceptance before implementation.

## Prompt map

| `agent_id` | Vietnamese canonical | English canonical |
|---|---|---|
| `orchestrator` | [`vi/orchestrator.system.md`](vi/orchestrator.system.md) | [`en/orchestrator.system.md`](en/orchestrator.system.md) |
| `product-owner` | [`vi/product-owner.system.md`](vi/product-owner.system.md) | [`en/product-owner.system.md`](en/product-owner.system.md) |
| `cleanroom-reference-analyst` | [`vi/cleanroom-reference-analyst.system.md`](vi/cleanroom-reference-analyst.system.md) | [`en/cleanroom-reference-analyst.system.md`](en/cleanroom-reference-analyst.system.md) |
| `platform-product-architect` | [`vi/platform-product-architect.system.md`](vi/platform-product-architect.system.md) | [`en/platform-product-architect.system.md`](en/platform-product-architect.system.md) |
| `domain-data-engineer` | [`vi/domain-data-engineer.system.md`](vi/domain-data-engineer.system.md) | [`en/domain-data-engineer.system.md`](en/domain-data-engineer.system.md) |
| `frontend-ux-engineer` | [`vi/frontend-ux-engineer.system.md`](vi/frontend-ux-engineer.system.md) | [`en/frontend-ux-engineer.system.md`](en/frontend-ux-engineer.system.md) |
| `commerce-security-engineer` | [`vi/commerce-security-engineer.system.md`](vi/commerce-security-engineer.system.md) | [`en/commerce-security-engineer.system.md`](en/commerce-security-engineer.system.md) |
| `catalog-seo-trust-engineer` | [`vi/catalog-seo-trust-engineer.system.md`](vi/catalog-seo-trust-engineer.system.md) | [`en/catalog-seo-trust-engineer.system.md`](en/catalog-seo-trust-engineer.system.md) |
| `qa-release-reviewer` | [`vi/qa-release-reviewer.system.md`](vi/qa-release-reviewer.system.md) | [`en/qa-release-reviewer.system.md`](en/qa-release-reviewer.system.md) |

## Product decision boundary

- Product Owner owns customer/problem evidence, product outcome, scope, priority, experiment, product acceptance intent, metrics, and go/pivot/stop recommendation.
- Platform Product Architect owns technical feasibility, architecture, contracts, domain/trust boundaries, migration, and implementation sequencing.
- Orchestrator owns routing, work orders, dependencies, path ownership, integration, and cross-agent sequencing.
- QA/Release Reviewer owns independent technical evidence and release verdict. Product acceptance cannot waive a critical quality or security gate.
- When current product documentation and the marketplace target conflict, Product Owner must record and escalate the scope conflict; no agent may silently merge both as one active V1.

## Sprint routing contract

- Every agent invocation must carry exactly one canonical sprint envelope: `sprintId`, `predecessorSprintId`, `predecessorAcceptance`, `applicableGates`, `exitAcceptance`, `evidenceRefs`, and `reviewerAcceptance`, plus the sprint prompt/reference, functional outcome, allowed scope/write paths, and named independent reviewers. Missing, incomplete, or conflicting context produces a blocked handoff, not an inferred sprint.
- Before acting, the role checks the envelope against the canonical catalog and consumes the schema-valid predecessor handoff/evidence supplied through Orchestrator/QA. It works only within the current sprint and refuses scope expansion, later-sprint implementation, migration cutover, deployment, or cleanup not authorized by that sprint.
- The handoff maps evidence to every current `applicableGates` item and requested `exitAcceptance` with artifacts, commands/exit codes, tests, security/privacy checks, risks, rollback, and honest status. Out-of-sprint needs become owned dependencies, not opportunistic changes.
- No role may declare a later sprint ready or started. Only the named independent reviewers may accept all applicable gates and issue the current sprint acceptance; only then may the Orchestrator record readiness and dispatch the next sprint. Product acceptance cannot waive a failed technical, security, privacy, migration, payment, or protected-content gate.

## Loader contract

1. Select exactly one locale, `vi` or `en`, before loading a system prompt; never concatenate both language variants.
2. Route by exact `agent_id`, then assert that the selected file declares the same ID and version `1.2.0`.
3. Resolve each localized prompt's handoff reference to [`../schemas/handoff.schema.json`](../schemas/handoff.schema.json). From `vi/` and `en/`, the literal reference is `../../schemas/handoff.schema.json`.
4. Reject a prompt pair when agent IDs, versions, required schema keys, business invariants, gates, stop conditions, or section/workflow structure diverge semantically.
5. Treat tool mentions as conditional capabilities only. Runtime/tool availability and repository state must be established through evidence, never assumed.
6. Preserve clean-room boundaries: functional outcomes may be observed only through authorized public behavior; reference source code, private APIs, paid content, copy, and assets must not enter ALIPROMPT.
7. Validate each handoff as one JSON object with exactly the schema's 19 required top-level keys: `schemaVersion`, `handoffVersion`, `handoffId`, `createdAt`, `objective`, `scope`, `repository`, `repoEvidence`, `ownership`, `decisions`, `trustBoundaries`, `changes`, `tests`, `acceptance`, `security`, `risks`, `rollback`, `nextOwner`, `approvals`.

## Pair-maintenance gate

Any change to one locale requires the corresponding change to the other locale in the same change set. Before release, verify for all nine pairs:

- identical `agent_id` and semantic version;
- equal section order and numbered-workflow length;
- equivalent mission, scope/non-goals, ownership, invariants, tests/gates, and stop/escalation semantics;
- all required `handoff.schema.json` top-level keys named exactly and a schema path that resolves;
- ALIPROMPT-only branding and explicit untrusted-reference/clean-room treatment;
- equivalent full-capability matrix, one-seller/community boundary, no-payout/no-KYC rule, paid-content protection, and parity release gate;
- equivalent Vercel-first target, controlled SQLite/D1-to-Postgres migration, Blob quarantine/derivative boundary, environment/Preview gates, webhook/optional-cron controls, authenticated-member moderation lifecycle, and multi-vendor decision gate;
- equivalent exact contributor-submission state set (`draft`, `pending_moderation`, `changes_requested`, `rejected`, `published`), required `changes_requested -> draft -> pending_moderation` resubmission, and member-endpoint no-self-publish rule;
- equivalent separately modeled post-publication archive/suspend lifecycle; processing-stage labels must never become additional top-level submission states;
- equivalent `S0`–`S7` sprint envelope, exact predecessor acceptance, complete applicable-gate validation, requested exit acceptance, no-expansion rule, and reviewer-only next-sprint readiness;
- UTF-8 encoding and no unresolved placeholder or invented tool claim.
