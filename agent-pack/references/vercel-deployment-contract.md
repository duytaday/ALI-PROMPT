# ALIPROMPT Vercel Deployment Contract

`version: 1.2.0`  
`target: native_nextjs_on_vercel`  
`status: specification_only_no_deploy_authority`

This contract defines the production target that every ALIPROMPT development agent must design and test against. It does **not** authorize a deployment, provider installation, production migration, DNS change, purchase, or secret handling in chat.

## Locked platform decisions

- Use a supported native Next.js application deployed on Vercel. Treat `vinext`, Vite, Cloudflare Workers/Sites, D1, and related configuration found in the repository as migration input until fresh evidence proves otherwise; do not keep them as the target by inertia.
- Use PostgreSQL obtained through a current Vercel Marketplace integration. **Do not target the discontinued Vercel Postgres product.** Keep the application provider-neutral behind standard PostgreSQL and repository interfaces.
- Drizzle may remain the data-access/migration layer after an explicit SQLite/D1-to-PostgreSQL compatibility audit. Never point an existing SQLite migration at PostgreSQL without translating and testing types, defaults, indexes, foreign keys, transaction behavior, timestamps, booleans, JSON, full-text/search behavior, and uniqueness semantics.
- Use Vercel Blob for prompt imagery. Raw member uploads enter a **private quarantine store**; only decoded, validated, re-encoded, metadata-stripped derivatives enter a separate **public sanitized-assets store**. Blob access mode is a store-level decision and must not be treated as mutable after creation.
- Separate Development, Preview, and Production configuration, data, Blob stores, provider keys, callback URLs, and telemetry. Preview must never charge real money, mutate production data, consume production webhooks, or publish to the production catalog.
- Keep authentication, email, payment, observability, queue, and PostgreSQL vendors behind explicit adapters/decision records. Vercel is the hosting target, not an excuse to invent unapproved providers or credentials.

Official platform references to re-check at implementation time:

- Next.js on Vercel: <https://vercel.com/docs/frameworks/full-stack/nextjs>
- Deployment environments: <https://vercel.com/docs/deployments/environments>
- PostgreSQL integrations: <https://vercel.com/docs/postgres>
- Vercel Blob: <https://vercel.com/docs/vercel-blob>
- Client uploads: <https://vercel.com/docs/vercel-blob/client-upload>
- Function limits: <https://vercel.com/docs/functions/limitations>
- Environment variables: <https://vercel.com/docs/environment-variables>
- Cron jobs: <https://vercel.com/docs/cron-jobs> and <https://vercel.com/docs/cron-jobs/manage-cron-jobs>

Documentation can change. Agents must verify current official limits and APIs before implementation and record the retrieval date in the ADR; they must not silently substitute recalled values.

## Repository-to-target migration rule

M0 must produce a platform migration ADR before application code changes. It must inventory the live framework/runtime, package scripts, route model, middleware, server-only boundaries, Cloudflare bindings, D1 schema/migrations/data, object storage, scheduled work, environment variables, generated files, tests, deployment metadata, custom domain, and rollback path.

The ADR must compare at least:

1. preserve or migrate each route and server capability into supported Next.js primitives;
2. translate D1/SQLite schema and queries to PostgreSQL while preserving domain invariants;
3. backfill data through deterministic, resumable, count/checksum-verified tooling;
4. move uploads into the quarantine/derivative Blob model without making raw objects public;
5. replace platform bindings with typed environment/adapters;
6. prove Preview before Production; and
7. retain the old runtime/configuration until rollback and data verification pass.

Do not perform a flag-day rewrite by default. Prefer vertical migration slices with a compatibility boundary. Avoid dual-write unless the ADR proves it necessary and defines ordering, idempotency, reconciliation, failure handling, and a bounded removal date.

## Git, Preview, and Production workflow

- Every pull request or non-production branch receives a Vercel Preview deployment after static checks and automated tests pass.
- Preview uses synthetic or explicitly approved non-production data and sandbox providers. Add `noindex` and access controls where previews could expose content or administration surfaces.
- Run smoke journeys against the immutable Preview URL: discovery, authenticated contribution, moderation, free publication, auth recovery, favorites/library, paid sandbox flow, webhook replay, refund/revocation, and mobile/keyboard use.
- Production is built from the approved production branch/commit only. Record commit, migration version, configuration fingerprint without secret values, evidence links, approvers, rollback target, and smoke result.
- Environment-variable changes take effect only on a new deployment. A release packet must identify the deployment containing each change; never assume an old deployment inherited new values.
- Promotion must not reuse Preview payment/webhook credentials or data stores. Production aliases/custom domains change only at the explicit release gate.

## PostgreSQL and Drizzle safeguards

- One agent owns schema and migrations. Application builds and Preview deployments must not run production migrations as an incidental side effect.
- Each migration has forward SQL, compatibility notes, backup/restore or compensation, expected locks/duration, data validation, and an independently reviewed rollback decision. Destructive steps use expand/backfill/verify/contract unless a safer documented alternative is proven.
- Use TLS and a connection strategy compatible with the selected Marketplace provider and Vercel Functions. Bound pool/concurrency and test connection exhaustion, cold starts, transaction behavior, timeouts, retry classification, and regional latency.
- Keep database compute/data region aligned with Vercel execution where practical and document unavoidable cross-region latency or residency constraints.
- Preview databases or schemas must be isolated from Production. Never expose Production connection strings to untrusted preview branches.
- Backfills are resumable and idempotent; compare row counts, key ranges, sampled records, referential integrity, money totals, state distributions, and content hashes before cutover.

## Member contribution and Blob workflow

The launch-default contribution path is authenticated:

`member signs in -> creates owned draft -> requests scoped upload intent -> uploads to private quarantine -> submits draft -> deterministic validation/processing -> human moderation -> authorized free publication`

- A member may list, edit, discard, or submit only their own draft while its state permits. Upload tokens/object keys are scoped to member, draft, count, size, MIME allowlist, expiry, and one intended operation.
- The submission endpoint accepts references only to completed quarantine objects owned by that draft. Never accept an arbitrary Blob URL or client-supplied storage key as ownership proof.
- The product limit is 3 MiB per image and 12 MiB total. Prefer secure direct client upload for scalability and quarantine isolation. If an explicitly supported Function fallback accepts a single image, reject a request at or above the documented 4.5 MB request/response ceiling before parsing or buffering; never aggregate multiple images through that Function. In every path, verify object metadata and ownership server-side before processing.
- Validate declared and actual bytes/type/dimensions/frame/decode cost. Decode and re-encode; normalize orientation; strip metadata; produce bounded variants; publish only sanitized derivatives. Raw/quarantined objects remain private and are deleted later by a bounded, audited retention job.
- Processing callbacks and retries are authenticated, idempotent, and tied to a stored upload-intent state. A callback cannot publish a prompt or grant moderation authority.
- The member dashboard exposes exactly five submission states: `draft`, `pending_moderation`, `changes_requested`, `rejected`, and `published`, with `changes_requested → draft` and truthful next actions. Upload progress/errors are transient operation feedback; upload receipt, scan, transform, review and approval remain internal processing/audit events, not extra submission states. Archive/suspend belongs to the published prompt/product lifecycle.
- Published community prompts are always free. ALIPROMPT alone may create prices, sell products, receive revenue, refund orders, and administer entitlements. A contributor cannot convert a contribution into a paid item.
- Guest submission, if retained for reference parity, is a separate disabled-by-default feature flag and risk decision. It must never weaken the authenticated member path or seller boundary.
- Multi-vendor selling is out of V1. Enabling member price, checkout ownership, revenue share, payout, KYC, tax allocation, or seller disputes requires a new approved product/security/legal architecture.

## Route Handler, webhook, and scheduled-job safeguards

- Implement payment webhooks as server-only Next.js Route Handlers/Vercel Functions. Preserve the provider's raw request bytes where its signature scheme requires them; verify signature and timestamp before business parsing.
- Persist a unique provider event and return the appropriate response quickly. Fulfillment/reconciliation is idempotent and durable; never rely on an unawaited in-memory task after the response.
- Reject wrong environment, provider account, currency, order, amount, or state. Duplicate, out-of-order, replayed, delayed, and concurrently delivered events must not double-fulfill or regress state.
- Cron is suitable only for bounded reconciliation, orphan-quarantine cleanup, retention, and similar maintenance. Protect endpoints with `CRON_SECRET` or stronger current platform guidance, authorize before work, and log a redacted run ID.
- Assume scheduled invocations can overlap or be delivered more than once and failed runs may not be retried automatically. Use a durable idempotency key/lease, bounded batches, checkpoints, explicit retry/reconciliation, and alerts. Verify plan-specific scheduling limits before choosing frequency.
- Function body, response, duration, memory, and concurrency limits are release inputs. Load and boundary tests must prove the selected plan supports upload-token issuance, moderation, search, checkout, webhook, and scheduled work.

## Secrets and environment contract

- Define a typed, fail-fast environment schema with separate required/optional variables per Development, Preview, and Production. Log only variable names/status, never values.
- No secrets in source, prompt files, chat, screenshots, handoffs, client-exposed variables, build output, Preview comments, analytics, or error reports. Only deliberately public values may use a client-visible prefix.
- Rotate exposed credentials and invalidate affected deployments rather than merely deleting text from Git. Review Vercel project/team access with least privilege and protect Production overrides.
- Callback, canonical, checkout-return, webhook, and asset URLs derive from an allowlisted environment base URL; do not trust arbitrary forwarded host headers.

## Reversible cutover sequence

1. Inventory and baseline the existing system; freeze no data yet.
2. Approve ADRs for Next.js, PostgreSQL provider, Blob stores, auth/payment adapters, environments, migration, observability, backup, and rollback.
3. Build and test vertical slices locally against isolated services.
4. Create Preview deployments with isolated data/providers; run G0-G7 and migration rehearsals.
5. Back up source data and run deterministic dry-run/backfill verification.
6. Schedule the bounded production migration; define write freeze or synchronization if required.
7. Deploy the exact approved commit, run migration once, verify counts/invariants, then change production alias/domain only with explicit authority.
8. Run production-safe smoke checks and monitor error, latency, connection, webhook, entitlement, Blob, and moderation signals.
9. Roll back alias/code and execute the predeclared data compensation when thresholds fail. Do not destroy the previous runtime or source data until the rollback window closes.

## Deployment readiness checklist

- [ ] Native Next.js target and every legacy platform dependency are mapped in an approved ADR.
- [ ] Current official Vercel/Marketplace limits, regions, pricing-plan constraints, and APIs are re-verified.
- [ ] Development, Preview, and Production data, Blob stores, keys, callbacks, and telemetry are isolated.
- [ ] PostgreSQL provider is selected through the current Marketplace; no discontinued Vercel Postgres target remains.
- [ ] D1/SQLite-to-PostgreSQL schema/query/backfill differences and rollback are tested with representative data.
- [ ] Private quarantine and public sanitized Blob stores exist by approved infrastructure action; direct upload tokens are scoped and boundary-tested.
- [ ] Authenticated member draft/upload/submit/track flow, ownership checks, moderation, and free-only publication pass positive and negative tests.
- [ ] Contributor attempts to price, publish, access payments, refund, or receive payout fail server-side and are audited.
- [ ] Preview deploy runs automated gates and all golden smoke journeys against sandbox/isolation.
- [ ] Environment schema passes; no secret or protected prompt body is present in build output, logs, Preview artifacts, or public responses.
- [ ] Payment webhook and Cron paths pass signature/auth, wrong-environment, idempotency, duplicate, overlap, retry, and reconciliation tests.
- [ ] Database/Blob backup, data verification, monitoring, alert thresholds, rollback owner, and recovery drill have evidence.
- [ ] Exact production commit, migration, configuration names, domain/alias action, approvers, and rollback target are recorded.
- [ ] Owner gives explicit authority for Production deploy, migration, domain/alias change, and any live provider action.

No checkbox may be marked from intent alone. Each needs a command result, artifact, Preview URL/test record, provider evidence, or signed decision that contains no secret values.
