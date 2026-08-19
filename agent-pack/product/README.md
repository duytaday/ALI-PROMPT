# ALIPROMPT Product Owner — Cách dùng

`pack_version: 1.4.0`

Đây là entrypoint cho role `product-owner` trong development agent pack. Role này quản lý product truth, outcome, scope, priority, experiment, product acceptance intent và metric; không thay Architect, Orchestrator, QA hay human owner.

## Khởi tạo

1. Nạp đúng một prompt ngôn ngữ:
   - Tiếng Việt: `../agents/vi/product-owner.system.md`
   - English: `../agents/en/product-owner.system.md`
2. Nạp `ACTIVE-PRODUCT-CONTRACT.md`, product blueprint, README, decision log và evidence liên quan.
3. Chỉ cấp skill `../skills/product-discovery-prioritization.skill.yaml` khi runtime hỗ trợ contract đó.
4. Với lần audit đầu, truyền đúng sprint envelope S0:

```yaml
sprintId: S0
predecessorSprintId: null
predecessorAcceptance: START
applicableGates: [G0, G1]
exitAcceptance: S0_ACCEPTED
evidenceRefs: []
reviewerAcceptance: pending-qa-release-reviewer
```

`S0_ACCEPTED` là acceptance được yêu cầu, không phải kết quả có sẵn. Chỉ reviewer độc lập mới được phát hành label đó sau khi mọi gate áp dụng đã pass. Với S1–S7, nạp prompt sprint canonical trong `../sprints/` và predecessor acceptance đúng theo `../skills/catalog.yaml`; không tự suy ra sprint hoặc gate.

5. Dùng câu khởi động:

> Chạy S0 với sprint envelope ở trên. Đọc `ACTIVE-PRODUCT-CONTRACT.md`, rồi audit product truth của ALIPROMPT. Tách CURRENT, APPROVED NEXT, DISCOVERY, LATER, OUT và BLOCKED; không suy ra trạng thái chạy thật từ roadmap. Contract commerce/community 1.4.0, AP-PDN-001 và AP-PLATFORM-001 đã là APPROVED NEXT, vì vậy không mở lại education-vs-commerce, catalog-vs-knowledge-network hoặc Vercel+Supabase target nếu không có chỉ dẫn owner mới hay evidence blocking. Làm rõ evidence, outcome, metric/guardrail, go/pivot/stop và next owner; không sửa application code và không tự gọi S1.

## Luồng phối hợp

`PO hypothesis → analyst evidence → PO scope/priority/acceptance → architect feasibility/contracts → specialists → QA verdict → PO outcome review`

- PO quyết what/why/value/order.
- Architect quyết how/feasibility/contracts.
- Orchestrator quyết routing/dependency/path ownership.
- QA quyết pass/fail kỹ thuật độc lập.
- Human owner quyết product mode, giá/policy/legal, production và live money.

## Câu lệnh tác vụ

### Audit trạng thái sản phẩm

> Đối chiếu product docs với repo/runtime evidence. Tạo Current Product State và Scope Conflict Record. Không gọi plan/milestone là implemented. Nếu active contract record thiếu, invalid hoặc bị một chỉ dẫn owner mới mâu thuẫn, đặt `acceptance.overallStatus: blocked`, ghi approval đang pending và nêu đúng quyết định cần owner chọn.

### Ưu tiên backlog

> Chuyển các request sau thành MUST, BET, EXPLORE, LATER, OUT hoặc BLOCKED. Không bịa reach/confidence/effort. Chọn đúng một next slice, nói item nào phải defer để tạo capacity, và ghi revisit trigger.

### Phản biện ý tưởng

> Đừng phát triển ý tưởng ngay. Xác định ICP/JTBD, evidence hiện có, giả định nguy hiểm nhất, cheapest valid test, success/pivot/stop threshold và điều học được nếu thất bại. Kết luận làm test, điều chỉnh hay bỏ.

### Shape vertical slice

> Tạo Vertical Slice PRD từ product brief đã duyệt: actor, problem, outcome, baseline/target, scope/non-goals, journey, business rules, success/empty/error/unauthorized branches, privacy/security/a11y/analytics guardrails, acceptance, rollback và next owner. Không chọn kiến trúc.

### Product outcome acceptance

> Phân biệt planned, implemented, verified và released. Sau khi có QA evidence độc lập, so candidate với product outcome/acceptance version đã khóa và kết luận product intent là accept, changes requested hoặc blocked. QA giữ technical release verdict; PO không tự nghiệm thu kỹ thuật hoặc waive critical gate.

### Weekly Product Review

> Review outcome/metric, learning mới, assumption xác nhận/bác bỏ, funnel bottleneck, support/economics, việc dừng/tiếp tục, một experiment quan trọng nhất và ba quyết định tuần tới. Mọi số chưa có nguồn phải là UNKNOWN/ESTIMATE.

### Kết thúc phiên

> Lượt tương tác 1: tóm tắt decision, evidence, assumption, backlog delta, acceptance/metric, owner/deadline, risk, go/pivot/stop và revisit trigger; sau đó hỏi tôi teach-back một tình huống quan trọng. Chỉ đánh dấu stage đã hiểu sau câu trả lời đạt yêu cầu.

### Machine handoff

> Lượt riêng sau teach-back: khi được yêu cầu bàn giao, chỉ emit đúng một JSON object hợp lệ theo `../schemas/handoff.schema.json`. Không trộn câu hỏi, quiz, Markdown hay prose vào lượt JSON-only.

## Artifact chuẩn

- `ACTIVE-PRODUCT-CONTRACT.md`
- Current Product State
- Scope Conflict Record
- Evidence Ledger / Assumption Map
- Product Decision Memo / Experiment Card
- Outcome Backlog / Now-Next-Later
- Vertical Slice PRD
- Acceptance & Metric Spec
- Product Acceptance Memo
- Weekly Product Review

Artifact phiên làm việc được ghi dưới thư mục này khi work order cấp quyền. Không đặt secret, raw PII, full paid prompt, customer transcript thô hoặc chain-of-thought tại đây.

## Product direction AP-PDN-001 — Prompt Knowledge Network

Owner đã chốt hướng community vận hành như một mạng tri thức hỏi–đáp kiểu Stack Overflow cho prompt. Bộ target artifact:

- `PROMPT-KNOWLEDGE-NETWORK-PRD.md`: thesis, journeys, business rules, scope và metrics;
- `PROMPT-KNOWLEDGE-DOMAIN-MODEL.md`: bounded contexts, entity/data model, invariant và architecture target;
- `PROMPT-KNOWLEDGE-MIGRATION-ROADMAP.md`: mapping từ catalog hiện tại, delivery slices, gates và rollback;
- `PROMPT-KNOWLEDGE-ACCEPTANCE-MATRIX.md`: scenario acceptance bắt buộc.

Các tài liệu này là `APPROVED NEXT`, không phải implementation/release evidence. Chúng bổ sung community target của Active Product Contract; single-seller commerce và production approval gates không đổi.

Prompt giao cho dev nằm tại `../PROMPT-IMPLEMENT-PROMPT-KNOWLEDGE-NETWORK.md`. Prompt này yêu cầu audit, Task Contract và exact predecessor acceptance trước code; mỗi lượt chỉ triển khai một K-slice được map vào sprint S0–S7 hiện hành.

Sau dev handoff:

- QA dùng `../PROMPT-QA-PROMPT-KNOWLEDGE-NETWORK.md` để review độc lập theo PK-01–PK-24 và phát hành technical verdict.
- DevOps dùng `../PROMPT-DEVOPS-PREPARE-VERCEL-DEPLOY.md` ở chế độ mặc định `PREPARE_ONLY` để chuẩn bị Next.js trên Vercel + PostgreSQL trên Supabase, environment, Preview, migration, observability và rollback; không có Production authority ngầm.

## Platform direction AP-PLATFORM-001 — Vercel + Supabase

- Vercel host ứng dụng Next.js và Preview/Production deployments.
- Supabase cung cấp managed PostgreSQL cho Development/Preview/Production theo isolation đã duyệt.
- Drizzle giữ migration authority; Supabase CLI migration không chạy song song nếu chưa có ADR đổi authority.
- Supabase Auth/Storage/Realtime/Data API nằm ngoài quyết định này; Vercel Blob và auth hiện hành không bị thay ngầm.

Dev goal đang hoạt động được mô tả tại `DEV-GOAL-PROMPT-KNOWLEDGE-NETWORK.md`, gồm user/business/technical outcome, K0–K6 và Definition of Done end-to-end.
