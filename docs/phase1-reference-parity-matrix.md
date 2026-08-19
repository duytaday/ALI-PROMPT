# ALIPROMPT — Phase 1 Reference Parity Matrix

**Status:** Phase 1 baseline is in implementation; no Phase 2 enhancement is permitted.  
**Scope:** user-visible public behavior of `https://promptvn.com/`, inspected 2026-08-17. This matrix is a clean-room test specification: it records jobs and interaction contracts, never reference source, private API, paid content, assets, copy, or design tokens.

## Parity definition and guardrails

* **Parity:** an ALIPROMPT user can complete every publicly observable reference job through an original ALIPROMPT route, hierarchy, component, interaction state, and responsive path.
* **Not parity:** copied HTML/CSS/JS, screenshots used as shipped UI, brand marks, prompt bodies, category taxonomy, author identity, images, pixel measurements, or reference-only data.
* **Baseline rule:** Phase 1 first implements the rows below faithfully as product capabilities. Phase 2 may improve a row only with documented before/after behavior and a passing regression against this matrix.
* **Privacy correction:** where public behavior exposes a member email, ALIPROMPT preserves the leaderboard job while withholding personal email; this is an explicit security/privacy guardrail, not a missing capability.
* **Seller correction:** paid catalog, checkout, and entitlement are ALIPROMPT-only even if the reference has no visible paid data today. Empty data never removes the required state machine.

## Route and page-type inventory

| Reference page type | ALIPROMPT Phase 1 route | Required hierarchy / behavior | States to test | Viewports | Status / evidence |
| --- | --- | --- | --- | --- | --- |
| Home/catalog | `/` | Global shell → discovery/search → ranked shelves (most viewed, most appreciated, newest) → card actions → floating utilities | populated, loading, empty shelf, failure/retry, signed-out action gate | desktop, tablet, mobile | Mapped from live DOM; not implemented |
| Search results | `/?q=&topic=&sort=` | Search input + topic filter + results context + result cards + URL-preserved query | query, topic only, query+topic, no result, invalid/oversize query, page change | all | Mapped; not implemented |
| Topic collection | `/topics/[slug]` | Topic context → discovery controls → matching cards | populated, empty, archived topic, 404 | all | Mapped from public category listing; original taxonomy required |
| Contributor collection | `/contributors/[handle]` | Public contributor identity/minimized profile → contribution results | populated, no approved prompts, unknown handle | all | Mapped; not implemented |
| Prompt detail/use | `/prompts/[slug]` | Prompt context, usage guide, media, author attribution, reaction/save/copy/report actions | free, paid teaser, entitled, signed-out, removed, reported, unavailable | all | Required to make card actions meaningful; detailed behavior still to inspect |
| Submit free prompt | `/submit` | Auth-aware submission form: contributor name/profile, original topic, title, body, optional media, anti-abuse gate, review acknowledgement | signed-out, invalid, upload rejected, rate-limited, submitted/pending, retry | all | Mapped from live public form; no direct submission performed |
| Login | `/login` | Credential form, forgotten-password path, validation, return-to safety | invalid, unauthorized, locked/rate limited, success, provider error | all | Mapped from live DOM; not implemented |
| Register | `/register` | Profile + email + password, consent/terms, validation, verification transition | invalid, duplicate email, weak password, verification pending, success | all | Mapped from live DOM; not implemented |
| Password recovery | `/forgot-password` | Email recovery request and neutral anti-enumeration response | invalid, unknown/known email, throttled, success | all | Link observed; page contract to inspect |
| Favorites | `/library/favorites` | Private saved free prompts, remove/save action, sign-in gate | signed-out, empty, populated, unavailable item | all | Floating entry observed; not implemented |
| Library | `/library` | Private unified access to saved and entitled products | signed-out, empty, free saved, paid entitled, revoked grant | all | Required by objective; not implemented |
| Leaderboard | `/leaderboard` | Ranking explanation → contribution table/list → contributor links | populated, ties, no eligible contributors, privacy-safe fields | all | Mapped from live DOM; no public email at ALIPROMPT |
| Blog index | `/blog` | Editorial heading → article list or explicit empty state | empty, populated, loading, failure | all | Mapped from live DOM; not implemented |
| Article | `/blog/[slug]` | Article metadata/body/internal links/related content | published, scheduled/404, archived | all | Required public page type; no live article currently to inspect |
| Checkout | `/checkout/[productSlug]` | Product summary → ALIPROMPT price → provider handoff → return state | signed-out, unavailable product, cancel, pending, paid; never trust browser success | all | Required paid-flow state; no reference data does not waive it |
| Admin | `/admin` | Protected operations console for prompts, submissions, reports, articles, products, orders, grants and audit events | unauthorized, read-only editor, admin success, action error/retry | desktop/tablet minimum, mobile safe read-only | Required objective capability; reference private flows deliberately not inspected |

## Shared components and interactions

| Capability | Phase 1 contract | Required test evidence | Status |
| --- | --- | --- | --- |
| App shell | Brand link, primary nav, auth entry/identity, color-mode control; original ALIPROMPT visual system | Route smoke + keyboard navigation at all viewports | Mapped |
| Topic navigation | Topic browse controls appear where catalog discovery is relevant; selected topic is reflected in URL and accessible name | URL, selected state, keyboard and no-result E2E | Mapped |
| Search | Text + topic filtering; server validates/normalizes query; no string interpolation into database query | E2E plus injection/oversize query tests | Mapped |
| Ranked rails | Previous/next controls, bounded position, touch/keyboard access and an empty state | Desktop/mobile carousel E2E | Mapped |
| Prompt card | Media, original title/summary, original topic, contributor, engagement context, save, vote, copy, report | Card action E2E for visitor/member/admin | Mapped |
| Copy | Copies permitted free/entitled prompt content, announces result, and records a minimal event | Clipboard + screen-reader announcement test | Mapped |
| Favorite | Signed-out opens auth gate; member toggle is idempotent | Auth-gate and double-toggle E2E | Mapped |
| Vote | One policy-controlled reaction per member; signed-out gate and anti-abuse rate control | Duplicate vote and cross-account E2E | Mapped |
| Report | Opens report workflow without publishing data; submission creates auditable moderation item | Validation + report-to-admin E2E | Mapped |
| Theme | Color preference control is keyboard operable and persists per user/device without breaking contrast | keyboard, persistence, contrast tests | Mapped |
| Floating utilities | Favorite/library shortcut, create shortcut, back-to-top; hidden or reordered only when function remains available | viewport/keyboard E2E | Mapped |
| Feedback states | Loading, empty, validation, unauthorized, success, retry, and failure are explicit and announced | State snapshot + axe tests | Required |

## Reference state evidence still needed before Phase 1 sign-off

1. Confirmed from public interaction: a no-match search keeps the active query and shows an explicit empty result state; a signed-out favorite action opens an authentication gate rather than recording a save.
2. Confirmed from the 390×844 public view: the shell retains every primary navigation and auth action, while discovery starts with a compact text/topic search affordance. Phase 1 must preserve reachable functions at mobile widths, not desktop layout dimensions.
3. Confirmed from public interaction: password recovery provides a dedicated email-entry route; the color-mode control changes its pressed state; a card opens a prompt-use dialog with a close control and a second copy action. ALIPROMPT will supply original prompt content only.
4. Still to inspect: authenticated vote/report outcomes, theme persistence across reload, carousel end boundaries, pagination, and visible submit/auth validation messages.
5. Authenticated reference behavior is **not** accessed without an authorized test account. ALIPROMPT will independently implement account/library/admin/payment requirements from the project objective and validate them with its own fixtures.
6. Screenshot pairs at desktop (1440×900), tablet (768×1024), and mobile (390×844) for every completed ALIPROMPT page type. Screenshots support hierarchy/responsive review only; they are not design assets.

## Phase 1 exit gate

Every matrix row must be `implemented`, have test file/link, desktop/tablet/mobile evidence where applicable, and independent QA result. A row with reference data absent still requires its empty/loading/error/unauthorized contract. The baseline is tagged only when zero rows remain `unmapped`, `not implemented`, or `untested`.

## Implementation evidence ledger (2026-08-18)

This ledger prevents a route being mistaken for completed parity merely because it exists.

| Capability | Current implementation | Automated evidence | Still required for Phase 1 acceptance |
| --- | --- | --- | --- |
| Catalog/search/topic/contributor/detail | Dynamic Next routes with PostgreSQL-side normalized filtering, bounded pagination, approved-content visibility and free/paid detail states | `tests/foundation.test.mjs`: catalog bound and server-query assertions; production build route manifest | Browser E2E for populated/empty/error/pagination and screenshots at all target viewports |
| Identity, favorites and library | Opaque cookie session, login/register, safe local return path, authenticated idempotent favorite API and user-scoped library | `tests/foundation.test.mjs`: session/origin and return-path contracts; production build | Cross-user/IDOR E2E, visual responsive evidence, password-email provider integration |
| Community submission and moderation | Authenticated free-only pending submission, validated private Blob staging, cleanup on failure, admin-only auditable approve/reject transition | `tests/foundation.test.mjs`: submission/moderation and Blob-cleanup contracts | Malware/content scanning, public-media promotion policy, upload/moderation E2E and independent QA |
| Reactions, reports and leaderboard | One reaction per member with atomic counters; same-origin authenticated report with rate limit; privacy-safe contributor score | `tests/foundation.test.mjs`: authentication, approved-only target, upsert, rate-limit and no-email contracts | Report review workflow, concurrent-transaction integration test, desktop/tablet/mobile E2E |
| Blog | Published-only index and article route; empty state remains explicit until ALIPROMPT editorial content is published | production build route manifest | Publication admin flow, metadata/structured data, E2E and responsive screenshots |
| Checkout and entitlement | Product-to-prompt foreign-key relationship; server-resolved price; pending order; entitlement created only in a signed, idempotent server webhook transaction | `tests/payment.test.ts` executes valid/invalid/Production-rejected signatures; `tests/foundation.test.mjs` checks server price, HMAC and grant boundary | Real approved payment-provider adapter, webhook replay/mismatch database integration tests, Preview checkout and refund/revocation workflow |
| Report handling | Admin-only open-report queue with resolve/dismiss transition and audit event | `tests/foundation.test.mjs`: role/state/audit contracts | Report-to-moderation E2E, notification policy, independent QA |
| Infrastructure baseline | Native Next + PostgreSQL + Vercel Blob adapters, safe readiness endpoint and Preview/Production resource-isolation checks | `npm test` (21 tests), `npm run lint`, `next build` | Provisioned Preview with isolated resources, migration apply, real database/Blob smoke and independent QA |
