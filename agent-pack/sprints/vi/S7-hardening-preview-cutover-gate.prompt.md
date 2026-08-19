# [VI] Prompt S7 — Hardening, Preview Acceptance và Production Cutover Gate

`prompt_version: 1.2.0`  
`run_only: S7`
`canonical_envelope: sprintId=S7; predecessorSprintId=S6; predecessorAcceptance=S6_ACCEPTED; applicableGates=[G0,G1,G2,G3,G4,G5,G6,G7]; exitAcceptance=S7_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là QA/release lead S7 của ALIPROMPT. Harden và chứng minh full system trong isolated environment, chuẩn bị production decision packet rồi dừng. Không mặc định có quyền Production.

ENTRY VÀ AN TOÀN
- Đọc instruction, handoff S6 đã pass cùng evidence S0–S5, master/domain/Vercel contracts, mọi gate/scenario và handoff schema. Verify mọi predecessor overallStatus=passed và chạy lại critical checks; không nhận narrative claim.
- Snapshot/claim/giữ dirty/concurrent work. Không fake credential. Preview dùng isolated sandbox data/provider. Production deploy, migration, live provider, domain/alias, charge/refund hay destructive cleanup cần explicit approval ghi action, target, commit, migration và rollback.

SCOPE
Đóng in-scope defect; security/privacy/accessibility/SEO/performance hardening; dependency/secret/config review; DB/Blob backup-restore và D1/SQLite→PostgreSQL migration rehearsal; count/hash/invariant data verification; connection/region/Function/plan limits; webhook/Cron duplicate/overlap/failure/retry; full isolated Vercel Preview acceptance; observability/alert/runbook/SLO; exact production cutover, rollback và approval packet. Chỉ execute Production action nếu từng explicit gate tồn tại và an toàn; nếu không, kết thúc ready-with-approvals-pending.

NON-GOALS
Không new product scope, multi-vendor, cosmetic rewrite, provider/plan purchase chưa duyệt, real-data improvisation, làm yếu test, hidden risk acceptance hay Production action ngoài exact authority.

CÔNG VIỆC THEO THỨ TỰ
1. Trả release execution packet với predecessor evidence matrix, owned fixes, environment/commit/config names (không value), critical risk, tests, rollback và required approvals.
2. Trace mọi CAP/COM/PLT row và S0–S6 criterion tới live artifact + automated/manual evidence. Chỉ fix scoped defect, tách writer/reviewer.
3. Chạy threat/security/privacy/secret/dependency/config review; paid-body/PII isolation; authz/IDOR/upload/webhook/Cron/CSRF/XSS/SQL/SSRF/CSP/session/rate tests.
4. Test a11y, responsive, SEO, structured data, performance budget, load/concurrency, PostgreSQL pool/region latency và Vercel Function current-plan limits.
5. Rehearse backup/restore, resumable migration/backfill, count/hash/reference/money/state check, Blob quarantine/derivative inventory, failure threshold và rollback/compensation trên non-production data.
6. Chỉ deploy isolated Vercel Preview khi được authorize/configure; chạy mọi golden journey/failure/retry trên immutable URL. Preview noindex/access-controlled khi cần và không đụng Production.
7. Test webhook recovery và Cron auth, lock/idempotency, duplicate/overlap, checkpoint, explicit retry/alert. Hoàn tất dashboard, alert, incident/data recovery/rollback runbook.
8. Tạo exact production commit/migration/config-name/domain action, backup, go/no-go threshold, owner, smoke và rollback packet. Lấy independent QA verdict và Product Owner outcome review.
9. Nếu thiếu bất kỳ Production approval nào, dừng không deploy và ghi pending approval. Nếu đủ explicit approval, chỉ chạy action đã duyệt, verify production-safe smoke và rollback khi chạm threshold.

NHÁNH VÀ EDGE CASE
- Predecessor evidence fail, baseline failure, flaky test, critical dependency/finding, secret exposure, plan/region mismatch, connection exhaustion, Function payload/duration/concurrency breach.
- Partial/resumed migration, checksum/count/state mismatch, restore fail, Blob orphan/raw-public leak, alias đổi trước data verify, old deployment dùng stale env.
- Preview vô tình dùng Production, webhook timeout/duplicate, Cron overlap/no retry, monitoring blind spot, smoke fail, rollback cần data compensation.

TEST VÀ EVIDENCE
- Ghi exact clean-install/format/lint/type/unit/integration/contract/E2E/security/a11y/performance/build commands, exit codes và immutable artifacts; tách baseline/regression.
- Chạy G0–G7, marketplace/product-owner scenarios và full golden journeys: discovery, member draft/upload/moderation/free publish, auth recovery, engagement/library/profile/leaderboard/blog, sandbox purchase/reveal/refund/revoke, mobile/keyboard.
- Tạo performance/load/connection/region/Function-limit reports; secret/dependency/security reports; SEO/a11y evidence; migration/backup/restore/rollback drill logs; data verification digests; Preview URL/screenshots/log correlation không secret/PII.
- Validate config isolation và env change map tới deployment mới. Validate handoff đúng 19 key và independent approvals.

EXIT GATE
Chỉ pass release-readiness khi G0–G7, isolated Preview, migration/restore/rollback, observability và independent review pass, không còn critical/high blocker. Production completion còn cần explicit recorded approvals + successful production smoke. Nếu không, báo ready/pending, blocked hoặc failed đúng sự thật; không fake pass. Không chạy sprint khác.

OUTPUT CONTRACT
Trả go/no-go verdict, exact evidence, pending approvals và chỉ: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S7/release state trong field hợp lệ; không sprintId, secret, raw PII hay credential-bearing URL.
```
