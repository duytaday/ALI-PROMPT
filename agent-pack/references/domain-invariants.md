# ALIPROMPT Domain Invariants

`version: 1.2.0`  
`mode: single_vendor_commerce_plus_moderated_community`

## Product authority

- V1 has exactly one configured commercial seller: the ALIPROMPT owner.
- Owner-authored prompts may be free or paid. Member contributions must remain free; the owner ALIPROMPT alone sets prices, sells, receives revenue, refunds orders, and administers commercial entitlements.
- `contributor_id`, author credit, or public handle never implies `seller_id`, ownership, role, or permission.
- Contributor roles have no price, publish, payment, refund, payout, entitlement-administration, or other-resource mutation authority.
- A contribution reaches `published` only through an authorized approval/publication workflow. Approval may be a separate audited internal step but is not a contributor-visible submission state. No seller onboarding, commission, revenue share, tax split, or payout ledger exists in V1. Multi-vendor is a new product/security/legal decision, never an inferred extension.

## Bounded contexts

- Identity: user, guest claim/session, role, session, password recovery, ownership.
- Catalog: prompt, version, category, tag, asset, preview/protected body, price, license, publication.
- Contribution: submission, contributor profile/handle, consent, anti-spam, moderation, attribution.
- Commerce: order/item snapshot, payment attempt/event, refund, reconciliation.
- Access: entitlement, favorites/library, secure reveal/copy.
- Trust: vote, view, report, review, moderation case, audit.
- Discovery: search document, ranking event, collections, leaderboard, SEO.
- Editorial: blog draft, preview, publication and sitemap state.

Do not collapse these contexts into one prompt table or route handler.

## Minimum entities

`User`, `Session`, `PasswordResetToken`, `PublicContributorProfile`, `GuestClaim`, `PromptProduct`, `PromptVersion`, `ContributionSubmission`, `UploadIntent`, `Asset`, `Category`, `Tag`, `ProductTag`, `Price`, `License`, `Favorite`, `Vote`, `ViewEvent`, `Report`, `ModerationCase`, `Order`, `OrderItem`, `PaymentAttempt`, `PaymentEvent`, `Entitlement`, `CopyEvent`, `Review`, `Refund`, `BlogPost`, `AuditEvent`, `ScheduledJobRun`.

Migrations remain slice-scoped. IDs and states must preserve the locked authority boundary.

## Submission field limits (V1 defaults)

Keep these values in one versioned server configuration and expose the same values to client validation. Count Unicode code points after normalization; server result is authoritative.

| Field | Rule |
| --- | --- |
| Member handle | canonical unique handle, 3–32 characters, allowlisted letters/numbers/`_`/`-`; reserved/confusable/impersonating names rejected |
| Guest public author | 2–50 characters after trim/normalization; moderation-approved pseudonym, never treated as verified identity |
| Category | exactly one active category ID from server allowlist |
| Title | 8–160 characters; plain text only after normalization |
| Free prompt body | 20–20,000 characters; required; stored outside list/search DTOs |
| Images | 0–4 raster images; each at most 3 MiB; total at most 12 MiB; JPEG/PNG/WebP only; decoded dimensions at most 4096×4096 |

Reject excessive field count, request bytes, nesting, invalid Unicode, null bytes, and content-type mismatch before expensive work. Limits may change only through a versioned decision plus boundary tests and UI copy update.

## Upload processing

- Follow `agent-pack/references/vercel-deployment-contract.md`: raw uploads use a private Vercel Blob quarantine store and only sanitized derivatives use a distinct public store.
- Validate count, declared type, extension, magic bytes, byte size, decoded dimensions, frame count, and decode cost.
- Decode and re-encode server-side; normalize orientation; strip EXIF/ICC/GPS/unneeded metadata; generate bounded responsive variants and thumbnail; preserve no original unless policy requires it.
- Reject malformed/truncated/polyglot/decompression-bomb files and unsupported animated/active formats. Do not accept SVG/HTML/script as prompt imagery.
- Use random object keys; keep metadata/owner/submission relation in DB and bytes in object storage; quarantine until scan/processing succeeds.
- Serve inert image media with correct content type, CSP and nosniff; do not serve user active content as trusted same-origin.
- Remove orphan/quarantined objects by audited retention job, never by unbounded delete.
- A direct-upload intent is short-lived, single-purpose, bound to authenticated member + owned draft + count/bytes/type, and consumed idempotently. A Blob URL or object key supplied by a client is never ownership proof.
- Prefer secure direct client-to-quarantine upload for scalability and trust-zone isolation. An explicitly supported Function fallback may accept one valid 3 MiB image, but must reject any request at or above the documented 4.5 MB Function request/response ceiling before parsing or buffering and must still enforce the 12 MiB aggregate through per-object upload intents.

## Contribution and anti-spam

- The launch-default flow requires an authenticated member: create owned `draft`, attach completed owned quarantine uploads, then submit to `pending_moderation`; public publication is impossible from draft/upload/submission endpoints.
- Guest submission, if retained for clean-room reference parity, is a separate disabled-by-default feature flag with explicit abuse/privacy approval. It cannot weaken member ownership checks or seller isolation.
- Apply per-IP, per-account/guest-session and content-fingerprint rate limits, request-size limit, CSRF for cookie auth, signed nonce, honeypot, minimum-time signal, duplicate detection, and risk-based optional challenge.
- A challenge is defense-in-depth, never the only control; do not use a predictable arithmetic question.
- Normalize before fingerprinting but retain original safe text for human review. Do not let an LLM auto-publish, auto-reject permanently, ban, price, refund, or identify a person.
- Guest receipt/status tokens are high entropy, scoped, expiring where appropriate, hashed at rest, not present in public URLs/logs/leaderboards.
- Guest public handle can appear only with explicit consent and moderation. It is labeled unverified where relevant; collision/impersonation reports have a resolution path.
- Draft/rejected/changes-requested submissions never enter public discovery, contributor pages, rank counts, sitemap, or structured data.

## Catalog and prompt protection

- `preview_text`/`preview_asset` is independent from `protected_body`; never derive a paid preview on the client.
- Public DTOs use allowlists and queries do not select paid `protected_body`.
- Full free body is returned only for a published free prompt according to policy. Full paid body requires authenticated identity plus active entitlement for exact product/version.
- Do not serialize DB entities wholesale or put protected content in HTML/RSC, bundle, metadata, JSON-LD, search, analytics, log, error, source map, shared cache, or notification.
- Protected responses default `Cache-Control: private, no-store`; cache keys must preserve identity/entitlement if caching is ever approved.
- Absolute DRM after legitimate reveal is impossible; use license, audit, rate limit, abuse response and support without promising perfect copy prevention.

## Identity and password recovery

- Register/login/forgot responses do not disclose whether an account exists. Passwords use an approved memory-hard/password hashing policy; sessions rotate at login/privilege change/reset.
- Forgot/reset is rate-limited. Reset tokens are random, hashed at rest, short-lived, single-use and invalidated transactionally; successful reset revokes relevant sessions.
- Logout revokes the current session server-side. Cookie sessions require Secure/HttpOnly/SameSite and CSRF protection for unsafe methods.
- Authentication proves identity, not authorization. Guest claim material never upgrades to member/seller privilege without explicit verified flow.

## Authorization matrix

| Action | Guest | Member/contributor | Buyer | Owner/admin | Moderator |
| --- | --- | --- | --- | --- | --- |
| Browse published/free body | allow by policy | allow | allow | allow | allow |
| Read paid body | deny | deny unless also entitled buyer | active entitlement + ownership | allow + audit | deny; break-glass only by explicit policy |
| Submit free prompt | deny by default; tightly rate-limited only under approved guest feature flag | rate-limited, authenticated own draft | rate-limited, authenticated own draft | allow | allow |
| Edit own pending submission | deny by default; possession + state only under approved guest feature flag | own resource/state only | own resource/state only | allow + audit | policy-limited |
| Publish/price/version | deny | deny | deny | allow + audit | publish/price deny; suspend only if scoped |
| Favorite/vote | login gate | own identity | own identity | own identity | own identity |
| Report | tightly rate-limited | rate-limited | rate-limited | allow | allow |
| Order/refund | deny | own order only if buyer | own order/request only | provider/policy-gated + audit | deny |
| Resolve moderation | deny | deny | deny | allow | allow within scope |
| Publish blog | deny | deny | deny | allow + audit | deny unless explicit editorial role |
| View PII/payment internals | deny | own minimum | own minimum | least privilege + audit | deny by default |

Every mutation checks role, resource ownership, current state, intended transition, and tenant/seller boundary server-side.

## State transitions

### Product

- `draft → in_review`: required fields, safe preview, attribution, license and owner present.
- `in_review → published`: authorized human approval and validation.
- `published → suspended`: reason + policy + audit; `suspended → published` requires re-review.
- any non-deleted state → `archived`: no new sale; existing access follows license policy.
- A community-backed product must be free and linked to an approved submission; price creation is rejected.

### Contribution

- Exactly five contributor-visible states exist: `draft`, `pending_moderation`, `changes_requested`, `rejected`, and `published`.
- `draft → pending_moderation`: authenticated owner submits a valid draft whose completed quarantine assets belong to the same member and draft.
- `pending_moderation → changes_requested|rejected|published`: authorized moderation records reason/audit; only the authorized approval/publication workflow may enter `published` and create/update the free product exactly once.
- `changes_requested → draft`: the owner explicitly reopens the item for edits; resubmission returns it to `pending_moderation`.
- Upload received, scan, validation, transform, review assignment, review outcome and approval are internal processing/audit events, not additional top-level submission states. If approval succeeds but publication fails, compensate and keep the visible state `pending_moderation` until the idempotent workflow completes.
- Rejected content cannot become public through a stale request. Archive/suspend belongs to the published prompt/product lifecycle, not the submission state machine.

## Vercel platform invariants

- The production target is supported native Next.js on Vercel, not `vinext`/Vite/Cloudflare Workers/Sites. Existing runtime/configuration is preserved as migration evidence and rollback material until a verified cutover closes.
- PostgreSQL comes from a current Vercel Marketplace integration; never target the discontinued Vercel Postgres product. Drizzle migrations require an explicit D1/SQLite-to-PostgreSQL compatibility and data-backfill plan.
- Development, Preview, and Production use isolated databases/schemas, Blob stores, secrets, callback URLs, payment modes, and telemetry. Preview cannot read/write Production or accept Production webhooks.
- Environment variables are typed, fail fast, never logged, and scoped per environment. A variable change belongs to a newly created deployment, not existing deployments.
- Production migrations do not run implicitly during application build. One owner runs an approved, backed-up, lock-aware, resumable migration and verifies data counts/hashes/invariants before alias/domain cutover.
- Payment webhook Route Handlers verify provider signature on raw bytes, record unique events, acknowledge within limits, and use durable idempotent fulfillment/reconciliation.
- Cron endpoints authenticate, use durable lease/idempotency and bounded batches, tolerate duplicate/overlapping delivery, and define explicit retry/alerting because a failed invocation cannot be assumed to retry.
- Release is branch/commit-addressed: isolated Preview evidence precedes Production; production deploy, migration, provider activation, and domain/alias change each require explicit authority and a tested rollback.

### Order and entitlement

- `pending → paid` only from verified provider truth or authoritative reconciliation.
- `paid → fulfilled` when entitlement is created exactly once; `pending → failed` on provider/expiry outcome.
- `paid|fulfilled → refunded|disputed` follows verified provider/admin policy and triggers defined entitlement behavior.
- `inactive → active` for a valid free grant or fulfilled paid order; `active → revoked|expired` requires reason/audit. Revoked/expired denies protected body.

### Blog

- `draft → in_review → published`; `published → unpublished|archived`; republish requires validation.
- Draft/preview routes are authorized, non-public and noindex. Only published posts enter list, feed, sitemap or structured data.

## Money and payment

- Store non-negative integer `amount_minor` and explicit currency. Order item snapshots product/version/license/price.
- Server reads active catalog price and recalculates total. Never trust client/AI/query/metadata amount, discount, identity, role or entitlement.
- Verify signature on raw provider payload before business parsing. Unique provider/event ID enforces idempotency; duplicate returns safe success; out-of-order cannot regress state; replay/stale timestamp policy is tested.
- Fulfillment is transactional or compensating and retry-safe. Reconciliation detects provider/order/entitlement mismatch.
- Refund/dispute policy specifies full/partial outcomes, version access and entitlement action.

## Search, actions and leaderboard

- Search indexes public published fields only. `q`, category and author filters are normalized/validated; ranking is deterministic with explicit tie-breakers.
- View events deduplicate in an abuse window and exclude known bots/self-inflation where feasible. Favorite/vote uniqueness is per identity+prompt; up/down are mutually exclusive and changes are atomic/idempotent.
- Copy/share analytics never include prompt body or recipient data. Reports have rate limit, dedupe and non-enumerating receipts.
- Leaderboard accepts only `contributions|views|likes`; clamp result limit to 1–50. Primary selected valid metric desc; then approved-published contribution count desc, valid likes desc, valid views desc, normalized public handle asc, stable opaque public profile ID asc.
- Only moderation-approved, opted-in public profiles count. Guest pseudonyms may appear if consented/approved and are marked unverified; never expose email, contact, internal user ID, IP, auth/provider/payment ID or claim secret.
- Review eligibility is deterministic (recommended fulfilled order or explicit free grant) with uniqueness and anti-abuse. AI may suggest labels, never execute destructive trust decisions.

## UI, SEO, privacy and observability

- Quick-view modal traps/restores focus, closes by Escape and has a non-modal canonical detail route. Floating controls have labels, touch target, non-overlap and reduced-motion behavior.
- Every async surface has loading, empty, validation, error and retry states; responsive layouts preserve content at zoom and keyboard/screen-reader use.
- Structured data never claims rating, price, author or availability not proven by DB. Search-empty/filter URLs follow deliberate canonical/noindex policy.
- Public DTO contains public handle/display fields only. Collect and retain minimum contact/payment data for a defined purpose.
- Audit privileged actions with actor, action, resource, request ID, timestamp, result and redacted reason.
- Logs never contain password, reset/claim token, OTP/API key, full prompt body, raw payment secret/payload, signed URL secret, email where unnecessary, or image metadata. Metrics cover funnels/failures without sensitive dimensions.

## Required negative/boundary tests

- anonymous/wrong-user paid reveal; IDOR across submission, profile, favorite, library, order, report, blog preview and admin;
- paid-body leakage via public query, quick view, SSR/RSC, search, metadata, log/error/cache;
- contributor attempts price/publish/payment/refund/payout or cross-resource edit;
- submission title/body/author/category boundaries, invalid Unicode/request size and all image count/byte/dimension/type/bomb cases;
- spam flood, duplicate content, CSRF, XSS, unsafe upload, stale moderation/publish request;
- register/account enumeration, session fixation, expired/reused reset token and logout revocation;
- client price tampering, stale price, duplicate/out-of-order/replayed webhook, checkout retry, reconciliation, refund/revoke;
- self/repeated/bot view/vote/report/review/rank abuse and leaderboard limit/sort/tie/privacy;
- draft/suspended/rejected/unpublished content in discovery, contributor page, blog list, sitemap or structured data;
- public response containing email, payment/internal IDs, IP, claim/reset token or unnecessary PII.
- member uploads a Blob owned by another member/draft, reuses/forges an upload intent, references an arbitrary Blob URL, races submit with upload processing, or attempts to publish/price a community prompt;
- Preview reads/writes Production data, accepts a live webhook, exposes a Production secret, or sends a live charge/email; environment changes assumed active without a new deployment;
- SQLite/PostgreSQL type/default/index/transaction drift, partial/resumed backfill, duplicate migration runner, database connection exhaustion, cross-region timeout, failed verification and rollback;
- webhook Function timeout after event persistence, duplicate/overlapping Cron runs, missing Cron authentication, orphan cleanup escaping its bounded prefix, and raw quarantine asset becoming public.
