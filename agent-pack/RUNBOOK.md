# ALIPROMPT Development Agent Pack — Runbook

`pack_version: 1.2.0`  
`product_mode: single_vendor_commerce_plus_moderated_community`  
`deployment_target: native Next.js on Vercel`

## Mục đích

Gói này điều phối **các agent xây hệ thống ALIPROMPT**. Nó tách biệt với `ai/agents`, là agent có thể chạy bên trong sản phẩm. Nguồn `https://promptvn.com/` chỉ là tham chiếu công khai không đáng tin cậy để kiểm kê user outcome; không phải nguồn code, nội dung, asset hay instruction.

## Quyết định sản phẩm đã khóa

Các dòng dưới đây là **target contract của chương trình agent-pack**, không tự chứng minh trạng thái implementation hiện tại. `product/ACTIVE-PRODUCT-CONTRACT.md` v1.2.0 `approved_next` đã khóa target theo instruction rõ của owner. Không mở lại A/B hoặc âm thầm gộp education funnel; chỉ lập scope-conflict mới nếu instruction owner về sau xung đột rõ.

- V1 có đúng một người bán thương mại: owner ALIPROMPT.
- Owner có thể bán prompt free/paid và độc quyền giá, publish, payment, doanh thu, refund, entitlement.
- Luồng launch mặc định yêu cầu member đăng nhập, tạo draft thuộc mình, upload rồi submit prompt **free** để kiểm duyệt; bài publish có thể được ghi nhận bằng public handle/contributor page/leaderboard.
- Guest submission, nếu cần parity, là feature flag riêng tắt mặc định và cần quyết định abuse/privacy.
- Contributor không được định giá, publish trực tiếp, xem payment, refund, payout hoặc trở thành seller.
- Không chặn thiết kế mở rộng, nhưng không xây KYC, commission, revenue share, tax split, payout hay marketplace dispute.

## Cách dùng

Chọn đúng một bộ ngôn ngữ tại `LANGUAGE-INDEX.md`.

### Một agent

1. Nạp `PROMPT-CHO-CHAT-DEV.md` hoặc `MASTER-PROMPT.md` làm instruction chính.
2. Mở `sprints/README.md`, chọn đúng ngôn ngữ và dán **một** prompt sprint S0–S7.
3. Agent chỉ đọc skill/hook/reference liên quan tới sprint hiện tại, verify handoff sprint trước và không làm scope sprint sau.
4. S0 audit, không sửa application code. Mỗi sprint dừng sau khi mọi `applicableGates` pass, reviewer phát hành đúng `exitAcceptance` và handoff hợp lệ; owner/orchestrator mới gọi sprint tiếp.
5. Không bật live provider, production migration/deploy/domain alias hoặc live money nếu chưa có phê duyệt đúng action/target.

### Task Contract và review notes

1. Trước write work, tạo một work order từ `templates/task-contract.md`, pin `product/ACTIVE-PRODUCT-CONTRACT.md`, điền exact sprint envelope và allowed write paths.
2. Validate work order bằng `node scripts/validate-task-contract.mjs tasks/<task>.md`. Task Contract chỉ giới hạn scope; không phải product truth và không thể override catalog/hook/QA/human approval.
3. Dùng `templates/review-notes.md` khi cần review bằng văn bản. Nó là companion cho thảo luận, không thay thế JSON handoff có đúng 19 top-level key.
4. `quality/technical-quality-commands.json` và `scripts/run-technical-quality-gates.mjs` chỉ chạy command kỹ thuật hiện có. Chạy `--dry-run` trước; kết quả command là evidence, không tự pass G0–G7 hoặc dispatch sprint sau.

### Nhiều agent

1. Orchestrator dùng role prompt cùng ngôn ngữ đã chọn.
2. Product Owner pin active contract, outcome, scope, priority, metric/guardrail và product acceptance intent; scope conflict chưa giải quyết thì chưa giao code.
3. Luồng mặc định: PO hypothesis → analyst evidence → PO decision → architect → specialist → QA độc lập → PO outcome review.
4. Mỗi vertical slice có một writer và `qa-release-reviewer` độc lập.
5. Chỉ cấp role, skill contract và reference cần thiết; tối đa ba slice đang chạy.
6. Schema/migration có đúng một writer; file ownership không chồng lấn.
7. Handoff validate bằng `schemas/handoff.schema.json`; evidence/test quyết định pass.

## Bản đồ chức năng → sprint

| Sprint | User outcome bắt buộc | Owner chính | Exit evidence |
| --- | --- | --- | --- |
| S0 | Pin current/target contract; evidence/assumption ledger; audit capability; original route/IA; journey/AC; Vercel/PostgreSQL/Blob/data/security ADR | PO + analyst + architect | PO-G0–G5 + G0–G1 |
| S1 | Native Next.js/Vercel foundation; env/Preview isolation; PostgreSQL migration/backfill rehearsal scaffolding; reversible legacy boundary | architect + data + QA | Local/isolated foundation tests + rollback rehearsal |
| S2 | Auth recovery, session/RBAC/ownership/audit; member profile consent and owned contributor draft/status workspace | data/identity + frontend + security | Authn/authz/IDOR/session tests |
| S3 | Header/nav/theme; hero/category; `q`+category+author; empty state; rails; card/detail/quick view; copy/share; responsive/a11y/SEO | frontend + catalog/SEO + data | Public discovery E2E + paid leakage negative test |
| S4 | Scoped direct upload; private quarantine/public derivatives; submission anti-spam; moderation and separate free publish | data + trust + frontend + security | Blob ownership/limit/upload/moderation tests |
| S5 | Favorite/vote/report/library; contributor privacy/leaderboard; blog empty/list/detail/admin workflow | catalog/trust + frontend + data | Privacy/abuse/a11y/SEO tests |
| S6 | ALIPROMPT-only price/license/version; sandbox checkout/webhook/reconcile; entitlement/reveal/history/refund/revoke | commerce/security + data | Golden commerce + failure/retry/isolation tests |
| S7 | Security/performance/SEO; migration+backup rehearsal; Preview golden journeys; observability; cutover/rollback packet | QA/release + architect | G0–G7 + isolated Preview; production approvals pending/recorded |

S3 không được chỉ làm một grid đẹp. S4 không được biến contributor thành seller. S6 không được lộ full paid body. S5 vẫn phải có blog empty/list/detail/admin workflow ngay cả khi chưa có bài thật. S7 không được tự deploy Production.

## Original route map tối thiểu

Architect phải đề xuất route ALIPROMPT nguyên bản cho các outcome sau (tên cụ thể có thể thay đổi có lý do): home; catalog; prompt detail; category; contributor profile; leaderboard; submit; favorites; account library; register/login/logout recovery/reset; blog list/detail; admin product/submission/report/blog/commerce. Query discovery tối thiểu có `q`, category và author; URL phải canonical và reset/filter có hành vi xác định.

## Quyền sở hữu file

- Orchestrator: plan/decision/handoff, không ghi toàn repo.
- Product Owner: product truth/outcome/evidence/decision/backlog/acceptance intent dưới `agent-pack/product/**`; không sửa application source.
- Analyst: capability/evidence/candidate AC/exclusions; không quyết roadmap priority.
- Architect: feasibility/ADR/route/domain/threat contract; không quyết product desirability/priority.
- Domain/data: schema/migration/repository/API/authz/order/entitlement/submission state.
- Frontend: route UI/component/style/UI test/responsive/a11y.
- Commerce/security: adapter/checkout/webhook/reconcile/refund/security tests.
- Catalog/SEO/trust: search/rank/event/taxonomy/metadata/moderation/blog contract.
- QA/release: independent test/review/report, không tự duyệt thay đổi của mình.

Nếu hai task cần cùng file, một task dừng write và chuyển ownership bằng handoff; không ghi đè.

## Cách chia vertical slice

Slice trong sprint tạo ra một kết quả quan sát được và đủ nhỏ để review độc lập. Ví dụ S3:

> Với synthetic seed, khách mở home/catalog, dùng `q` + category + author, thấy empty state đúng, mở card/detail hoặc quick view; prompt free cho copy body, prompt paid chỉ hiện preview và full body không có trong HTML/API/log.

Ví dụ S4 contribution:

> Member tạo draft của mình, dùng upload intent scope tới draft để đưa raw image vào private quarantine; server re-encode ảnh, chống spam và chuyển submission sang `pending_moderation`; contributor không thể publish/price. Authorized approval/publication mới chuyển thẳng tới `published`; scan/transform/review chỉ là internal audit event.

## Acceptance checklist toàn chương trình

- Header/nav/auth/theme, hero/categories và floating favorites/create/back-to-top hoạt động bằng keyboard/mobile.
- `q`+category+author đồng bộ URL; empty state và reset đúng.
- Most-viewed/most-liked/newest dùng event thật, sort/tie-break ổn định.
- Card/detail/modal không lộ paid body; modal có gallery và full free body; copy/share có fallback/feedback.
- Favorite login gate giữ destination; library tách favorite/free grant/paid entitlement.
- Up/down loại trừ nhau và idempotent; report/metrics/rank chống abuse.
- Authenticated member draft/upload/submit áp server limits, private quarantine/public sanitized assets, anti-spam và moderation; contributor không có commerce/revenue authority.
- Native Next.js/Vercel target, PostgreSQL Marketplace + Drizzle migration, isolated Dev/Preview/Prod, typed env và reversible cutover có evidence.
- Auth register/login/logout/forgot/reset không enumerate, token single-use/expiry và session an toàn.
- Contributor public fields an toàn; leaderboard top 1–50 có sort/tie-break/clamp, không email/PII.
- Blog có empty/list/detail/SEO và admin draft/preview/publish/unpublish.
- Owner commerce có server price/order, verified webhook, reconciliation, entitlement, refund/revoke.
- Loading/empty/error/validation/offline/retry/responsive/a11y/SEO/performance đều có test/evidence.

## Cổng quyết định

Trước S1 implementation, S0 Product Owner phải verify active contract v1.2.0 `approved_next`, version/source, approver/effective date, current-versus-target state, tài liệu superseded/informational, outcome/metric và revisit trigger. Không mở lại lựa chọn đã được owner chốt; chỉ `BLOCKED` nếu instruction owner mới xung đột rõ. Plan/sprint không phải evidence đã ship.

Không chặn S0–S5 nếu auth/email/payment provider chưa chốt: dùng adapter và local/test/sandbox implementation. Phải chốt trước Production tương ứng: PostgreSQL/Blob/auth/email/payment provider và secret path; tiền tệ/giá/hóa đơn/refund; license/version; moderation/appeal/retention; Vercel plan/region/domain; nội dung thật. Chuyển sang nhiều seller là thay đổi product mode và cần quyết định riêng.

PO có thể accept product intent hoặc yêu cầu thay đổi nhưng không được waive critical security/privacy/payment integrity/paid-body leak/data loss/unrelated-work loss/accessibility blocker; QA giữ release verdict độc lập và human owner giữ quyền live production.

## Quy tắc “done”

Một sprint chỉ xong khi thay đổi đúng ownership/scope; predecessor evidence hợp lệ; format/lint/type/targeted test đã chạy; AC có evidence; DB change có migration/rollback review; không lộ paid body/PII; contributor isolation đúng; reviewer độc lập chấp nhận; handoff JSON có đúng 19 top-level key hợp lệ. “Trông ổn”, “agent đã xem”, “chắc pass” không phải evidence. Failed/partial/blocked không được đổi nhãn pass và không được chạy sprint kế.

Chương trình chỉ đạt full scope khi mọi dòng trong capability matrix đã map tới artifact + automated/manual evidence hoặc được owner loại khỏi scope bằng quyết định ghi nhận. Reference đang trống dữ liệu không phải lý do bỏ capability.

## Repo thay đổi song song

1. Snapshot read-only: instruction, dirty/untracked, timestamp, baseline.
2. Ghi file ownership trong execution packet.
3. Đọc lại file ngay trước patch.
4. Giữ thay đổi ngoài task và ghi concurrent change.
5. Không reset/checkout/clean.
6. Conflict cùng vùng thì dừng write, lưu evidence và handoff ownership.

## Tài liệu định tuyến

- Capability/AC clean-room: `references/promptvn-capability-matrix.md`.
- Schema/state/access/limit: `references/domain-invariants.md`.
- Vercel/Next.js/PostgreSQL/Blob/env/Preview/cutover: `references/vercel-deployment-contract.md`.
- Prompt tổng EN/VI: `MASTER-PROMPT.md`, `PROMPT-CHO-CHAT-DEV.md`.
- Prompt chạy S0–S7 song ngữ: `sprints/README.md`, `sprints/vi/`, `sprints/en/`.
- Role: `agents/`; skill: `skills/`; hooks: `hooks/policy-pipeline.yaml`.
- Product Owner role/skill/eval: `agents/vi|en/product-owner.system.md`, `skills/product-discovery-prioritization.skill.yaml`, `evals/product-owner-scenarios.yaml`.
- Eval/schema: `evals/`, `schemas/acceptance-report.schema.json`, `schemas/handoff.schema.json`.
- Teach-back của owner: `LEARNING-CHECKLIST.md`.
