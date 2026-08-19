# ALIPROMPT Marketplace — Requirement and Evidence Matrix

**Purpose:** no sprint may claim completion on intent alone. Every requirement below needs the named evidence in the current worktree or Preview environment.

## Product requirements

| Requirement | Planned implementation | Acceptance evidence | Sprint |
| --- | --- | --- | --- |
| Native Next.js on Vercel | Next App Router build with Vercel-compatible route handlers | `next build`, Preview deployment URL, health route, no Cloudflare runtime import in serving paths | S1/S7 |
| PostgreSQL | Versioned SQL/Drizzle migrations and server-only connection | Migration applied to Preview database; schema invariant tests; no SQLite/D1 production path | S1/S7 |
| Vercel Blob | Signed/staged upload pipeline and object lifecycle rows | Upload validation tests, Blob staging-to-public workflow, orphan cleanup test | S1/S4/S7 |
| Accounts | Auth provider adapter, session cookies, account settings | Registration/sign-in/sign-out/recovery test; session and CSRF checks | S1/S3 |
| Catalog and search | Original content taxonomy, full-text index, filter/sort/pagination | Query, filter, URL state, no-result, encoding, and injection test coverage | S2 |
| Free and paid prompts | Separate public prompt and ALIPROMPT-owned product models | Visitor/member/entitled access matrix tests | S2/S5 |
| Favorites and Library | User-scoped favorites and entitlements in private library | Cross-account access denial test; duplicate favorite/idempotency test | S3 |
| Contributor profile and leaderboard | Public, minimized profile fields and auditable scoring snapshot | Privacy review; ranking tie and abuse tests; no public email output | S3 |
| Community free submissions | Authenticated submission, rights attestation, staged media, review state machine | State transition, rate limit, invalid-file, and rejection/appeal tests | S4 |
| Admin | Least-privilege role checks, moderation, reports, order/grant audit views | Every mutating action has authorization and audit-event test | S4/S5 |
| Safe payment | Provider adapter, signed webhook, order state machine | Signature, replay, amount/currency/product mismatch, duplicate event and canceled-payment tests | S5 |
| Entitlement | Server-generated, revocable/auditable access grant | Grant only after verified event or documented admin grant; browser spoof test fails | S5 |
| Blog | Original articles, editorial state, canonical metadata and feeds | Draft/schedule/publish test; sitemap/RSS/schema validation | S6 |
| SEO | Canonical URL policy, metadata, robots, sitemap, JSON-LD | Crawl/metadata snapshot and duplicate-content tests | S6 |
| Accessibility | Semantic pages, keyboard interaction, focus order, contrast, error announcements | Automated axe checks plus manual keyboard/mobile screen-reader smoke evidence | S6/S7 |
| Performance | Image policy, caching, server/client split, route budgets | Preview Web Vitals/Lighthouse budget and bundle analysis | S6/S7 |
| Operations | Monitoring, error handling, backups, incident and rollback procedures | Preview smoke record, restore rehearsal, release record, rollback rehearsal | S6/S7 |
| No Production deploy without approval | Deployment controls and release checklist | Explicit owner approval recorded before any Production action; otherwise Preview only | Every sprint |

## Trust boundaries and security controls

| Boundary | Threat | Mandatory control | Evidence |
| --- | --- | --- | --- |
| Browser -> server | Forged price/product/success response | Ignore client price and payment status; server resolves product and grants only from verified event | Route and integration tests |
| Payment provider -> webhook | Forged or replayed event | Raw-body signature verification, timestamp policy, provider event id uniqueness, transactional idempotency | Webhook fixtures/tests |
| Browser -> upload | Oversized, disguised, or unauthorized file | Auth, CSRF/origin check, quota, content-type and byte sniffing, image re-encode, private staging key | Upload negative tests |
| Public prompt -> reader | XSS, unsafe links, secret leakage | Markdown allowlist/sanitization, safe external-link policy, pre-publish secret scan, report path | Rendering and sanitizer tests |
| Member -> private data | IDOR and data overexposure | Server-side subject/role checks, minimal selection, privacy-safe leaderboard/profile | Cross-user tests |
| Admin -> system | Accidental/undocumented privilege action | Least privilege, re-auth for sensitive actions, immutable audit log, optional approval gate | Admin authorization/audit tests |
| Search -> database | Injection, costly queries, enumeration | Parameterized query, bounded query length/results, rate limit, indexed search | Adversarial query and query-plan checks |
| Preview -> Production | Data leak or unintended live mutation | Separate environment credentials, preview Blob prefix/database, no production webhook URL in preview | Environment validation test |

## Release evidence record template

For every preview candidate, record:

* Git SHA and migration IDs.
* Preview URL, date/time, operator, and environment classification.
* Passed commands, route smoke results, accessibility/performance results, and known exceptions.
* Applied database backup/restore rehearsal result.
* Current known-good deployment and the exact redeploy/forward-fix path.
* Owner approval reference for Production; absent approval means **Preview only**.
