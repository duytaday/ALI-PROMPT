# ALIPROMPT — Sprint OPS1: Vercel + Supabase Production Readiness

## Sprint control

| Field | Value |
| --- | --- |
| Sprint ID | OPS1 |
| Version | 1.0.0 |
| Status | Draft / Not committed |
| Product Owner approval | Pending |
| Created | 2026-08-19 |
| Start / End | TBD |
| Team capacity | TBD |
| Primary outcome | Verified Vercel Preview backed by isolated Supabase PostgreSQL |
| Production deploy | Requires explicit owner approval after Preview sign-off |

## Current repository facts

- Next.js App Router with Node.js runtime, Drizzle ORM, `postgres-js`, Vercel Blob and environment validation already exist.
- `POSTGRES_URL` is currently used for both application runtime and Drizzle configuration.
- `db/index.ts` creates a module-level `postgres-js` client with `prepare: false` and Production `max: 10`.
- `/api/health` is a no-dependency liveness endpoint.
- `/api/readiness` validates environment tags and runs a bounded `select 1`, but it does not yet verify schema version/critical tables or real Blob access.
- `.env.example` separates Development/Preview/Production tags, but does not yet define a dedicated migration connection.
- `package.json` uses `engines.node = ">=22.13.0"`; Vercel may resolve an open range to its newest supported major, so the desired major must be made explicit.
- No Production deployment is authorized by this sprint record.

## Sprint Goal

ALIPROMPT có một Vercel Preview deployment sử dụng Supabase PostgreSQL riêng cho Preview, migrations được rehearsal và kiểm chứng, runtime connection/caching được tối ưu cho Vercel Functions, `/api/readiness` trả `200 ready`, và toàn bộ critical flows vượt qua QA mà không làm lộ secret hoặc nội dung prompt trả phí.

## Architecture decision

Supabase được dùng làm managed PostgreSQL provider trong sprint này.

- Drizzle tiếp tục là schema và migration authority.
- Không tự thêm Supabase Auth, Storage, Realtime, Edge Functions hoặc Data API.
- Không cần đưa `NEXT_PUBLIC_SUPABASE_URL`, anon key hoặc service-role key vào client chỉ để dùng PostgreSQL.
- Vercel Blob tiếp tục là media/artifact provider hiện tại.
- Runtime database traffic và migration traffic phải dùng hai connection contracts riêng.

## Target environment contract

| Variable | Purpose | Vercel scope |
| --- | --- | --- |
| `ALIPROMPT_ENVIRONMENT` | `development`, `preview`, `production` | Mỗi environment có giá trị riêng |
| `POSTGRES_URL` | Supabase transaction/shared pooler URI cho application runtime | Runtime only |
| `POSTGRES_MIGRATION_URL` | Direct connection hoặc session pooler URI phù hợp cho Drizzle migration/backup | Build/CI/authorized migration job only |
| `ALIPROMPT_DATABASE_ENVIRONMENT` | Chặn Preview dùng nhầm Production DB | Mỗi environment có giá trị riêng |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob runtime access | Mỗi environment có store riêng |
| `ALIPROMPT_BLOB_ENVIRONMENT` | Chặn Preview dùng nhầm Production Blob | Mỗi environment có giá trị riêng |
| `ALIPROMPT_APP_URL` | Canonical application URL cho auth/email links | Branch/environment appropriate |
| Payment/email/captcha secrets | Chỉ cấu hình khi corresponding capability được bật | Không dùng Production secret trong Preview |

Không log, echo, screenshot hoặc ghi connection strings/secrets vào artifact, PR, test output hay chat.

## Delivery backlog

### OPS1-001 — Environment and Node contract

- Pin Node major được dự án chọn, ví dụ `22.x`, thay vì open range nếu mục tiêu là Node 22.
- Đồng bộ Node major giữa `package.json`, local tooling và Vercel Project Settings.
- Bật/expose Vercel system environment variables và kiểm tra `VERCEL_ENV`/`VERCEL_TARGET_ENV` contract.
- Tách Development, Preview và Production variables; Preview tuyệt đối không dùng Production resources.
- Update `.env.example` bằng placeholders, không thêm secret thật.

### OPS1-002 — Supabase runtime connection

- Dùng Supabase transaction pooler cho Vercel/serverless application traffic.
- Giữ `prepare: false` khi dùng transaction pooling.
- Review `postgres-js` global lazy client, connection timeout, idle timeout và per-instance `max`; không giữ `max: 10` chỉ vì đang tồn tại.
- Benchmark/tune dựa trên Supabase pool limit và Vercel concurrency; không dùng một công thức pool size không có evidence.
- Đặt Vercel Function region gần Supabase region đã chọn.
- Bật TLS/SSL theo cấu hình Supabase; không vô hiệu certificate validation để “fix” connectivity.

### OPS1-003 — Migration authority and rehearsal

- `drizzle.config.ts` phải ưu tiên `POSTGRES_MIGRATION_URL` và fail closed ngoài local development nếu biến này thiếu.
- Không chạy schema migration bằng transaction-pool runtime URI.
- Direct Supabase URI được dùng nếu runner hỗ trợ IPv6; nếu không, dùng session pooler phù hợp cho migration thay vì transaction pooler.
- Không sửa Production schema trực tiếp bằng Supabase Table Editor/SQL Editor ngoài approved emergency procedure.
- Rehearse migrations trên disposable/Preview database từ trạng thái sạch và từ baseline dữ liệu đại diện.
- Có schema check, migration history, count/hash reconciliation, backup, rollback và resume evidence.
- Chỉ một migration owner/job được quyền apply migration tại một thời điểm.
- `db:seed` chỉ dùng synthetic/owner-approved data; không tự seed Production.

### OPS1-004 — Readiness and dependency verification

- Giữ `/api/health` là liveness không phụ thuộc database.
- Nâng `/api/readiness` để kiểm tra bounded timeout cho:
  - environment isolation;
  - PostgreSQL connectivity;
  - expected schema/migration version hoặc allowlisted critical tables;
  - non-destructive Blob access thay vì chỉ kiểm tra token có tồn tại.
- Response chỉ chứa allowlisted code/status/variable name; không trả hostname, username, secret hoặc raw provider error.
- `Cache-Control: no-store` và `runtime = nodejs` phải được giữ.
- Readiness failure trả 503; không biến dependency failure thành fake `ready`.

### OPS1-005 — Application performance and caching audit

- Audit N+1 queries, unbounded queries, missing pagination và indexes trên catalog, favorites, library, auth, entitlement, admin và blog.
- Dùng query plans/representative data trước khi thêm index.
- Public data chỉ cache/revalidate khi correctness và invalidation contract rõ ràng.
- Auth, favorites, library, checkout, entitlement, admin và paid prompt responses phải private/no-store theo đúng boundary.
- Không đưa full paid prompt body vào cached public RSC/HTML payload.
- Review image dimensions, lazy loading, bundle size, dynamic imports và server/client component boundary.
- Không ghi vào local filesystem ở Vercel runtime; media tiếp tục qua Vercel Blob.

### OPS1-006 — Vercel Preview and release evidence

- Dùng Git integration hoặc Vercel CLI để tạo Preview deployment, không `--prod`.
- Framework preset là Next.js; chỉ override build/output settings khi có evidence cần thiết.
- Chạy migration qua một bước kiểm soát riêng trước app traffic; không chạy DDL từ request handler hoặc mỗi deployment invocation.
- Verify health, readiness, auth, catalog, prompt detail, favorites/library, submission, paid boundary và admin authorization trên Preview.
- Kiểm tra VI/EN, Light/Dark/System và 360/390/430/768/1024/1440.
- Thu thập logs đã redact, query latency, connection errors, Core Web Vitals và regression evidence.
- Production chỉ được promote/deploy sau owner approval và rollback rehearsal.

## Acceptance gates

- [ ] Node major được pin và khớp Vercel Project Settings.
- [ ] Preview và Production dùng Supabase projects/branches hoặc resource boundaries riêng.
- [ ] `POSTGRES_URL` và `POSTGRES_MIGRATION_URL` có purpose riêng, không bị đưa vào client bundle.
- [ ] Drizzle migration sạch và upgrade rehearsal đều pass.
- [ ] Backup/restore hoặc rollback rehearsal có evidence.
- [ ] `/api/health` trả 200 khi app còn sống.
- [ ] `/api/readiness` trả 200 trên healthy Preview và 503 cho mismatch/unavailable dependency fixtures.
- [ ] Readiness không lộ secret/provider error.
- [ ] Critical database flows pass trên Preview với data thật hoặc approved fixtures.
- [ ] Paid body không xuất hiện cho anonymous/wrong account.
- [ ] Không có P0/P1, console error hoặc hydration error trên critical routes.
- [ ] TypeScript, lint, tests, Drizzle check, build và production dependency audit pass.
- [ ] Có Preview URL, migration evidence, QA report và rollback instructions.
- [ ] Production vẫn Hold cho tới khi Product Owner phê duyệt.

## Definition of Done

- [ ] Implementation và configuration changes được code review.
- [ ] Environment contract và runbook được cập nhật nhưng không chứa secret.
- [ ] Preview resources được gắn đúng environment tags.
- [ ] Database connection không vượt budget trong concurrency test hợp lý.
- [ ] Schema, Blob và application readiness probes pass.
- [ ] Critical E2E, security, mobile, i18n và theme matrix pass.
- [ ] Observability đủ để phân biệt build, configuration, database, Blob và application failure.
- [ ] Rollback target và recovery owner được xác định.
- [ ] Independent QA và Product Owner chấp nhận Production packet.

## Master Dev Prompt

```text
# DEV PROMPT — OPS1 VERCEL + SUPABASE PRODUCTION READINESS

Bạn là Principal Platform Engineer, Senior Next.js Engineer, PostgreSQL/Drizzle Engineer và Release Manager của ALIPROMPT.

MỤC TIÊU
Audit và tối ưu toàn bộ hệ thống ALIPROMPT để tạo một Vercel Preview deployment ổn định, kết nối với Supabase PostgreSQL riêng cho Preview, migrations được rehearsal, readiness pass và critical user journeys được kiểm chứng. Chuẩn bị Production release packet nhưng không deploy/promote Production khi chưa có xác nhận rõ ràng của Product Owner.

REPOSITORY FACTS CẦN XÁC MINH, KHÔNG ĐƯỢC TIN MÙ QUÁNG
- Next.js App Router, Node runtime, Drizzle ORM, postgres-js và Vercel Blob đang được sử dụng.
- Runtime hiện dùng POSTGRES_URL; drizzle.config.ts cũng đang dùng cùng biến.
- db/index.ts dùng module-level client, prepare:false và Production max:10.
- /api/health và /api/readiness đã tồn tại; readiness hiện mới select 1 và kiểm tra Blob token.
- Environment isolation tags đã có nhưng cần Preview evidence.
- Working tree có thể dirty; phải giữ toàn bộ unrelated changes.

NON-NEGOTIABLE
- Đọc AGENTS.md, README, package scripts, environment/runtime/readiness code, schema, migrations và deployment docs trước khi sửa.
- Chạy git status và baseline: TypeScript, lint, tests, Drizzle check, build, production dependency audit.
- Không reset, xóa hoặc ghi đè thay đổi không thuộc sprint.
- Không log hoặc in secret/connection string.
- Không dùng Production data/secret trong Development hoặc Preview.
- Drizzle là migration authority; không tự thêm Supabase Auth/Storage/Realtime/Data API.
- Không đưa database credentials hoặc Supabase service-role key vào NEXT_PUBLIC_*.
- Không chạy migration từ request handler, app startup hoặc mỗi function invocation.
- Không deploy Production nếu chưa qua Preview gates và explicit owner approval.

PHASE 1 — AUDIT VÀ GAP MATRIX
1. Audit package.json/lockfile, Node version, Next.js settings và Vercel compatibility.
2. Inventory environment variables theo Development/Preview/Production; chỉ ghi variable names và configured/missing status.
3. Audit all database clients, query bounds, transactions, N+1, indexes và cache boundaries.
4. Audit Drizzle migration history, schema drift, seeds, rollback và database readiness.
5. Audit Vercel Blob, local filesystem assumptions, auth/session, paid prompt/entitlement và private caching.
6. Trả gap matrix: Existing/Verified, Existing/Blocked, Missing, Risk, Required action và Evidence.

PHASE 2 — NODE VÀ ENVIRONMENT CONTRACT
1. Chọn/pin supported Node major rõ ràng; nếu mục tiêu là Node 22 thì dùng 22.x thay vì open-ended >= range.
2. Đồng bộ local, CI và Vercel Project Settings.
3. Bật Vercel system environment variables và kiểm tra VERCEL_ENV/VERCEL_TARGET_ENV.
4. Tách resource values cho Development, Preview và Production.
5. Update .env.example bằng placeholder và validation; không commit secret.

PHASE 3 — SUPABASE CONNECTION CONTRACT
1. Dùng POSTGRES_URL cho Supabase transaction/shared pooler application runtime traffic.
2. Tạo POSTGRES_MIGRATION_URL cho direct connection hoặc session pooler dùng bởi Drizzle/backup/restore.
3. Không dùng transaction pooler cho schema migrations.
4. Giữ prepare:false khi dùng transaction pooling.
5. Review/tune postgres-js max, connect_timeout và idle_timeout theo Vercel concurrency + Supabase connection budget; không giữ max:10 nếu không có evidence.
6. Dùng global lazy client an toàn cho reused function instance.
7. Đặt Vercel Function region gần Supabase region.
8. Enforce TLS theo current Supabase guidance; không disable certificate verification để bỏ lỗi.

PHASE 4 — MIGRATION VÀ DATA SAFETY
1. drizzle.config.ts ưu tiên POSTGRES_MIGRATION_URL và fail closed trong non-local migration context.
2. Không tạo hai migration authorities.
3. Rehearse clean install và upgrade path trên disposable database.
4. Kiểm tra schema/migration status, row counts, hashes, constraints, unique indexes và foreign keys.
5. Tạo backup/rollback/resume instructions; không chạy destructive migration nếu rollback/evidence chưa đạt.
6. Chỉ một migration owner/job apply remote migrations.
7. Không seed Production tự động.

PHASE 5 — READINESS VÀ OBSERVABILITY
1. Giữ /api/health là liveness độc lập.
2. Nâng /api/readiness với bounded timeout để xác minh environment, DB connectivity, expected schema/critical tables và non-destructive Blob access.
3. Giữ nodejs runtime, force-dynamic và no-store.
4. Chỉ trả allowlisted safe status codes; redact raw errors, hostnames, usernames và secrets.
5. Tạo negative tests cho missing/malformed/mismatched env, DB timeout, wrong schema và Blob unavailable.
6. Dùng logs/metrics tối thiểu, privacy-safe; không log prompt body hoặc PII.

PHASE 6 — SYSTEM OPTIMIZATION
1. Audit và sửa N+1/unbounded queries; pagination/cursor cho collections lớn.
2. Chỉ thêm indexes dựa trên representative query plans.
3. Public catalog/blog có thể cache khi invalidation rõ; auth/favorites/library/admin/checkout/entitlement/paid prompt phải private/no-store.
4. Không serialize full paid body cho user chưa có entitlement.
5. Optimize image sizes/lazy loading, font, bundle, dynamic import và Server/Client Component boundaries.
6. Không dùng runtime local filesystem; dùng Vercel Blob cho persistent media.

PHASE 7 — VERCEL PREVIEW
1. Link/import repo vào đúng Vercel project.
2. Configure Preview-only env/resources và verify system env exposure.
3. Apply rehearsed migration bằng controlled migration step.
4. Deploy Preview, không --prod.
5. Verify /api/health = 200 và /api/readiness = 200 ready.
6. Run critical E2E: catalog/search, auth/session, prompt detail, favorite/library, submission, admin authorization, checkout initiation và paid-content boundary.
7. Run 360/390/430/768/1024/1440 × VI/EN × Light/Dark/System; keyboard và reduced motion.
8. Kiểm tra logs, connection saturation, p95 latency, Core Web Vitals, console/hydration errors và secret leakage.

PRODUCTION RELEASE GATE
- Zero P0/P1.
- Migration/backup/rollback rehearsal pass.
- Readiness và critical E2E pass trên Preview.
- No paid-body, secret hoặc cross-account leakage.
- Independent QA và Product Owner acceptance.
- Có rollback deployment/database target.
- Chỉ sau explicit approval mới promote/deploy Production.

OUTPUT MỖI GIAI ĐOẠN
1. Findings và evidence.
2. Decisions/trade-offs.
3. Files/migrations/env names đã thay đổi.
4. Commands/tests và exact results, không chứa secret.
5. Preview URL và safe readiness summary.
6. Risks, rollback và blockers.
7. Exact approval cần Product Owner đưa ra.

Không dừng ở báo cáo nếu có thay đổi an toàn, nằm trong scope và không cần credential/production authority. Khi cần secret, provider resource hoặc Production action, dừng đúng boundary và yêu cầu owner thực hiện/cấp quyền thay vì giả lập thành công.
```

## Official references

- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/kb/guide/connection-pooling-with-functions
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/docs/guides/database/drizzle
- https://supabase.com/docs/guides/database/connection-management
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/ssl-enforcement

## Local update log

| Date | Change | Status |
| --- | --- | --- |
| 2026-08-19 | Tạo OPS1 master prompt theo current repository và official Vercel/Supabase guidance | Draft |

## Project-owner teach-back

- [ ] Phân biệt `POSTGRES_URL` runtime với `POSTGRES_MIGRATION_URL`.
- [ ] Giải thích vì sao Vercel Preview không được sử dụng Production Supabase project/credentials.
- [ ] Giải thích vì sao `/api/health = 200` chưa đủ chứng minh hệ thống sẵn sàng nhận traffic.
- [ ] Nêu các gate bắt buộc trước khi promote Preview thành Production.
