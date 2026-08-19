# ALIPROMPT Marketplace — S0 Clean-room Specification

**Status:** implementation brief; Phase 1 baseline discovery in progress  
**Observed source date:** 2026-08-17  
**Reference:** public, user-visible behavior at `https://promptvn.com/` only. No source, private endpoint, content, image, taxonomy, or visual implementation was copied.

## 1. Outcome and non-negotiable rules

ALIPROMPT will be an original prompt marketplace and learning platform, delivered as a native Next.js application on Vercel with PostgreSQL and Vercel Blob.

1. Functional parity means that users can accomplish comparable public jobs: discover, search, view, use, save, submit, learn, purchase, and administer prompt products. It does **not** mean visual, textual, data, or implementation parity.
2. ALIPROMPT is the sole seller of every paid item. Contributors may submit free community prompts; they do not set a price, receive a payout, or become a merchant.
3. Imported catalog entries, author identities, images, prompt bodies, category names/descriptions, blog copy, CSS, HTML, assets, and source from the reference are forbidden.
4. Access to paid content is granted only by an idempotent, verified payment event on the server. A success redirect, client flag, or price supplied by a browser can never create entitlement.
5. Production deploy, domain cutover, and live payment activation require explicit owner approval. Preview deploys are required before acceptance.

## 2. Clean-room public capability inventory

This is an abstract product-capability inventory, not a UI or content specification.

| Public job observed | ALIPROMPT original implementation commitment |
| --- | --- |
| Find prompts by words and a category | Full-text search with original ALIPROMPT topic taxonomy, filters, pagination, empty state, and URL-shareable query state. |
| Browse ranked and recent prompt collections | Curated shelves: useful now, newly published, and community momentum; ranking formulas documented and abuse-resistant. |
| Inspect/use a prompt and copy it | Detail page with preview, variable guide, safe-copy action, usage disclosure, and a server-side event. |
| Create an account and save favorites | Account, favorites, private Library, secure session lifecycle, and export/delete request path. |
| View a contributor’s work and contribution standing | Public contributor profile and leaderboard with a published scoring policy; only public profile data is exposed. |
| Submit a free prompt with supporting media | Authenticated contributor submission, original category, optional Blob media, consent/rights attestation, rate limiting, malware-safe media validation, and human moderation. |
| Read articles | Original ALIPROMPT blog index and article pages with publishing workflow, metadata, sitemap, and structured data. |
| Report unsafe or infringing content | Authenticated/anonymous report intake with triage state, audit trail, and admin resolution. |

The public observation also demonstrates sign-in gating for saved items and a public contribution leaderboard. ALIPROMPT will meet those jobs with a privacy-safe design; it will never display member email addresses in a public ranking.

## 3. Original ALIPROMPT product model

### Content types

* **Free prompt:** may be published by ALIPROMPT or a verified contributor after moderation; visible and usable by all visitors unless specifically archived.
* **Paid prompt pack / workshop resource:** authored, priced, sold, refunded, and supported only by ALIPROMPT; a user receives it through an entitlement.
* **Article:** editorial content owned and published by ALIPROMPT.

### Roles

| Role | May do | May not do |
| --- | --- | --- |
| Visitor | browse, search, copy public prompts, report public content | save, submit, access paid library, administer |
| Member | visitor actions plus favorite, manage library, submit free prompts | publish directly, sell, moderate, see another member’s private data |
| Contributor | member whose public submissions are approved | receive payout or turn a submission into a paid listing |
| Editor | review and schedule content | alter payment records or roles beyond assigned scope |
| Admin | manage content, reports, users, products, orders, grants, audit log | bypass immutable payment/audit evidence without recording a reason |

## 4. Architecture target

```text
Browser
  -> Next.js App Router on Vercel
     -> Server actions / route handlers (Zod validation, authz, rate limits)
        -> PostgreSQL (source of truth)
        -> Vercel Blob (only validated media)
        -> payment provider adapter + verified webhook
        -> transactional email adapter
```

PostgreSQL stores all transactional state. Blob stores only public/approved media or private upload staging objects; database rows own object keys and lifecycle state. No private prompt or entitlement decision may depend on a client-controlled Blob URL.

### Core records

`users`, `sessions`, `roles`, `categories`, `prompts`, `prompt_versions`, `prompt_media`, `favorites`, `library_items`, `submissions`, `moderation_decisions`, `reports`, `products`, `prices`, `orders`, `payment_events`, `entitlements`, `contributors`, `leaderboard_snapshots`, `articles`, `audit_events`, `rate_limit_events`, and `privacy_requests`.

Required database invariants:

* A prompt slug is unique; published records are immutable through version rows, not destructive edits.
* `products.seller_kind` is constrained to `aliprompt`.
* One verified provider event is processed once; one order/product/user grant is unique and idempotent.
* An entitlement is server-created from a verified event or audited manual grant only.
* A media row cannot become public before its parent item is approved and its upload is validated.
* Favorites and Library records are unique per user and source item.
* Admin actions and moderation decisions carry actor, time, object, prior/next state, and reason.

## 5. Sprint acceptance gates

| Sprint | Deliverable | Gate before advancing |
| --- | --- | --- |
| S0 | This clean-room specification, scope matrix, risks, rollback plan | Owner can explain clean-room boundary and seller-of-record rule. |
| S1 | Native Next.js/Vercel foundation; PostgreSQL/Blob schema; auth boundary; migration plan | Unit/build/lint pass; preview health check; no Cloudflare runtime imports remain on request paths. |
| S2 | Catalog, detail, search, free prompt usage | Search/filter/copy/analytics tests pass, including no-result and malicious-query cases. |
| S3 | Accounts, favorites, library, contributor profile, leaderboard | Authorization tests prove one user cannot access another’s library or data. |
| S4 | Submission, uploads, moderation, reports, admin | State-machine, file-validation, rate-limit, and audit-log tests pass. |
| S5 | ALIPROMPT-only checkout and entitlement | Provider webhook signature, replay, amount/currency/product mismatch, and duplicate delivery tests pass. |
| S6 | Blog, SEO, accessibility, performance, security, operations | Lighthouse/a11y budget, metadata/sitemap, threat-model and backup/restore rehearsal pass. |
| S7 | Full regression, preview verification, rollback rehearsal | Explicit preview sign-off evidence, production checklist, and a tested rollback command/path. |

## 6. External dependencies and decisions

Work can proceed through application architecture and tests without these, but live verification needs them:

1. A Vercel project with Preview authorization, a Vercel Postgres-compatible `POSTGRES_URL`, and a Blob store token.
2. An approved payment provider, legal merchant account, webhook secret, return/cancel URLs, refund policy, and tax/invoice decision.
3. An approved authentication method and credentials (for example, email delivery provider or OAuth application), plus an owner/admin bootstrap identity.
4. Canonical production domain, privacy policy, terms, content policy, takedown contact, and retention/deletion schedule.

None of those are silently substituted with fake production credentials. Development fixtures are clearly labeled and cannot be enabled in Production.

## 7. Preview and rollback plan

* Every change is tested locally, then on an isolated Vercel Preview linked to a non-production database/schema and preview Blob prefix.
* Database migrations are additive and backward-compatible first; destructive migration requires a tested backup and a separate approved change.
* The release record saves Vercel deployment URL, git SHA, migration IDs, environment version, smoke-test results, and rollback owner.
* Rollback is: pause checkout webhook processing, redeploy the last known-good Vercel deployment, retain (never erase) immutable payment events, and run only the documented compatible database rollback/forward-fix. Schema rollbacks are not assumed to be safe.

## 8. Explicitly out of scope for initial launch

Multi-vendor settlements, contributor payments, creator-managed paid listings, marketplace escrow, automatic AI moderation decisions, direct model inference, and production deployment without owner approval.
