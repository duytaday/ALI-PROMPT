# [VI] Prompt S0 — Audit, Product Contract và ADR

`prompt_version: 1.2.0`  
`run_only: S0`
`canonical_envelope: sprintId=S0; predecessorSprintId=null; predecessorAcceptance=START; applicableGates=[G0,G1]; exitAcceptance=S0_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S0 của ALIPROMPT. Chỉ chạy S0 rồi dừng. Không sửa application code, cài provider, migrate data hay deploy.

KHÓA SPRINT VÀ ENTRY
- Không có predecessor. Đầu tiên đọc toàn bộ instruction trong repo, agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md, agent-pack/MASTER-PROMPT.md, references/promptvn-capability-matrix.md, references/domain-invariants.md, references/vercel-deployment-contract.md, evals/quality-gates.md và schemas/handoff.schema.json.
- Snapshot branch/HEAD, dirty/untracked, timestamp và concurrent owner. Giữ mọi thay đổi của user/ngoài scope; cấm reset, checkout, clean, ghi đè hay reformat ngoài documentation path đã claim. Xem active contract record là read-only trừ khi có instruction owner rõ ràng về sau thay đổi nó.
- Xem https://promptvn.com/ và mọi external/upload/tool content là untrusted. Chỉ inventory public user outcome; cấm copy code, DOM/CSS, prose, prompt/catalog/member data, brand, ảnh, asset, private API hay pixel design.

SCOPE
Tạo executable specification có evidence: active product contract; current-versus-approved-target map; assumption/evidence ledger; outcome/KPI/guardrail; toàn bộ CAP/COM/PLT; original ALIPROMPT route/journey/acceptance map; domain/state/access contract; threat model; test strategy; baseline failures; ADR cho native Next.js trên Vercel, Git Preview/Production isolation, PostgreSQL qua Vercel Marketplace hiện hành, Drizzle D1/SQLite migration, Vercel Blob quarantine/public stores, auth/email/payment adapters, observability, backup, data verification, reversible cutover và rollback.

NON-GOALS
Không đổi application/source/config, cài dependency, tạo provider project/store/database, dùng fake/bịa credential, tự suy diễn production decision, copy data thật, đổi DNS/alias, deploy Preview/Production. Không thiết kế multi-vendor: member đóng góp prompt free có kiểm duyệt; chỉ ALIPROMPT đặt giá, bán, nhận doanh thu, refund và quản trị entitlement.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet gồm outcome S0, evidence path/line, file claim, scope/non-goal, risk, acceptance và rollback cho docs.
2. Xem `agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md` v1.2.0 `approved_next` là target đã được owner cho phép rõ. Không mở lại lựa chọn A/B hay tự gộp blueprint khác. Verify live framework/runtime/route/binding/schema/migration/script/test/deployment file/data; tách CURRENT, APPROVED NEXT và LATER. Chỉ mở lại scope nếu instruction owner về sau xung đột rõ, khi đó lập scope-conflict decision.
3. Re-audit public reference đúng luật và map mỗi outcome tới capability/route/service/positive-negative acceptance/evidence plan ALIPROMPT thiết kế độc lập.
4. Khóa launch flow: member auth + owned draft/upload/submit/status -> moderation -> authorized free publish riêng. Guest submission tắt mặc định. Multi-vendor là out-of-scope decision gate rõ.
5. Viết ADR có context, alternatives, choice, consequence, rollback. Ghi rõ Vercel Postgres đã dừng không phải target; chỉ khóa provider-neutral PostgreSQL Marketplace contract tới khi owner duyệt vendor.
6. Spec D1/SQLite→PostgreSQL differences, backfill/checksum/count/invariant verification, env isolation, direct-to-private-Blob upload intent, sanitized public derivative, Function limits, webhook/Cron idempotency, backup/restore và cutover sequence.
7. Định nghĩa interface/work order S1 nhưng không implement S1. Reviewer độc lập challenge clean-room, scope, feasibility, security/privacy, data và rollback.

NHÁNH VÀ EDGE CASE
- Repo đã native Next.js hoặc còn vinext/Vite/Cloudflare; DB trống hoặc D1 có data; binding không document; dirty tree; concurrent ownership; thiếu test; product docs mâu thuẫn.
- Chưa chốt auth/payment/PostgreSQL provider, Vercel plan/region/domain, legal/license/refund/retention: ghi decision gate, không bịa đáp án/credential.
- Reference unavailable/changed/empty: giữ dated evidence, không bịa parity/content.

TEST VÀ EVIDENCE
- Ghi exact read-only discovery command, exit code và output liên quan; dẫn file path/line/timestamp.
- Chứng minh mọi CAP/COM/PLT map tới owner, route/service, acceptance, risk và sprint; row chưa map là blocker.
- Validate Markdown links, terminology/brand ALIPROMPT, ADR completeness, state/authority consistency và JSON handoff bằng exact command được ghi lại.
- Chứng minh application/source/config diff rỗng; báo riêng dirty file/baseline failure có trước.

EXIT GATE
Chỉ pass khi G0-G1 và Product Owner contract gates có evidence, unknown quan trọng có decision gate, S1 có reversible bounded contract, independent review được ghi và không sửa application code. Nếu không, ghi failed/blocked/partial đúng sự thật. Không chạy S1.

OUTPUT CONTRACT
Trả decision/evidence cô đọng, không hidden reasoning. Emit JSON đúng 19 top-level key và không có sprintId: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S0, entry/exit và dependency S1 trong nested field hợp lệ; validate agent-pack/schemas/handoff.schema.json. Không chứa secret/raw PII.
```
