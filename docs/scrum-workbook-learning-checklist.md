# ALIPROMPT Scrum Workbook — Running Understanding Checklist

`session_updated: 2026-08-19`  
`status: sprint_s0_closed_awaiting_owner_teach_back`

Chỉ đánh dấu “đã hiểu” sau khi chủ dự án có thể tự giải thích quy tắc và áp dụng vào một tình huống thực tế.

## 1. Vấn đề và nguyên nhân

- [ ] Giải thích vì sao workbook là nguồn sự thật duy nhất và sprint cũ không được sửa để làm đẹp số liệu.
- [ ] Phân biệt story, task, bug, risk, blocker, dependency và release.
- [ ] Giải thích vì sao dòng `SAMPLE-*` không được tính vào metric chính thức.
- [ ] Nhận ra S0 đang Blocked vì thiếu quyết định owner, nguồn dữ liệu Preview/Supabase cô lập và verdict QA độc lập.

## 2. Business logic lập sprint

- [ ] Phân biệt Definition of Ready với Definition of Done.
- [ ] Giải thích vì sao task Done không tự động làm parent story Done.
- [ ] Giải thích vì sao story points chỉ được tính Completed khi story đạt DoD và có bằng chứng chấp nhận.
- [ ] Chỉ commit story có `DoR = Ready`; không dùng priority hoặc RICE để vượt qua readiness gate.
- [ ] Dùng tối đa 85% team capacity và giữ tối thiểu 15% cho bug/phát sinh.
- [ ] Chọn story theo business value, priority, dependency và capacity; RICE chỉ là tín hiệu hỗ trợ.
- [ ] Chia story thành task kỹ thuật có owner, dependency, Acceptance Criteria và evidence expectation.
- [ ] Carry-over, trả backlog hoặc hủy story chưa xong phải có lý do và dấu vết quyết định.

## 3. Edge cases

- [ ] Không tạo sprint mới từ placeholder hoặc dữ liệu owner/capacity/ngày tháng được suy đoán.
- [ ] Không commit K1 khi chưa có exact `S0_ACCEPTED` và PO Approval.
- [ ] Không đánh dấu Done nếu chưa có test/QA/Preview evidence tương ứng.
- [ ] Dashboard Green không phải quyền tự động deploy Production.

## 4. Trạng thái review live ngày 2026-08-19

- [x] S0 có 5 điểm committed, 0 điểm completed và 100% spillover.
- [x] `ALI-S0-001` đang Blocked, `PO Approval = Pending`, `DoR = Not Ready`.
- [x] Các story K1–K7 và Platform đều `PO Approval = Pending`, `DoR = Not Ready`.
- [x] Hai retrospective action chính thức chưa hoàn thành: một In Progress, một To Do.
- [x] Ba gate mức 25 đang mở: owner decisions, nguồn Supabase/Preview cô lập và independent QA acceptance.
- [x] Chưa có story chính thức nào hợp lệ để commit vào sprint mới.

## Teach-back đang chờ

1. Vì sao `S0-T01` Done nhưng Completed Story Points của S0 vẫn bằng 0?
2. Vì sao không được đưa `ALI-K1-001` vào sprint mới ngay lúc này?
3. Nếu team capacity là 20 story points, mức commit tối đa theo guardrail 85% là bao nhiêu?

## 5. Sprint S0 closure — 2026-08-19

- [x] Đối chiếu HEAD `944121f`, dirty worktree và trạng thái không có Git remote/PR evidence.
- [x] Chạy lại `npm test`: build pass, 35 Node tests và 1 TypeScript test pass.
- [x] Chạy lại lint, task-contract validator và `git diff --check`: pass.
- [x] Xác nhận handoff S0 vẫn `overallStatus = partial`; không có exact `S0_ACCEPTED`.
- [x] Xác nhận không có Vercel Preview URL hay isolated Supabase inventory/evidence.
- [x] Phân loại `ALI-S0-001` là Carry-over 5 SP; Accepted 0, Rejected 0, Returned to Backlog 0.
- [x] Chốt metrics: Completion 0%, Spillover 100%, Scope Change 0%, Velocity 0, Defect Rate 0%.
- [x] Release readiness Red/Hold; không có quyền Production deployment.
- [x] Retrospective có đúng 3 action item với owner, deadline và success metric.

### Teach-back bổ sung

4. Vì sao test local pass hoàn toàn nhưng Sprint Goal vẫn không đạt?
5. Ba evidence còn thiếu để `ALI-S0-001` có thể được PO chấp nhận là gì?

## Cập nhật Sprint UX1 — Guided Prompt Workspace (2026-08-19)

- [ ] Giải thích vì sao UX1 ưu tiên biến prompt detail thành một work surface thay vì tiếp tục thêm animation hoặc lặp lại Favorites/Library đã có nền tảng.
- [ ] Phân biệt ba core story: Variable Builder, Usage Metadata & Model Compatibility, Token Estimate & Copy Formats.
- [ ] Giải thích vì sao token count chỉ là ước tính deterministic và không được tuyên bố là chi phí model chính xác.
- [ ] Giải thích vì sao prompt trả phí phải được kiểm tra entitlement ở server trước khi body được chuyển cho variable compiler.
- [ ] Nhận ra UX1 hiện là `Draft / Not committed`: chưa có ngày, capacity hoặc quyền triển khai khi chưa có exact `S0_ACCEPTED` và PO Approval.
- [ ] Biết rằng 16 story points là candidate scope, không phải sprint commitment, cho đến khi team capacity được xác nhận và cả ba story đạt Definition of Ready.

### Bằng chứng đã ghi vào workbook

- [x] `Product Backlog`: `ALI-UX1-001` đến `ALI-UX1-003`.
- [x] `Sprint Planning`: ba dòng UX1 có `Committed = No`, `PO Approved = Pending`.
- [x] `Risks & Dependencies`: entry dependency, paid-body leak risk và content-fixture assumption.
- [x] `Sprint Prompts`: Dev Prompt UX1 phiên bản `1.0.0`, trạng thái `Draft`.
- [x] `Project Overview`: UX1 được ghi là proposed next sprint; Current Sprint vẫn là S0.

### Teach-back tiếp theo

6. Vì sao Dev chưa được bắt đầu UX1 dù prompt và backlog đã được chuẩn bị đầy đủ?
7. Nếu team capacity được xác nhận là 16 points, guardrail 85% cho phép commit tối đa bao nhiêu points và cần xử lý candidate scope 16 points thế nào?
8. Nêu hai vị trí mà protected paid prompt body tuyệt đối không được xuất hiện trước khi entitlement được xác minh.

## Cập nhật Sprint OPS1 — Vercel + Supabase Readiness (2026-08-19)

- [ ] Phân biệt runtime transaction-pool connection với direct/session migration connection.
- [ ] Giải thích vì sao Drizzle phải là migration authority duy nhất và remote schema không được chỉnh tay ngoài approved emergency procedure.
- [ ] Giải thích vì sao `engines.node = ">=22.13.0"` không đảm bảo Vercel sẽ chọn Node 22 và vì sao cần pin major rõ ràng.
- [ ] Giải thích vì sao Preview và Production cần resource boundaries riêng cho PostgreSQL, Blob và secrets.
- [ ] Phân biệt liveness `/api/health` với dependency readiness `/api/readiness`.
- [ ] Biết rằng OPS1 chỉ được promote Production sau migration/rollback rehearsal, Preview E2E, zero P0/P1, independent QA và explicit Product Owner approval.

### Bằng chứng local

- [x] Sprint record và Master Dev Prompt: `docs/sprints/OPS1-vercel-supabase-readiness.md`.
- [x] Prompt giữ Supabase ở vai trò PostgreSQL provider; không tự thêm Auth/Storage/Realtime/Data API.
- [x] Prompt tách `POSTGRES_URL` và `POSTGRES_MIGRATION_URL`.
- [x] Prompt giữ Production deployment ngoài quyền cho tới khi owner phê duyệt.

### Teach-back OPS1

9. Vì sao application runtime nên dùng transaction pooler nhưng migration không nên dùng cùng connection contract?
10. `/api/readiness` cần kiểm tra thêm những gì ngoài `select 1`?
11. Bốn điều kiện tối thiểu nào phải đạt trước Production promotion?

## Cập nhật Sprint LIB1 — Personal Prompt Workspace (2026-08-19)

- [ ] Giải thích vì sao Collections, Recently Used và Personal Notes là bước tiếp theo hợp lý sau Favorites/Library và Guided Prompt Workspace.
- [ ] Phân biệt Favorite với Collection membership; add/remove Collection không được tự thay đổi Favorite.
- [ ] Giải thích vì sao usage chỉ được ghi sau Copy success và history không được chứa generated prompt, variables hoặc clipboard content.
- [ ] Giải thích vì sao mọi private query phải owner-scope tại server dù database được host trên Supabase.
- [ ] Biết rằng `START LIB1` cho phép local/Preview implementation nhưng không cho phép Production deployment.
- [ ] Biết rằng 16 SP là candidate scope và phải được fit trong guardrail tối đa 85% capacity trước khi commit.

### Bằng chứng local

- [x] Sprint record và Master Dev Prompt: `docs/sprints/LIB1-personal-prompt-workspace.md`.
- [x] Scope gồm Private Collections 8 SP, Recently Used 5 SP và Private Notes 3 SP.
- [x] Prompt bảo vệ paid prompt body, generated prompt, variable values, clipboard và personal notes.
- [x] Production deployment vẫn nằm ngoài quyền cho tới khi có approval riêng sau Preview acceptance.

### Teach-back LIB1

12. Vì sao add một prompt vào Collection không nên tự động bật Favorite?
13. History được phép lưu metadata nào và tuyệt đối không được lưu nội dung nào?
14. Khi xóa một Collection, dữ liệu nào được phép bị xóa và dữ liệu nào phải được giữ nguyên?

## Cập nhật DATA10K — 10.000 Visual Design Prompts + Demo Images (2026-08-19)

- [ ] Giải thích vì sao target là 10.000 canonical prompts, không phải 5.000 ý tưởng nhân đôi VI/EN.
- [ ] Giải thích vì sao 10.000 prompt và ảnh không được sinh/import trong một lần không có pilot.
- [ ] Phân biệt `placeholder_cover` với `generated_demo` đại diện được tạo từ exact prompt version.
- [ ] Giải thích vì sao deterministic code phải làm schema/count/hash/dedupe/import thay vì tiêu tốn model tokens.
- [ ] Hiểu model routing: economy/high-volume cho bounded normalization, balanced cho drafting/review, frontier cho rubric/safety/migration/final audit.
- [ ] Giải thích vì sao 10.000 generated drafts ở Preview không được tự động thành 10.000 published prompts.
- [ ] Biết rằng roadmap chỉ cho 150–300 human-reviewed publish candidates ở wave đầu nếu chưa có approved change request.
- [ ] Biết paid 10.000-image run cần cost/storage projection, spend ceiling và exact approval.

### Bằng chứng local DATA10K

- [x] Master Dev Prompt: `docs/sprints/DATA1-codex-10000-visual-design-prompts.md`.
- [x] Multi-agent controller/role prompts VI: `docs/sprints/DATA10K-multi-agent-dev-prompts-VI.md`.
- [x] English controller prompt: `docs/sprints/DATA10K-multi-agent-dev-prompts-EN.md`.
- [x] Scope tập trung 25 nhóm prompt image/design, candidate quota 400 canonical prompts/category.
- [x] Mỗi canonical prompt yêu cầu VI/EN, design metadata, provenance và representative generated demo.
- [x] Delivery chia G0 → pilot 100 → 1.000 → 10.000 Preview → human-reviewed publish wave.
- [x] Prompt cấm copy PromptVN, living-artist imitation, copyrighted characters, public figures và fake engagement.
- [x] Production import/publish vẫn chưa được cấp quyền.

### Teach-back DATA10K

15. Nếu có 5.000 ý tưởng, mỗi ý tưởng có VI và EN, target canonical count là 5.000 hay 10.000? Vì sao?
16. Vì sao một ảnh cover render từ template không chứng minh prompt image-generation tạo ra kết quả tốt?
17. Trước khi chạy 10.000 ảnh trả phí, ba loại bằng chứng/phê duyệt tối thiểu cần có là gì?
18. Vì sao chỉ Orchestrator được sửa shared manifest và vì sao Batch Generator chỉ được ghi batch path riêng?
