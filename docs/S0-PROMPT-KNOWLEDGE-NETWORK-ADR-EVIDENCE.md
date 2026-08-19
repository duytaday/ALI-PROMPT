# S0 — Prompt Knowledge Network: ADR & evidence package

`sprint: S0` · `entry: START` · `applicable gates: G0, G1` · `requested exit: S0_ACCEPTED`  
`active product contract: ALIPROMPT-COMMERCE-COMMUNITY-V1 v1.4.0 (approved_next)`  
`audit time: 2026-08-18T03:42:23Z` · `status: review required; not an acceptance`

## Authority, scope, and clean-room boundary

The active contract is the target authority. `README.md`, `docs/product-blueprint.md`, existing source, prior S0 briefs, plans, and task templates are current-state or planning evidence only. `AP-PDN-001` requires a Question → Prompt Answer → immutable Prompt Version → Output Evidence → Attempt knowledge graph; ALIPROMPT remains the sole commercial seller.

The public reference was re-observed read-only on 2026-08-18. It exposed discover/search/category filtering, ranked rails, cards, author discovery, copy, favorite, votes, report, contribution, auth, leaderboard, blog and theme outcomes. This package records only those abstract outcomes. It contains no source, DOM/CSS, asset, reference copy, prompt body, identity, or private API; ALIPROMPT routes, copy, taxonomy, UI, data and code remain original.

S0 writes only this evidence package, its Task Contract, and the handoff. It does not modify application code, schema, migrations, dependencies, providers, environment variables, Vercel, DNS, data, or payments.

## Repository evidence ledger

| Class | Evidence and conclusion |
| --- | --- |
| CURRENT | `main` is at `944121f3fc8313cf52eaf7f8f9068c5f2591b26a` and has a broad dirty/untracked worktree. The uncommitted runtime names Next.js 16, React 19, Drizzle/Postgres and Vercel Blob; it exposes public, account, catalog, admin, moderation, media, checkout and webhook routes. None of this is a sprint acceptance. |
| CURRENT | `db/schema.ts` declares 16 operational tables and six uncommitted Drizzle SQL files. The current schema does not evidence the AP-PDN-001 Question, Answer, Version, Artifact, Attempt, Tags, vote, reputation or outbox aggregates. |
| CURRENT | No Vercel binding, `VERCEL_*`, `POSTGRES_*`, Blob or Supabase variable is present in this local process. `docs/vercel-deployment.md` records Preview as unconfigured. No database inventory, Preview, browser E2E, real Blob, payment, email, backfill or independent-review receipt exists. |
| APPROVED NEXT | The active v1.4.0 contract selects native Next.js on Vercel, Supabase-managed PostgreSQL used only through Drizzle/Postgres, Vercel Blob, isolated environments, single-seller commerce, and moderated free member contribution. |
| APPROVED NEXT | AP-PDN-001 selects the knowledge-network domain and additive, reversible K0–K6 migration. The absolute WVSA target and several policy values remain owner decisions. |
| GAP/BLOCKED | Exact independent `S0_ACCEPTED` evidence is absent. Existing `HO-S0-K0-20260818` is `partial`, with approval pending; template strings are not acceptance evidence. |
| OUT/LATER | Multi-vendor, payout/KYC/commission, vector search, autonomous moderation, provider activation, Production migration/deploy and DNS changes are outside S0. |

### Dirty-tree and ownership treatment

All paths present before this S0 document are preserved. No `.ai/project.json`, `.ai/active-task.json`, `.ai/context/CURRENT_STATE.md`, `.ai/ownership.json`, or `docs/OWNERSHIP.md` exists, so a future writer must obtain an explicit baseline and file lease. This S0 does not attribute existing uncommitted application work to any sprint.

## Capability-to-delivery map

The detailed clean-room matrix is `agent-pack/references/promptvn-capability-matrix.md`; this table binds every mandatory outcome to an ALIPROMPT owner, target surface, acceptance evidence and first owning sprint. “Current” means source presence only, never acceptance.

| IDs | ALIPROMPT target surface | Evidence required | First sprint / accountable owner |
| --- | --- | --- | --- |
| CAP-01 | Original semantic shell, navigation, account state, theme and mobile focus behavior | keyboard, contrast, theme, responsive evidence | S3 / frontend-ux-engineer |
| CAP-02 | Original home, search CTA and ALIPROMPT taxonomy | clean-room copy/provenance and route evidence | S3 / catalog-seo-trust-engineer |
| CAP-03 | Typed `q`/category/author search with deterministic URL state | injection, reset, back/forward and sort tests | S3 / catalog-seo-trust-engineer |
| CAP-04 | Honest zero-result recovery state | SR, keyboard and URL-state test | S3 / frontend-ux-engineer |
| CAP-05 | Viewed/useful/new rails from validated signals | ranking provenance and abuse tests | S5 / catalog-seo-trust-engineer |
| CAP-06 | Safe cards and public DTO allowlist | paid-body and PII leak test | S3 / catalog-seo-trust-engineer |
| CAP-07 | Canonical Question detail plus accessible quick view | focus/Escape/deep-link/protected-body tests | K1 after S0; public delivery S3 / frontend-ux-engineer |
| CAP-08 | Policy-aware copy/share | entitlement and telemetry redaction test | S5 / frontend-ux-engineer |
| CAP-09 | Member bookmark/favorites/private library | unique/idempotent/IDOR tests | S5 / frontend-ux-engineer |
| CAP-10 | Separate reversible usefulness vote | self-vote, atomic direction and abuse tests | K3 after predecessor / domain-data-engineer |
| CAP-11 | Privacy-safe report to moderation case | rate, dedupe, receipt and audit tests | S5 / catalog-seo-trust-engineer |
| CAP-12 | Verified member ask/answer/share, always free and moderated | ownership, CSRF, zero-price and state tests | K2 after predecessor / catalog-seo-trust-engineer |
| CAP-13 | Scoped private quarantine upload to sanitized public derivative | token, magic byte, metadata, bomb and boundary tests | S4 / commerce-security-engineer |
| CAP-14 | Register/login/logout/forgot/reset | enumeration, token, session and CSRF tests | S2 / commerce-security-engineer |
| CAP-15 | Private bookmarks/free grants/paid entitlement library | anonymous/wrong-user/revocation tests | S5 / frontend-ux-engineer |
| CAP-16 | Public profile with handle only | PII and publication-state projection tests | S5 / catalog-seo-trust-engineer |
| CAP-17 | Privacy-safe quality leaderboard | limits, deterministic sort, abuse and PII tests | K5/S5 after predecessor / catalog-seo-trust-engineer |
| CAP-18 | Published-only blog and editorial workflow | draft noindex, metadata and role tests | S5 / frontend-ux-engineer |
| CAP-19 | Accessible floating context actions | touch, overlap, focus and reduced-motion test | S3 / frontend-ux-engineer |
| CAP-20 | Loading/empty/error/retry/responsive accessibility | browser/a11y/zoom evidence | S3 onward / frontend-ux-engineer |
| CAP-21 | Least-privilege product, moderation, report and blog operations | RBAC/state/audit integration tests | S4–S6 / catalog-seo-trust-engineer |
| COM-01 | ALIPROMPT-owned price/currency/license/version | server-authority/minor-unit test | S6 / commerce-security-engineer |
| COM-02 | Server-calculated sandbox checkout/order snapshot | tamper/retry test | S6 / commerce-security-engineer |
| COM-03 | Signed raw-body unique webhook ledger | duplicate/out-of-order/replay test | S6 / commerce-security-engineer |
| COM-04 | Exactly-once entitlement/fulfillment | transaction/reconciliation test | S6 / domain-data-engineer |
| COM-05 | Buyer history distinct from bookmark/free state | authorization/revocation test | S6 / frontend-ux-engineer |
| COM-06 | Refund/dispute/revocation policy | verified state-transition test | S6 / commerce-security-engineer |
| COM-07 | Protected paid-body boundary | SSR/RSC/cache/search/log negative tests | S3/S6 / commerce-security-engineer |
| COM-08 | Owner-only commerce operations | RBAC/audit/idempotency test | S6 / commerce-security-engineer |
| PLT-01 | Native Next.js on isolated Vercel Preview | Preview build and legacy inventory | S1 / platform-product-architect |
| PLT-02 | Supabase PostgreSQL behind Drizzle/Postgres | dialect/backfill/reconciliation evidence | S1 then K0/K6 / domain-data-engineer |
| PLT-03 | Development/Preview/Production isolation | binding fingerprints and negative test | S1 / platform-product-architect |
| PLT-04 | Two Blob trust zones | scoped grant and distinct-store receipts | S4 / commerce-security-engineer |
| PLT-05 | Route-handler webhook and bounded authenticated cron | signature/lease/checkpoint/retry tests | S6/S7 / commerce-security-engineer |
| PLT-06 | Function, connection, region and plan boundaries | current official limits plus load/boundary evidence | S1/S7 / platform-product-architect |
| PLT-07 | Reversible Preview-first release | backup, restore, cutover and rollback drill | S7 / qa-release-reviewer |

## Architecture decisions

### ADR-S0-01 — Native Next.js, Vercel and isolated environments

- **Context:** current worktree is already shaped as a Next.js application; target contract selects Vercel. Local process has no Vercel binding evidence.
- **Alternatives:** retain Cloudflare/vinext as target; deploy a shared environment; native Next.js with Dev/Preview/Production isolation.
- **Decision:** native Next.js on Vercel is the target. Existing Cloudflare/D1/vinext materials remain legacy/recovery evidence until a separately accepted cutover. Every Preview uses separate data, Blobs, secrets, callbacks, payments and telemetry; Preview is noindex.
- **Consequences:** S1 must produce binding manifests, a Preview receipt and legacy inventory. No Vercel deploy or configuration action is authorized by this ADR.
- **Rollback:** retain legacy runtime/configuration/data and return traffic to the last known-good artifact only under a later approved release plan.

### ADR-S0-02 — PostgreSQL provider, Drizzle and data migration

- **Context:** active contract records Supabase as PostgreSQL provider, while `drizzle.config.ts` and the schema are the application migration authority. No real database is available to audit.
- **Alternatives:** use Supabase Auth/Storage/Data API as an implicit target; run `supabase db push` alongside Drizzle; use Drizzle/Postgres only with one migration authority.
- **Decision:** Supabase is the managed PostgreSQL provider only. Drizzle SQL is schema authority. Pool-compatible connection is for serverless app traffic; a direct/session-safe connection is for migration/backup operations. Supabase product features are out unless a new ADR approves them.
- **Consequences:** no database migration begins until K0 captures source backup/export, table counts, keys, null/status distributions, PII classes, file/MIME inventory, identity quality, hashes, exception ledger and compatible type/default/index/transaction mapping.
- **Rollback:** additive expand → idempotent backfill → count/hash/invariant verification → compatibility read/feature flags → cutover → separate contract. Preserve legacy source and stop on reconciliation mismatch.

### ADR-S0-03 — Knowledge aggregates and public DTOs

- **Context:** AP-PDN-001 supersedes the one-layer catalog target for community knowledge. Current `prompts` remains a legacy source.
- **Alternatives:** retain prompt as the permanent aggregate; add a third prompt-post type; make Question central with Prompt Answer, Version, Artifact and Attempt.
- **Decision:** Question is central; Share Prompt atomically creates Question + self-authored Answer + Version + Evidence. Legacy prompt becomes a self-answered Question only through additive migration. Public query DTOs are allowlisted and never expose email, auth IDs, IP, moderation evidence, raw Blob keys or protected bodies.
- **Consequences:** K1 is read-only canonical adapter; K2 is verified-member ask/answer/share; K3 handles vote/accept/bookmark/attempt/version; K4 search/tags/duplicates; K5 signal-only reputation/review; K6 reconciliation/cutover.
- **Rollback:** flags separate legacy/new read, write, attempt, reputation and ranking paths. No legacy table drop in MVP.

### ADR-S0-04 — Blob evidence pipeline

- **Context:** evidence requires text/image/PDF; raw user objects must not be public. Current source presence does not prove two real stores.
- **Alternatives:** client-supplied Blob URL; one shared public/private store; private raw quarantine plus distinct public sanitized store.
- **Decision:** server issues short-lived intent bound to verified member, draft, environment, purpose, MIME/count/byte constraints and nonce. Raw bytes enter private quarantine. Actual type/magic/decode/resource safety are checked; raster is normalized/re-encoded and stripped of metadata; only approved sanitized derivatives are public.
- **Consequences:** no public raw key, signed private URL, scanner result or moderation evidence appears in a DTO/log/analytics. Scanner uncertainty quarantines and blocks publication. Numeric limits remain versioned owner decisions except already-approved policy values.
- **Rollback:** revoke by status/policy and retain immutable artifact receipts; bounded audited cleanup may remove only scoped orphans/quarantine objects under a later job contract.

### ADR-S0-05 — Identity, payment and operational side effects

- **Context:** account recovery, commerce and scheduled reconciliation carry sensitive authority.
- **Decision:** authenticated server session plus server-side ownership/RBAC controls every mutation. Password/reset tokens are hashed, short-lived and single-use; responses are non-enumerating. Checkout uses server-owned catalog/price. Only signature-verified raw provider event changes orders/entitlements. Outbox/cron work is durable, bounded, authenticated, idempotent and environment-scoped.
- **Consequences:** contributor work remains zero-price/moderated and cannot create seller, payout, commission, tax-beneficiary, KYC, refund or entitlement authority. Future analytics includes WVSA but no raw prompt, email, PII or evidence bytes.
- **Rollback:** stop checkout/fulfillment/submission/publication via server-owned kill switches in a later approved implementation; reconcile from durable ledger rather than a redirect or in-memory task.

### ADR-S0-06 — Evidence, observability, backup and release

- **Context:** build/lint/source presence cannot prove Preview, data, provider or release behavior.
- **Decision:** every gate binds command output, revision, environment, configuration fingerprint, deployment ID when applicable, reviewer and timestamp. Production release needs isolated Preview, backup/restore, migration rehearsal, reconciliation, security/a11y/performance evidence, independent QA and explicit human approval.
- **Consequences:** no `S0_ACCEPTED`, S1 dispatch or Production action is implied by this document. `docs/marketplace-s0-clean-room.md` is historical/informational where it conflicts with AP-PDN-001 or the canonical S0–S7 sequence.
- **Rollback:** retain previous artifacts and source data through the observation window; no destructive legacy retirement without later explicit approval.

## State, authority, threat and test contract

**Authority:** only ALIPROMPT controls commercial pricing, sale, refund and entitlement. Verified members can create free drafts; moderators/operators alone decide publication. Guest submission is denied by default. Question owner alone accepts one answer; self-vote is forbidden; self-attempt never counts toward independent WVSA.

**Key states:** Question `draft|pending|published|closed|duplicate|archived`; Answer `draft|pending|published|rejected|archived`; Artifact `staged|scanning|clean|rejected|deleted` plus moderation decision; Attempt `pending|published|rejected|withdrawn`; contribution-visible state stays `draft|pending_moderation|changes_requested|rejected|published`.

**Threat controls to test before release:** cross-user IDOR, CSRF/origin, reset-token replay/enumeration, self-vote and vote retry, accept race, version/attempt binding, duplicate cycle, paid-body/PII leakage, unsafe upload and Blob cross-owner intent, moderation bypass, provider webhook replay/mismatch, cron overlap, Preview-to-Production crossover, secret/log exposure and destructive cleanup scope.

**S0 test strategy:** validate contracts/task/handoff; record read-only current baseline; make all future PK-01…PK-24 tests explicit. Do not call source presence a product pass. S1 must add environment/Preview/migration checks only after independent S0 acceptance.

## Owner decisions and S1 interface

The human owner must decide: initial WVSA target/window, behavior-changing file caps, self-answer accept delay, reputation points/thresholds, moderation SLA, tags beyond vertical categories, retention/appeal policy, legal/license/refund policy, production provider activation and production release. No value is invented here.

If S0 is independently accepted, S1 may only establish native Next/Vercel foundation, environment isolation, Preview and PostgreSQL/Drizzle scaffolding. Its task must bind `S0_ACCEPTED` to this exact evidence/revision or a newly reviewed successor. It may not deploy Production, migrate Production, activate a provider, change DNS or delete legacy assets.

## S0 verdict

Documentation and discovery evidence are complete enough for independent review, but S0 is **not accepted**: external data/Preview evidence, owner decisions and independent QA verdict are absent. This package therefore stops at S0 and does not authorize S1.
