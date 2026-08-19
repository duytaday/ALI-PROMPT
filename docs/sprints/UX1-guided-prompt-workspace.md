# ALIPROMPT — Sprint UX1: Guided Prompt Workspace

## Sprint control

| Field | Value |
| --- | --- |
| Sprint ID | UX1 |
| Version | 1.0.0 |
| Status | Draft / Not committed |
| Product Owner approval | Pending |
| Created | 2026-08-19 |
| Start / End | TBD |
| Team capacity | TBD |
| Candidate scope | 16 story points |
| Entry gate | Exact `S0_ACCEPTED`, PO approval, isolated Vercel Preview data path, stable prompt-detail/auth/entitlement contracts |
| Production deployment | Out of scope |

Current Sprint remains S0. UX1 must not be marked Active or committed until the entry gate, dates and team capacity are confirmed.

## Sprint Goal

Người dùng có thể biến một prompt miễn phí hoặc đã có entitlement thành prompt hoàn chỉnh, có hướng dẫn model/token rõ ràng và copy trong tối đa ba thao tác mà không làm lộ nội dung trả phí.

## Product rationale

Favorites và Library đã có nền tảng trong codebase, trong khi prompt detail hiện vẫn chủ yếu là bề mặt đọc/copy. UX1 ưu tiên biến prompt detail thành một work surface có thể tùy chỉnh và tái sử dụng. Sprint không mở rộng sang chatbot, RAG hoặc recommendation ML khi chưa có dữ liệu, privacy contract và model-cost evidence.

## Candidate backlog

### ALI-UX1-001 — Prompt Variable Builder — 8 SP — P1

**User Story:** As a prompt user, I want to fill structured variables and preview the final prompt, so that I can adapt it without manually editing placeholders.

**Acceptance Criteria:**

- Given một prompt miễn phí hoặc đã có entitlement với required/optional variables, when người dùng nhập giá trị hợp lệ, then preview và copied text khớp đúng versioned template.
- Given một required variable chưa hợp lệ, when người dùng chọn Copy, then hành động bị chặn và lỗi được liên kết đúng field.
- Given một prompt trả phí chưa có entitlement, when page hoặc DTO được tải, then protected body không xuất hiện trong client-visible payload.
- Builder hỗ trợ default, example, help text, Reset và Copy generated prompt.
- Không sử dụng `eval`, không render user content bằng HTML không an toàn và không gọi external model API.

### ALI-UX1-002 — Usage Metadata & Model Compatibility — 5 SP — P1

**User Story:** As a prompt user, I want trustworthy usage and compatibility metadata, so that I can judge whether a prompt fits my model, task and expected output before using it.

**Acceptance Criteria:**

- Hiển thị model compatibility, language, difficulty, estimated setup time, expected output, use cases, usage steps, last-tested status và prompt version.
- Metadata phải đến từ stored/versioned data; UI không được phỏng đoán compatibility.
- Trường thiếu dữ liệu phải hiển thị trạng thái `Unknown/Chưa xác định` trung thực.
- Labels và system states có đầy đủ VI/EN.
- Metadata không được lấn át primary builder/copy workflow trên mobile.

### ALI-UX1-003 — Token Estimate & Copy Formats — 3 SP — P2

**User Story:** As a prompt user, I want an approximate token count and safe copy formats, so that I can prepare the prompt for my workflow without assuming an exact vendor cost.

**Acceptance Criteria:**

- Token estimate được tính deterministic và luôn ghi rõ `estimated/ước tính`.
- Estimate cập nhật khi generated prompt thay đổi.
- Hỗ trợ Plain text và Markdown.
- JSON chỉ khả dụng khi prompt version khai báo output schema hợp lệ.
- Không gọi model API, không tuyên bố token cost hoặc vendor price chính xác.
- Không ghi prompt text vào analytics hoặc logs.

## UX/UI requirements

- Mobile-first tại 360, 390, 430, 768, 1024 và 1440px.
- Touch target tối thiểu 44×44px.
- Không horizontal overflow hoặc primary CTA truncation.
- Desktop có thể dùng split form/preview; mobile dùng stacked flow.
- Có loading, empty, invalid, entitlement-required, copy-success và copy-failure states.
- Hỗ trợ VI/EN, Light/Dark/System, keyboard, visible focus, screen reader và reduced motion.
- Animation chỉ dùng transform/opacity cho feedback; không trì hoãn primary action.

## Security and privacy requirements

- Entitlement được xác minh server-side trước khi protected body được trả cho compiler.
- Không serialize protected body vào HTML, RSC payload, public cache, metadata, logs hoặc analytics.
- Private responses dùng `private/no-store` và không được cache chéo user.
- Bound chiều dài từng variable và tổng generated prompt.
- Escape user input trong preview; không dùng `dangerouslySetInnerHTML` cho user content.
- Có negative cross-account, XSS, injection và paid-body leakage tests.

## Out of scope

- Chatbot, RAG, vector database hoặc external AI calls.
- Fuzzy search hoặc recommendation ML.
- Collections, subscriptions, coupons hoặc affiliate.
- Thay đổi ALIPROMPT-only seller invariant.
- Production deployment hoặc Production migration.
- Rewrite favorites, checkout hoặc entitlement ngoài thay đổi tối thiểu cần để tích hợp an toàn.

## Risks and dependencies

| ID | Type | Risk / dependency | Score | Mitigation |
| --- | --- | --- | ---: | --- |
| DEP-UX1-001 | Dependency | Thiếu exact `S0_ACCEPTED`, stable auth/entitlement contract hoặc isolated Preview data path | 25 | Giữ UX1 ở Draft; không implementation writes trước entry gate |
| RISK-UX1-001 | Security risk | Client compiler làm lộ protected paid body qua payload/cache/log/cross-account | 20 | Server entitlement, DTO allowlist, `private/no-store`, negative leakage tests |
| ASSUMP-UX1-001 | Assumption | Có thể chuẩn hóa 10–15 prompt đại diện với variables và metadata đáng tin cậy | 12 | Validate fixture set trước khi PO commit sprint; nếu thất bại chỉ pilot free prompts |

## Definition of Ready

- [ ] Exact `S0_ACCEPTED` tồn tại.
- [ ] Product Owner phê duyệt UX1.
- [ ] Start/end date và team capacity được xác nhận.
- [ ] Ba stories có owner và dependency rõ ràng.
- [ ] Có 10–15 prompt fixtures được content owner xác nhận.
- [ ] Variable/metadata schema được review.
- [ ] Auth, entitlement và paid-content contracts ổn định.
- [ ] Isolated Vercel Preview data path sẵn sàng.

## Definition of Done

- [ ] Acceptance Criteria của từng story đạt.
- [ ] TypeScript, lint, unit/integration tests và production build pass.
- [ ] Variable compiler fixtures pass: blank, Unicode, multiline, braces, max length, optional/default.
- [ ] Cross-account entitlement và paid-body leakage tests pass.
- [ ] XSS/injection và cache-isolation tests pass.
- [ ] Mobile/desktop × VI/EN × Light/Dark được kiểm tra.
- [ ] Keyboard, screen reader basics và reduced-motion được kiểm tra.
- [ ] Không còn bug P0/P1.
- [ ] Có migration, PR, screenshots, test output và Vercel Preview URL.
- [ ] Independent QA và Product Owner chấp nhận.

## Dev Prompt

```text
Bạn là Senior Product Engineer phụ trách Sprint UX1 — Guided Prompt Workspace của ALIPROMPT.

SPRINT GOAL
Người dùng có thể biến một prompt miễn phí hoặc đã có entitlement thành prompt hoàn chỉnh, có hướng dẫn model/token rõ ràng và copy trong tối đa ba thao tác mà không làm lộ nội dung trả phí.

ENTRY GATE
- Chỉ bắt đầu implementation khi có exact S0_ACCEPTED, Product Owner Approval và isolated Vercel Preview data path.
- Xác nhận contract hiện có cho prompt detail, authentication, entitlement và protected paid body.
- Giữ nguyên dirty worktree; không reset hoặc ghi đè thay đổi ngoài sprint.
- Nếu gate chưa đạt, chỉ audit/refine contract và báo blocker; không tự đánh dấu sprint Active.

CORE SCOPE
1. Implement versioned Prompt Variable Builder với required/optional/default/example/help/validation, deterministic live preview, Reset và Copy generated prompt.
2. Implement stored/versioned Usage Metadata & Model Compatibility: model, language, difficulty, setup time, expected output, use cases, usage steps, last-tested status và prompt version.
3. Implement deterministic Token Estimate được ghi nhãn rõ là ước tính và copy formats Plain/Markdown; chỉ hỗ trợ JSON khi output schema hợp lệ.

SECURITY
- Server-side entitlement trước khi trả paid prompt body.
- Không đưa protected body vào HTML, RSC payload, public cache, metadata, logs hoặc analytics.
- Private response dùng private/no-store.
- Bound input; XSS/injection protection; negative cross-account tests.
- Không eval code hoặc gọi external AI/model provider.

UX/UI
- Mobile-first tại 360/390/430/768/1024/1440.
- Touch target 44×44px; không overflow hoặc CTA truncation.
- Desktop split form/preview; mobile stacked flow.
- VI/EN, Light/Dark/System, keyboard, screen reader và reduced motion.
- Có loading, invalid, entitlement-required, copy-success và copy-failure states.

OUT OF SCOPE
- Chatbot, RAG, vector database, external AI calls, fuzzy search, recommendation ML, collections, subscription và Production deploy.
- Không thay đổi ALIPROMPT-only seller invariant hoặc weaken paid-content protection.

IMPLEMENTATION ORDER
1. Audit prompt detail/data/auth/entitlement contracts và lập gap matrix.
2. Thiết kế additive versioned variable/metadata schema và rollback.
3. Implement server DTO allowlist với entitlement boundary.
4. Implement deterministic compiler và validation.
5. Implement responsive builder, preview, metadata và copy formats.
6. Implement deterministic token estimator.
7. Viết unit, integration, security và E2E tests.
8. Chạy independent QA trên isolated Vercel Preview.

OUTPUT
Trả: audit, decisions, files/migrations/env, implementation, tests, evidence, risks, rollback, remaining blockers và exact PO acceptance request.

Không đánh dấu Done nếu thiếu independent QA, Preview evidence hoặc còn P0/P1. Không deploy Production.
```

## Local update log

| Date | Change | Status |
| --- | --- | --- |
| 2026-08-19 | Tạo local sprint record và Dev Prompt UX1 v1.0.0 | Draft |

## Project-owner teach-back

- [ ] Vì sao UX1 chưa được giao Dev triển khai ngay dù prompt đã hoàn chỉnh?
- [ ] Nếu team capacity là 16 SP, guardrail 85% cho phép commit tối đa bao nhiêu và candidate scope cần được xử lý thế nào?
- [ ] Nêu hai vị trí mà protected paid prompt body tuyệt đối không được xuất hiện trước entitlement verification.
