# ALIPROMPT — Vercel + Supabase deployment gate

ALIPROMPT targets native Next.js on Vercel with managed PostgreSQL on Supabase.
A deployment is not considered ready merely because the build succeeds: its
environment and Supabase PostgreSQL connection must also pass `/api/readiness`.

Supabase is the PostgreSQL provider in this scope. Drizzle remains the canonical
schema migration authority; Supabase Auth, Storage, Realtime, Edge Functions and
Data API are not adopted implicitly. Vercel Blob remains the artifact target.

## Required environment variables

Configure a separate value set for Development, Preview, and Production.

| Variable | Development | Preview | Production |
| --- | --- | --- | --- |
| `ALIPROMPT_ENVIRONMENT` | `development` | `preview` | `production` |
| `ALIPROMPT_APP_URL` | local app origin | Preview app origin (HTTPS) | Production app origin (HTTPS) |
| `POSTGRES_URL` | development pooled Supabase connection | preview pooled Supabase transaction-pooler connection | production pooled Supabase transaction-pooler connection |
| `POSTGRES_MIGRATION_URL` | local direct/session connection | preview direct/session connection | production direct/session connection, held by the authorized migration runner only |
| `ALIPROMPT_DATABASE_ENVIRONMENT` | `development` | `preview` | `production` |
| `BLOB_READ_WRITE_TOKEN` | development store | preview store | production store |
| `ALIPROMPT_BLOB_ENVIRONMENT` | `development` | `preview` | `production` |

`POSTGRES_URL` is runtime-only and uses `prepare: false`, a one-connection budget
per warm Function instance, and bounded connection timeouts. `POSTGRES_MIGRATION_URL`
is deliberately used only by Drizzle Kit; never expose it to the Vercel runtime
or use a transaction-pooler URL for DDL.

Vercel supplies `VERCEL_ENV`. System environment variables must be exposed for
the project. ALIPROMPT compares `VERCEL_ENV` with the three explicit tags and
fails closed on any mismatch; a Preview deployment therefore cannot silently
use Production data merely because its credential is syntactically valid.

## Verification order

1. Run `npm test` and `npm run lint` locally.
2. Link the repository to a Vercel project or import it through the Vercel Git integration.
3. Configure the variables above for **Preview**, using Preview-only resources. Do not set `POSTGRES_MIGRATION_URL` in the application runtime.
4. Rehearse and verify the PostgreSQL migration against a disposable database through an authorized migration runner before applying it to Preview.
5. Create a Preview deployment. Do not use `--prod`.
6. Verify `GET /api/health` returns `200` with `status: ok`.
7. Verify `GET /api/readiness` returns `200` with all checks marked `pass`.
8. Run route, auth, accessibility, and catalog smoke tests on the Preview URL.

Use a connection mode verified for each workload: pooled connectivity for
Vercel serverless application traffic and a direct/session connection suitable
for Drizzle migrations, backup and restore tooling. Do not print either URL.
Prepared-statement behavior, IPv4/IPv6 reachability, pool limits, region and plan
must be verified from the selected Supabase project and current official docs.

## Current blockers to a safe Preview

- This workspace is not linked to a Vercel project and has no Vercel CLI installed.
- No Vercel environment variables are available locally.
- The current PostgreSQL migration is an empty-database bootstrap, not yet a
  rehearsed D1-to-PostgreSQL backfill with count/hash and resume evidence.
- Production deploy remains a separate owner-approved action after Preview sign-off.

## Endpoint contract

- `/api/health` is liveness. It does not contact PostgreSQL and stays useful when
  a dependency is down.
- `/api/readiness` validates environment isolation, checks required Blob
  configuration, probes PostgreSQL with a bounded timeout, disables caching, and
  returns only allowlisted status codes and variable names—never credential values.
