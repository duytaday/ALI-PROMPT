# OPS1 — Local implementation evidence

Date: 2026-08-19  
Scope: Vercel + Supabase readiness hardening only. No remote migration, Preview deployment, or Production deployment was performed.

## Implemented

| Area | Change | Evidence |
| --- | --- | --- |
| Node/runtime | Node engine is pinned to `22.x`; application DB client remains lazy and uses `prepare: false`, `max: 1`, 5-second connect timeout and 20-second idle timeout. | `package.json`, `db/index.ts` |
| Database contracts | Runtime uses `POSTGRES_URL`; Drizzle accepts `POSTGRES_MIGRATION_URL` and fails closed outside local development when it is absent. | `drizzle.config.ts`, `.env.example` |
| Environment isolation | App URL is validated without returning it; Vercel environment, database tag and Blob tag must agree. | `lib/platform/runtime-env.ts` |
| Readiness | `/api/readiness` performs bounded PostgreSQL and allowlisted-table checks, plus a non-destructive Blob `list(limit: 1)` check. All responses retain safe status codes only. | `lib/platform/health.ts`, `lib/platform/readiness.ts` |
| Browser baseline | Global anti-sniffing, frame, referrer, permissions and HSTS headers are configured. | `next.config.ts` |

## Local verification

- `npm run lint` — pass.
- `npm audit --omit=dev --audit-level=high` — 0 vulnerabilities.
- `npm test` — pass: AI contracts, Drizzle check, production build, 39 JavaScript tests, 1 TypeScript payment test.
- Negative platform tests cover invalid/mismatched environment tags, unavailable database/schema, unavailable Blob, timeout-safe response behavior and secret redaction.

## Deployment boundary and blockers

No Vercel project link, Preview URL, Supabase Preview credentials, Blob Preview token, migration-runner credential, or remote database was available in this workspace. Therefore the following remain owner-controlled actions:

1. Create and tag isolated Preview Supabase and Blob resources.
2. Configure `POSTGRES_URL` only for application runtime and keep `POSTGRES_MIGRATION_URL` in the authorized migration runner/CI scope.
3. Rehearse migrations on a disposable Preview-like database, including backup/rollback evidence.
4. Create a Vercel Preview (never `--prod`), then verify `/api/health` and `/api/readiness`.
5. Approve Preview QA before any explicit Production-release decision.

Rollback is code-only for this local slice: restore the preceding revision and redeploy Preview. Database schema has not been changed by OPS1.
