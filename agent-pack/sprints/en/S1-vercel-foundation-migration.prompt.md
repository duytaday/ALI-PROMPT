# [EN] S1 Prompt — Vercel Foundation and Reversible Migration Scaffolding

`prompt_version: 1.2.0`  
`run_only: S1`
`canonical_envelope: sprintId=S1; predecessorSprintId=S0; predecessorAcceptance=S0_ACCEPTED; applicableGates=[G1,G2,G3,G7]; exitAcceptance=S1_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
You are the ALIPROMPT S1 lead. Implement S1 only, pass its exit gate, emit the handoff, then stop.

ENTRY AND SAFETY
- Read repository instructions, the S0 handoff/evidence, MASTER-PROMPT.md, domain-invariants.md, vercel-deployment-contract.md, quality gates and handoff schema. Require S0 acceptance overallStatus=passed and verify evidence paths/digests; a plan or claim is not evidence.
- Snapshot branch/HEAD/dirty/untracked/concurrent work, claim non-overlapping files and preserve unrelated changes. Never reset/checkout/clean.
- No fake credentials. Use typed variable names, local/test adapters and isolated synthetic data. Do not create live providers, run a Production migration, deploy Production, or change domain/alias without explicit scoped approval.

SCOPE
Establish a supported native Next.js-on-Vercel foundation; typed Development/Preview/Production environment boundary; server/client separation; health/readiness and redacted observability skeleton; provider-neutral PostgreSQL/Drizzle boundary; deterministic migration/backfill rehearsal tooling; and a reversible compatibility/cutover boundary for verified legacy vinext/Vite/Cloudflare/D1 behavior.

NON-GOALS
No full auth, contributor UI, catalog parity, Blob media pipeline, engagement, blog or commerce. No real provider selection by assumption, live data migration, production database, production deployment, DNS, destructive schema contraction or deletion of legacy runtime/configuration.

ORDERED WORK
1. Return an execution packet: S0 evidence, user outcome, exact owned paths, risks, tests and rollback. Re-read each file immediately before patching.
2. Verify S0 ADRs against the live repo. If already native Next.js, close only proven gaps; otherwise create the smallest compatible Next.js foundation without flag-day rewrite.
3. Implement typed env validation and environment adapters. Keep secrets server-only; isolate Preview from Production; derive canonical/callback URLs from an allowlist, not arbitrary forwarded hosts.
4. Add PostgreSQL/Drizzle interfaces and translated migration scaffolding only as approved by S0. Separate build from migration execution; one migration owner; bounded connections and region notes.
5. Create resumable dry-run/backfill verification primitives for counts, key ranges, references, hashes, money/state distributions and checkpoints. Use synthetic/local fixtures, not Production data.
6. Add health/readiness, request correlation and redacted error/metric boundaries without logging prompt bodies, auth/payment secrets or PII.
7. Preserve a tested rollback/compatibility route to the verified baseline. Do not delete legacy configs. Independent QA reviews framework support, env leaks, migration safety and scope.

BRANCHES AND EDGE CASES
- Native Next.js already present; partial migration; Cloudflare-only binding; incompatible edge/Node API; generated output; monorepo; no Git; SQLite-specific defaults/index/transactions/JSON/search; empty vs populated fixtures.
- Missing/invalid env, accidental NEXT_PUBLIC secret, Preview pointed at Production, database unavailable, connection exhaustion, partial/resumed backfill, duplicate migration runner, cross-region timeout, build trying to migrate.

TESTS AND EVIDENCE
- Discover and record the repository-native install/format/lint/type/unit/integration/build commands; run all S1-relevant commands with exit code/output and keep unrelated baseline failures distinct.
- Test local production build/start or supported equivalent; health/readiness; missing/malformed/cross-environment env failure; server-only secret non-bundling; Preview isolation config.
- Test translated schema/migration against disposable PostgreSQL, deterministic dry-run/backfill, resume/idempotency, mismatch detection, duplicate runner lock and rollback/compensation rehearsal. Test connection bounds/timeouts.
- Review diff for legacy preservation, forbidden production endpoints/credentials and unexpected scope. Validate the 19-key handoff JSON exactly.

EXIT GATE
Pass only when the supported Next.js foundation builds, environment isolation fails closed, disposable PostgreSQL migration/backfill rehearsal and rollback pass, observability is redacted, legacy rollback remains possible and independent QA accepts evidence. Do not start S2.

OUTPUT CONTRACT
Report exact files, commands/results, acceptance, risks and rollback. Emit exactly the 19 schema keys—schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals—with S1/predecessor/exit encoded inside allowed fields; no sprintId, secret, PII or invented URL.
```
