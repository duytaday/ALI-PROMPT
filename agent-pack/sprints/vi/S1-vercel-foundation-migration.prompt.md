# [VI] Prompt S1 — Vercel Foundation và Reversible Migration Scaffolding

`prompt_version: 1.2.0`  
`run_only: S1`
`canonical_envelope: sprintId=S1; predecessorSprintId=S0; predecessorAcceptance=S0_ACCEPTED; applicableGates=[G1,G2,G3,G7]; exitAcceptance=S1_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S1 của ALIPROMPT. Chỉ implement S1, pass exit gate, emit handoff rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, handoff/evidence S0, MASTER-PROMPT.md, domain-invariants.md, vercel-deployment-contract.md, quality gates và handoff schema. Yêu cầu S0 acceptance overallStatus=passed và verify path/digest evidence; plan/claim không phải evidence.
- Snapshot branch/HEAD/dirty/untracked/concurrent work, claim file không chồng lấn và giữ unrelated changes. Cấm reset/checkout/clean.
- Không bịa credential. Dùng typed variable name, local/test adapter và isolated synthetic data. Không tạo live provider, chạy Production migration, deploy Production hay đổi domain/alias nếu thiếu explicit approval đúng scope.

SCOPE
Thiết lập supported native Next.js-on-Vercel foundation; typed Development/Preview/Production env boundary; server/client separation; health/readiness và redacted observability skeleton; provider-neutral PostgreSQL/Drizzle boundary; deterministic migration/backfill rehearsal tooling; reversible compatibility/cutover boundary cho hành vi vinext/Vite/Cloudflare/D1 đã verify.

NON-GOALS
Không làm full auth, contributor UI, catalog parity, Blob media pipeline, engagement, blog hay commerce. Không tự chọn provider thật, migrate live data, tạo production DB, deploy Production, đổi DNS, destructive schema contraction hay xóa legacy runtime/config.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet: evidence S0, user outcome, owned path chính xác, risk, test, rollback. Đọc lại file ngay trước patch.
2. Verify ADR S0 với live repo. Nếu đã native Next.js, chỉ đóng gap có bằng chứng; nếu chưa, tạo foundation tương thích nhỏ nhất, không flag-day rewrite.
3. Implement typed env validation và environment adapter. Secret chỉ server; Preview tách Production; canonical/callback URL lấy từ allowlist, không tin forwarded host tùy ý.
4. Thêm PostgreSQL/Drizzle interface và translated migration scaffolding đúng S0. Tách build khỏi migration execution; một migration owner; bounded connection và region note.
5. Tạo resumable dry-run/backfill verification cho count, key range, reference, hash, money/state distribution và checkpoint. Chỉ dùng synthetic/local fixture.
6. Thêm health/readiness, request correlation, redacted error/metric boundary; không log prompt body, auth/payment secret hay PII.
7. Giữ tested rollback/compatibility route về baseline đã verify. Không xóa legacy config. QA độc lập review framework support, env leak, migration safety và scope.

NHÁNH VÀ EDGE CASE
- Native Next.js đã có; partial migration; Cloudflare-only binding; Edge/Node API không tương thích; generated output; monorepo; không Git; SQLite-specific default/index/transaction/JSON/search; fixture trống/có data.
- Env thiếu/sai, secret vô tình dùng NEXT_PUBLIC, Preview trỏ Production, DB unavailable, connection exhaustion, partial/resumed backfill, duplicate migration runner, cross-region timeout, build tự chạy migrate.

TEST VÀ EVIDENCE
- Discover và ghi repo-native install/format/lint/type/unit/integration/build commands; chạy toàn bộ command liên quan S1 với exit/output, tách unrelated baseline failure.
- Test local production build/start hoặc equivalent được support; health/readiness; missing/malformed/cross-env failure; server secret không vào bundle; Preview isolation config.
- Test translated schema/migration trên disposable PostgreSQL, deterministic dry-run/backfill, resume/idempotency, mismatch detection, duplicate-runner lock, rollback/compensation rehearsal; test connection bounds/timeouts.
- Review diff để giữ legacy, không có production endpoint/credential và không vượt scope. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi supported Next.js foundation build được, env isolation fail closed, disposable PostgreSQL migration/backfill rehearsal + rollback pass, observability redacted, legacy rollback còn dùng được và QA độc lập accept evidence. Không chạy S2.

OUTPUT CONTRACT
Báo exact file, command/result, acceptance, risk, rollback. Emit đúng 19 schema key—schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals—với S1/predecessor/exit nằm trong field hợp lệ; không sprintId, secret, PII hay URL bịa.
```
