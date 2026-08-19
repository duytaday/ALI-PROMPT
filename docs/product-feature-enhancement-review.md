# ALIPROMPT — Product feature & enhancement review

**Audit date:** 2026-08-19  
**Scope:** current working tree; no production deployment; no external service or model API was added.

## 1. Executive summary

ALIPROMPT already has a credible **marketplace foundation**, not merely a visual mock: server-side catalog queries, sessions, favorites, submissions with moderation, protected paid prompt rendering, an order/entitlement ledger, admin mutations with audit events, and health/readiness contracts exist in the codebase. The marketplace is nevertheless **not launch-ready**. The local environment has no PostgreSQL or Blob configuration, so only the home catalog preview can run with sample data. Data-backed public pages display the recovery UI rather than real content, and Preview has not been configured or exercised.

The immediate product risk is not missing more cards or animations. It is claiming discovery, bilingual coverage, payment, or operations as complete without a live Preview proof. The immediate engineering risk is lack of deployment credentials, no real payment provider, missing upload magic-byte inspection, incomplete i18n across routes, and no mobile E2E matrix.

Three bounded slices were implemented after the audit: local-preview search recovery, shared accessibility corrections, and production dependency remediation. They do not change database queries, authorization, payments, entitlements, or paid-content protection.

## 2. Audit method and evidence rules

- Preserved the existing dirty working tree; no reset, migration execution, external integration, or deploy was performed.
- Inspected route files, server handlers, schema, shared libraries, tests, runtime configuration and local browser behavior.
- Ran the local app and checked `/vi`, `/en`, `/api/health`, `/api/readiness`, catalog no-result and sort-only flows.
- A schema, route, UI, or test is not marked **Complete** unless the evidence covers its business behavior. Without configured PostgreSQL/Blob, data-backed runtime verification is marked **Blocked** even where code is present.
- Reference comparison was limited to public behavioral patterns visible on [Prompt VN’s public homepage](https://promptvn.com/): catalog discovery, public sharing, ranking, account entry, theme, prompt actions and reporting. No source code, content, taxonomy, images, or assets were copied.

### Local runtime evidence

| Check | Observed result | Meaning |
| --- | --- | --- |
| `GET /vi`, `GET /en` | 200; language shell and catalog preview render | The locale proxy and local-preview catalog can be inspected without a database. |
| `/en?q=zzzz-unmatched` | English no-result copy and recovery link; no horizontal overflow | Search empty recovery works in preview. |
| `/en?order=popular` | Discovery results are shown | Sort-only URL state is no longer ignored. |
| `GET /api/health` | 200 `{ status: "ok" }` | Liveness is intentionally independent of dependencies. |
| `GET /api/readiness` | 503; missing `POSTGRES_URL`, Blob token and environment tags | Correct fail-closed state; deployment is not ready. |
| `/vi/blog` with no DB | Shared recovery UI | Data-backed routes cannot be accepted as functionally verified locally. |

## 3. Capability inventory

**Status legend:** Complete = code and behavior evidenced; Partial = material path exists but a release-critical gap remains; UI only = visible surface lacks a server-backed completion path; Schema only = data/invariant exists without a usable flow; Mock only = development sample; Missing = absent; Blocked = code exists but cannot be run in this environment.

| Capability | Status | Evidence | Audit assessment |
| --- | --- | --- | --- |
| Home/catalog | Partial | `app/page.tsx`, `lib/catalog.ts` | Server catalog is real; no-DB local view is explicitly sample data. |
| Search/filter/sort/pagination | Partial | `CatalogSearch.tsx`, `Pagination.tsx`, `lib/catalog.ts` | Query normalization, escaped `ILIKE`, 120-char query cap and 48-item bounds exist. No fuzzy/suggestion/index strategy. |
| Topic pages | Partial / Blocked | `app/topics/[slug]/page.tsx`, `getActiveCategories` | Real category lookup; not runtime-verified without DB; page still has Vietnamese literals. |
| Prompt detail | Partial / Blocked | `app/prompts/[slug]/page.tsx`, `getPublicPrompt` | Entitlement guard controls full paid body server-side. No variable builder/versioning/compatibility metadata. |
| Contributor profile | Partial / Blocked | `app/contributors/[id]/page.tsx`, `getPublicContributor` | Basic public identity and catalog list only. |
| Authentication | Partial / Blocked | `app/api/auth/*`, `lib/auth.ts`, `authRateLimits` | Password hashing, opaque session hash, secure cookie attributes and DB rate limits exist; live email/database path is untested. |
| Account recovery | Partial / Blocked | `forgot-password`, `reset-password`, `lib/password-reset.ts`, `lib/email.ts` | Non-enumerating flow and one-time hashed tokens exist; email provider is not configured/tested. |
| Favorites | Partial / Blocked | `FavoriteButton.tsx`, `api/favorites/[promptId]` | Authenticated POST/DELETE and unique user/prompt invariant exist; needs cross-account E2E. |
| Private library | Partial / Blocked | `app/library/page.tsx` | Joins saved prompts and non-revoked entitlements; no collections, recently viewed, export or deletion flow. |
| Community submission | Partial / Blocked | `SubmitPromptForm.tsx`, `api/submissions`, `prompts` schema | Authenticated, rate-limited, rights-attested, pending/free submissions exist; no draft/autosave/status timeline. |
| Media staging | Partial | `lib/blob.ts`, `promptMedia` | Private staging and server stream exist; MIME/size checks but no magic-byte inspection. |
| Moderation | Partial / Blocked | `admin/submissions`, `api/admin/submissions/[id]`, `auditEvents` | Approve/reject with reason and audit exists; only no-DB code evidence. |
| Reports/reactions | Partial / Blocked | `PromptCommunityControls.tsx`, `api/prompts/*` | Auth, origin checks and rate limit paths exist; no abuse triage metrics or E2E. |
| Leaderboard | Partial / Blocked | `app/leaderboard/page.tsx`, `lib/leaderboard.ts` | Privacy-safe display intent is present; needs live ranking validation and anti-gaming policy. |
| Blog/articles | Partial / Blocked | `app/blog/*`, `lib/blog.ts`, `admin/articles` | Publication states and admin publication checks exist; no sitemap/RSS/structured article data. |
| Checkout initiation | Partial / Blocked | `checkout/[productSlug]`, `api/checkout/[productSlug]` | Server resolves price/product; client cannot grant access. Only test HMAC provider exists. |
| Payment webhook | Partial | `api/payments/webhook`, `lib/payment.ts`, `paymentEvents` | Signature, amount/currency/state matching, idempotent provider event and transaction are implemented; no real production provider. |
| Entitlements | Partial / Blocked | `entitlements`, `hasActiveEntitlement`, admin grant/revoke | Server-side rendering blocks paid body when no entitlement; needs cross-account and real payment E2E. |
| Admin | Partial / Blocked | `app/admin/*`, `api/admin/*`, `requireAdminUser` | Role gate, CRUD-ish operations, report/submission queues and audit events exist; no user/role management or audit viewer. |
| Analytics | Missing | no events/analytics route or approved provider | No funnel evidence can be collected yet; do not add tracking until the event/privacy contract is approved. |
| SEO | Partial | `app/layout.tsx`, `proxy.ts` | Root canonical/hreflang/OG metadata exist; no `robots.ts`, sitemap, JSON-LD, RSS, per-route metadata or search indexation policy. |
| i18n | Partial | `lib/i18n.ts`, `messages/*`, `proxy.ts` | Locale routing, shared shell and catalog states translate; most public/account/admin routes and owned content fields remain Vietnamese. |
| Light/Dark/System | Complete for shared shell | `ThemeToggle.tsx`, `app/layout.tsx`, `globals.css` | Persisted pre-paint preference and system follow behavior are implemented; all legacy screens still need visual sweep. |
| Responsive/accessibility | Partial | `MarketplaceNavigation.tsx`, `FavoriteButton.tsx`, `PromptRail.tsx`, `globals.css` | Drawer, focus trap, reduced motion, feedback and desktop overflow checks exist; no 360/390/430/768 real browser matrix. |
| Performance | Partial | server components, bounded catalog, image lazy loading | No bundle/field baseline, image dimensions, cache/revalidation plan, DB index evidence, or slow-network test. |
| Vercel operations | Blocked | `runtime-env.ts`, `readiness.ts`, `vercel-deployment.md` | Isolation contract exists; no linked project, Preview environment values, migration rehearsal or readiness success. |
| AI agents | Schema/contract only | `ai/`, `ai/evals/validate-contracts.mjs` | 5 agent contracts, 6 skills and 18 fixtures validate; no model runtime, provider, safe logs or live evaluation harness. |
| Phase 2/3 funnel | UI only / orphaned | `app/_components/AliPromptExperience.tsx`, `api/leads` | Workshop/waitlist lead UI and persistence code exist, but the component is not imported by the live marketplace route. |

## 4. UX and feature gaps

1. **Discovery lacks recovery beyond exact matching.** The catalog has bounded substring search and categories, but no suggestion, typo tolerance, highlight, related prompts, filters for access/language/difficulty/model, or ranking policy.
2. **Prompt usage is a copy surface, not yet a work surface.** Full prompt copy and report/reaction exist, while variables, guided setup, output formats, compatibility, version history and usage guidance do not.
3. **Retention has only favorites plus owned items.** There are no collections, recent views, resume context, saved filters, consented notifications, export or deletion.
4. **Contributor flow ends at pending submission.** The product lacks draft recovery, preview, status timeline, change requests and reusable moderation feedback.
5. **Commerce protects access better than it sells.** The server model is safe by design, but pricing/bundle presentation, receipts, real provider, refund policy and order support are not implemented.
6. **The locale route exists before the content model.** This is intentionally transparent on the catalog, but not adequate for an English launch until owned content and system states have bilingual fields/copy.
7. **The intended business funnel is disconnected.** `AliPromptExperience.tsx` contains a workshop/Phase-3 waitlist experience and `api/leads` persists consented leads, but nothing renders that component from the live catalog. Copying a prompt therefore has no evidence-backed bridge to the paid workshop.
8. **Local preview cards are navigation-only mock data.** Their detail URLs query PostgreSQL and can resolve to the not-found state without a development database. Do not treat sample-card click behavior as a complete prompt-detail flow.

## 5. Technical and security blockers

| Priority | Blocker | Evidence | Required gate |
| --- | --- | --- | --- |
| P0 | Preview/runtime has no isolated PostgreSQL and Blob resources | `/api/readiness` 503; `docs/vercel-deployment.md` | Configure Preview-only values, rehearse migrations, then receive 200 readiness. |
| P0 | No full Vercel Preview test evidence | no project link/Preview URL; desktop local only | Run public, auth, paid boundary, mobile and accessibility matrix on Preview. |
| P1 | Upload validation trusts declared MIME plus Blob head metadata | `lib/blob.ts` checks `file.type`/content type, not bytes | Add server-side magic-byte sniffing and hostile-file tests before public uploads. |
| P1 | Email ownership and admin grant boundary are incomplete | registration creates a session before verification; admin grant targets email | Require verified ownership before manual grants; define audited bootstrap/recovery and step-up policy. |
| P1 | Repurchase and product lifecycle edge cases can deny paid access | `processVerifiedPaymentEvent` ignores an existing revoked entitlement; owned lookup requires active product | Define re-grant and archive access semantics; add transactional integration tests before real commerce. |
| P1 | Readiness is configuration-oriented, not full dependency proof | DB probe is `select 1`; Blob check is token presence | Add schema-version/table and Blob access probes; include approved payment/email checks. |
| P1 | i18n is incomplete for user workflows and data | route literals outside catalog; single-language schema fields | Define owned-content translation model and status before English public launch. |
| P1 | Search has no index/ranking evidence | `ILIKE '%query%'` in `lib/catalog.ts`; no search index migration | Benchmark on representative data; add an approved index/search approach only when needed. |
| P1 | No real payment provider | `paymentProviderIsConfigured()` only enables `hmac_test` outside production | Select provider, verify signatures/idempotency/refunds in isolated Preview. |
| P2 | SEO route artifacts missing | no `app/robots.ts` or `app/sitemap.ts` | Establish canonical domain, generate metadata/sitemap and indexation rules. |
| P2 | Monitoring, backups and audit UI absent | no error-monitor/backup integration or audit viewer | Approve operations stack and retention/runbook before public scale. |

## 6. Prioritized backlog

Scores use 1–5: **U** user impact, **B** business impact, **C** confidence, **E** effort. Priority judgment favors high U/B/C and low E, subject to security gates.

| Feature | User problem | Current state | U/B/C/E | Risk | Dependency | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Search URL state + empty recovery | Visitors lose intent or see no useful next step | Partial | 4/4/5/1 | Low | none | **Build now** — implemented for local preview; verify DB path on Preview. |
| Preview query/topic/sort parity | Local review lied about active filters | Mock only | 3/2/5/1 | Low | none | **Build now** — implemented. |
| Upload magic-byte validation | Spoofed media can enter staging | Partial | 3/4/5/2 | Medium | Blob test fixtures | **Build next**. |
| Preview DB/Blob + readiness | No real flows can be proven | Blocked | 5/5/5/3 | High | owner credentials/resources | **Build now** once owner supplies isolated Preview resources. |
| Verified email before grants | Manual grant can target unverified email ownership | Partial | 5/5/5/3 | High | email delivery/identity decision | **Build now** before paid access is enabled. |
| Repair re-grant/product access lifecycle | Valid repurchase or archive may not restore/read entitlement | Partial | 5/5/4/3 | High | commerce policy | **Build next** before a real payment provider. |
| Mobile/browser E2E matrix | Responsive/a11y claims are unproven | Partial | 4/4/5/2 | Medium | Preview | **Build next**. |
| Full owned-content i18n model | English route is incomplete | Partial | 5/4/5/4 | Medium | content owner decisions | **Build next**. |
| Prompt variable builder | Copy still requires manual adaptation | Missing | 5/4/3/3 | Low | prompt variable schema | **Validate first** with 10–15 Marketing/Content prompts. |
| Prompt usage metadata | Users cannot judge fit/time/model | Missing | 4/3/4/2 | Low | editorial rubric | **Build next**. |
| Collections/recently viewed | Favorites do not support ongoing work | Partial | 4/4/3/3 | Medium | privacy/retention decision | **Validate first**. |
| Submission draft/status workflow | Contributors cannot recover or understand moderation | Partial | 3/3/4/3 | Medium | moderation policy | **Build next** after Preview submission E2E. |
| Related/trending shelves | Discovery ends on a single prompt | Missing | 4/4/2/3 | Medium | sufficient catalog/event data | **Validate first**. |
| Fuzzy search/suggestions | Exact search is brittle | Missing | 4/3/2/4 | Medium | data scale/baseline | **Defer**. |
| Real payment provider/refund workflow | Paid conversion cannot be completed safely | Partial | 5/5/3/5 | High | provider, policy, legal/ops owner | **Build next** only after Preview security gate. |
| Bundles/coupons/subscriptions | More monetization options | Missing | 2/3/1/4 | High | validated paid demand | **Defer**. |
| Analytics event pipeline | Funnel choices are currently opinion-led | Missing | 4/4/3/3 | Medium | approved privacy/event contract | **Validate first**. |
| Sitemap/robots/JSON-LD | Search engines lack structured discovery | Missing | 3/4/5/2 | Low | canonical domain/content | **Build next**. |
| Integrate workshop/Phase-3 funnel | Prompt users have no route to the paid learning offer | UI only | 5/5/4/3 | Medium | product owner approves funnel/copy | **Validate first**; do not render legacy UI without confirming the desired information architecture. |
| PWA/offline | Extra surface, unclear value | Missing | 1/1/2/4 | Medium | usage evidence | **Reject** for current version. |
| Direct model chat/RAG/multi-agent runtime | High cost/privacy complexity before value proof | Contract only | 2/2/2/5 | High | approved provider, eval/logging, paid demand | **Reject** for current version. |

## 7. Quick wins and strategic roadmap

### Top 3 quick wins

1. **Finish/verify catalog recovery on real Preview** — database-backed query/topic/sort, pagination, no-result CTA and locale preservation.
2. **Add magic-byte media verification with tests** — closes a public-submission security gap without expanding product scope.
3. **Generate canonical SEO artifacts after the domain decision** — `robots`, sitemap and per-route metadata; do not generate thin landing pages.

### Top 3 strategic features

1. **Bilingual owned-content model** with translation status, editorial workflow and no silent machine translation of community prompts.
2. **Guided prompt usage** (variables, previewed output, copy format and metadata) validated first against the core Marketing/Content audience.
3. **Verified commerce operation** with a real provider, receipt/support/refund policy, provider webhook, idempotency, entitlement and support audit trail.

### Suggested sequence

1. Establish Preview resources and pass readiness.
2. Run real catalog/auth/submission/paid-boundary E2E, then close upload validation and i18n gaps.
3. Instrument only consented, minimal funnel events once a privacy contract is approved.
4. Validate the variable-builder problem with real prompts before building personalization, fuzzy search or PWA.
5. Integrate commerce only after the preceding security and operations gates pass.

## 8. Deliberately deferred or rejected

- **Direct AI/model calls, autonomous agents, RAG, and vector databases:** no approved cost, privacy, provider, safe logging or live-eval evidence.
- **Community paid prompts:** conflicts with the current ALIPROMPT-only seller invariant in `products.sellerKind` and must not be weakened.
- **Fuzzy search:** do not add a search service before measuring failure rate and index pressure on real catalog data.
- **PWA/offline:** not a demonstrated bottleneck for this prompt-marketplace release.
- **Subscriptions/cart/coupons/affiliate:** increase fraud, reconciliation and support surface before basic payment and entitlement operations have been proven.

## 9. Implemented changes from this review

### Discovery slice: preview filter parity and recovery

**Problem:** the development preview rendered the same sample shelves even when the URL contained a query/topic/sort. Additionally, a sort-only URL did not count as active catalog state.

**Implementation:**

- `app/page.tsx` now normalizes search params before selecting the development fallback.
- `applyPreviewCatalogFilters` applies the same bounded normalized query/topic/order contract to preview data.
- `order=popular` and `order=helpful` now enter the results view; an unmatched query shows the typed empty state and reset CTA.
- The UI keeps existing locale, theme, responsive and keyboard behaviors because it reuses `CatalogSearch`, `PromptCard`, shared messages and shell.
- `tests/foundation.test.mjs` asserts the preview filter function and sort-only state are retained.

**Before/after acceptance:** `/en?q=zzzz-unmatched` displays “No matching prompts yet” plus “View the full library”; `/en?order=popular` displays “DISCOVERY RESULTS”. Neither state overflowed the available desktop viewport.

**Guardrails:** this is a development-only preview path. Production still calls `listPublicPrompts` and `countPublicPrompts`; the patch does not expose paid body, change entitlement rules, mutate data or introduce external tracking.

### Accessibility slice: shared shell corrections

**Problem:** dark-mode text had hard-coded low-contrast colors and the mobile drawer could clip lower actions on a short viewport. The blog article route also lacked a `main` landmark.

**Implementation:**

- Shared marketplace text/link metadata now resolves through semantic theme tokens, including dark mode.
- The drawer is a labelled `role="dialog"` with `aria-modal="true"`, retains its existing focus trap/Escape return, and now uses `100dvh` plus vertical scrolling/overscroll containment.
- A localized skip link targets the main content wrapper; blog detail now has a `main` landmark.
- Regression assertions cover the dialog contract, skip link, and scroll-safe drawer CSS.

**Guardrails:** no authentication/session logic, data query, content body, entitlement, or server mutation was changed. A real 360/390/430 viewport and screen-reader sweep remains a Preview gate.

### Release-integrity slice: production dependency remediation

`npm audit --omit=dev` initially found four High production vulnerabilities through `next@16.2.6` and transitive packages. `npm audit fix --omit=dev` upgraded the compatible dependency graph, including Next.js to **16.3.1**. The final production audit reports **0 vulnerabilities**. Development-only audit findings remain outside this production result and should be handled deliberately, not with `--force`.

## 10. Test evidence

| Test | Result |
| --- | --- |
| `npm run lint` | Pass after the discovery slice. |
| `npx tsc --noEmit` | Pass after the discovery slice. |
| `npm run build` | Pass; all current App Router routes compile. |
| `npm audit --omit=dev` | Pass after dependency remediation: 0 production vulnerabilities. |
| `node --test tests/foundation.test.mjs` | 28/28 pass after the discovery slice. |
| Previous full `npm test` | Pass: AI contract validation, Drizzle check, build, 33 foundation/runtime tests and payment fixture test. |
| Browser local catalog smoke | `/vi` and `/en` render; no horizontal overflow. |
| Browser local search smoke | no-result and sort-only states render correctly; fresh final browser verification remains required for every viewport. |

The following requested evidence is **not yet available**: authenticated cross-account test, live DB query test, paid-content leakage test against a real entitlement, full Playwright desktop/tablet/mobile sweep, keyboard-only full flow, reduced-motion visual sweep, and Preview readiness success.

## 11. Vercel Preview readiness

**Not ready to deploy Preview yet.** The code compiles and the runtime checks intentionally fail closed, but a safe Preview requires owner-provided isolated PostgreSQL and Blob resources with matching environment tags, a linked Vercel project, migration rehearsal, and post-deploy `/api/readiness` success. Production has not been deployed and must remain owner-approved after Preview sign-off.

## 12. Known gaps and final answers

- **What exists now?** A native Next.js marketplace foundation with catalog, account/session, favorites, library, moderated free submissions, reports/reactions, admin views, guarded paid prompt rendering, order/entitlement ledger, a test payment adapter, shared theme and partial VI/EN infrastructure.
- **What is simulated or incomplete?** Local catalog data is mock-only; AI agents are contracts only; payment is a test HMAC adapter; real database/blob/email/Preview behavior is blocked; most route copy and dynamic content lack English coverage.
- **What has been optimized?** Catalog input/pagination bounds, query wildcard escaping, server-side paid-content gating, shared responsive theme/navigation, the preview URL-state regression, dark-theme token usage and short-viewport drawer reachability.
- **What was added in this review?** Development-preview query/topic/sort application and recovery; shared modal-drawer/skip-link/main-landmark corrections; dependency remediation to Next 16.3.1 with a clean production audit.
- **What should happen next?** Provision isolated Preview resources, pass readiness and real E2E; then close verified-email/grant, re-grant/product-lifecycle, media magic-byte and i18n data/workflow gaps before expanding discovery or commerce. Confirm whether the existing workshop/Phase-3 funnel should be reintroduced into the marketplace information architecture before rendering it.
- **Any regression?** One pre-existing local limitation was confirmed: data-backed pages show the error recovery view without `POSTGRES_URL`; the new catalog slice itself passes lint, type, build, tests and browser smoke.
- **Can it deploy Vercel Preview?** Not yet, because Preview environment isolation and database/Blob readiness are absent—not because of a failed build.
