# AliPrompt Product Owner — Running Understanding Checklist

`session_started: 2026-08-17`  
`status: awaiting_owner_teach_back`

Không đánh dấu “đã hiểu” chỉ vì prompt hoặc tài liệu đã được tạo. Chỉ đánh dấu khi chủ dự án tự giải thích được quyết định, áp dụng đúng vào một tình huống, hoặc xử lý được edge case.

## Cổng 0 — Team OS và quyền quyết định

- [ ] Phân biệt được Active Product Contract (product truth) với Task Contract (work order giới hạn scope) và JSON handoff (bằng chứng machine-readable).
- [ ] Giải thích được vì sao task contract không được đổi product mode, waive QA/security gate hoặc gọi sprint kế tiếp.
- [ ] Giải thích được vì sao quality-command runner chỉ tạo technical evidence, không phải release verdict hay production approval.

## Cổng 1 — Hiểu đúng vấn đề và vai trò

- [ ] Giải thích được vì sao AliPrompt cần Product Owner riêng dù đã có Orchestrator và Platform/Product Architect.
- [ ] Phân biệt được PO sở hữu **xây gì, vì sao, ưu tiên nào và đo bằng gì**; Architect/Engineering sở hữu **xây bằng cách nào**.
- [ ] Phân biệt được Product Owner với Project Manager, Business Analyst, Product Manager và Tech Lead.
- [ ] Nêu được ba nhánh nhu cầu người dùng: prompt cho một tác vụ, assistant có hành vi ổn định, và agent cho workflow nhiều bước.
- [ ] Giải thích được vì sao feature request, ý tưởng founder và chức năng của đối thủ chưa tự động trở thành backlog `must`.

### Giả định đang dùng

- PO phục vụ toàn bộ AliPrompt.vn, từ discovery đến delivery và đo kết quả cho hành trình Prompt → Assistant → Agent.
- Founder giữ quyền phê duyệt cuối về vision, pricing, chính sách, cam kết pháp lý, production release và thay đổi phạm vi lớn.
- PO không tự deploy, charge/refund, publish, đổi dữ liệu production hoặc chấp nhận rủi ro security/legal.
- Bằng chứng repo và dữ liệu khách hàng là nguồn sự thật; prompt gốc là nền tảng phương pháp, không phải bằng chứng thị trường.

## Cổng 2 — Hiểu giải pháp và quyết định thiết kế

- [ ] Mô tả được chu trình `evidence → problem → hypothesis → experiment/slice → metric → decision`.
- [ ] Viết được một Product Outcome có người dùng, thay đổi hành vi và chỉ số; không chỉ là danh sách feature.
- [ ] Chuyển được một yêu cầu thành problem statement, giả định, acceptance criteria và tiêu chí go/pivot/stop.
- [ ] Giải thích được thứ tự ưu tiên dựa trên giá trị, bằng chứng, rủi ro, effort và dependency.
- [ ] Phân biệt được discovery backlog, delivery backlog, experiment và technical enabler.
- [ ] Giải thích được Definition of Ready khác Definition of Done và acceptance criteria khác task kỹ thuật.
- [ ] Nêu được khi nào PO phải giao cho Architect, Security, Data, UX hoặc QA thay vì tự quyết.
- [ ] Phân biệt được product contract (xây sản phẩm gì) với delivery contract (ví dụ target Vercel/Postgres) và current runtime evidence.
- [ ] Giải thích được vì sao sprint sau không được bắt đầu chỉ vì có roadmap; exact `predecessorAcceptance`, toàn bộ `applicableGates`, `exitAcceptance` và reviewer evidence phải đạt.

## Cổng 3 — Hiểu nhánh và edge case

- [ ] Xử lý được yêu cầu “copy hết tính năng đối thủ” khi chưa có bằng chứng giá trị và có ranh giới clean-room.
- [ ] Xử lý được feature có doanh thu tiềm năng nhưng rủi ro dữ liệu/pháp lý cao.
- [ ] Xử lý được stakeholder khẩn cấp nhưng yêu cầu xung đột với outcome đã khóa.
- [ ] Xử lý được dữ liệu thiếu hoặc mâu thuẫn mà không bịa số liệu hay tạo roadmap chắc chắn giả.
- [ ] Biết khi nào nên chạy interview/concierge/prototype thay vì viết production code.
- [ ] Biết khi nào phải dừng release vì acceptance, security, payment, entitlement hoặc dữ liệu bảo vệ chưa đạt.
- [ ] Xử lý được metric tăng nhưng outcome khách hàng giảm hoặc xuất hiện gaming/vanity metric.

## Cổng 4 — Hiểu tác động kinh doanh và vận hành

- [ ] Nối được product ladder với outcome và điều kiện chuyển tầng, không upsell chỉ vì có sản phẩm.
- [ ] Chọn được north-star và guardrail metrics cho discovery, activation, conversion, learning và retention.
- [ ] Giải thích được tác động của ưu tiên backlog tới thời gian founder, support burden, margin và learning velocity.
- [ ] Mô tả được cadence discovery, backlog refinement, review và weekly product review.
- [ ] Nêu được decision log và evidence ledger giúp tránh đổi hướng theo cảm tính như thế nào.
- [ ] Giải thích được một quyết định go, pivot hoặc stop bằng fact/inference/assumption/estimate/unknown.

## Bằng chứng hiện có

- [x] Prompt nguồn đã được đọc đầy đủ và cấu trúc phương pháp đã được phân tích.
- [x] Repo đã được kiểm tra và khoảng trống Product Owner độc lập đã được xác định.
- [x] Product Owner song ngữ, skill, schema registry, routing, quality gates, scenario suite và starter artifacts đã được tích hợp vào agent-pack v1.2.
- [x] Static validation đã xác nhận 9 cặp agent, 13 skill contracts, 16 PO scenarios, 8 cặp sprint và hai schema đều chấp nhận `product-owner`; toàn bộ relative link được quét đều resolve.
- [x] Starter S0 đã có đủ canonical sprint envelope; teach-back tương tác được tách khỏi lượt machine handoff JSON-only.
- [x] Phase A Team OS đã được tích hợp: task-contract template/validator, prose review notes và technical-quality runner có guardrail; không copy role/hook generic cạnh tranh với agent-pack.
- [x] `TASK-TEAM-OS-001` pass validator/self-test; `npm run ai:validate`, `npm run lint` và `npm test` đều pass.
- [x] PromptVN đã được khảo sát read-only: catalog 31 danh mục, submit prompt + ảnh, tìm kiếm, like/dislike/favorite/report và leaderboard đã được tách thành CURRENT reference evidence.
- [x] Owner đã chốt community direction AP-PDN-001: Question → Prompt Answer + Output → Attempt → vote/accept/reputation; “Chia sẻ prompt” là self-answered Question.
- [x] PRD, domain/data model, migration roadmap và acceptance matrix cho Prompt Knowledge Network đã được tạo và gắn vào Active Product Contract ở trạng thái APPROVED NEXT.
- [x] Prompt triển khai cho dev đã được tạo, khóa business invariants, K0–K6, test/rollback và yêu cầu exact sprint predecessor trước code.
- [x] Prompt QA độc lập và DevOps `PREPARE_ONLY` đã được tạo; QA giữ technical verdict, còn Production deploy/migration/provider/domain/live-money vẫn cần human approval riêng.
- [x] Owner đã chọn AP-PLATFORM-001: Next.js deploy trên Vercel, PostgreSQL trên Supabase; Drizzle giữ migration authority và Supabase Auth/Storage/Realtime không được mở ngầm.
- [x] Dev Goal DEV-GOAL-PDN-001 đã được kích hoạt và ghi thành goal brief với outcome, K0–K6, Definition of Done và Production stop conditions.
- [ ] Phạm vi PO đã được chủ dự án xác nhận bằng lời.
- [ ] Chủ dự án đã teach-back Cổng 1.
- [ ] Chủ dự án đã xử lý một scenario ưu tiên ở Cổng 2–3.
- [ ] Chủ dự án đã nối một quyết định PO với tác động kinh doanh ở Cổng 4.

## Teach-back đang chờ

Hãy tự giải thích ngắn bằng 4–6 câu:

1. Active Product Contract, Task Contract và JSON handoff khác nhau ở đâu?
2. PO của AliPrompt chịu trách nhiệm cho quyết định nào, và việc nào thuộc Architect/Engineering/QA?
3. Khi founder đề nghị một feature mới, PO cần bằng chứng gì trước khi biến nó thành `must`?
4. Vì sao một target ở trạng thái `APPROVED NEXT` vẫn chưa được gọi là `CURRENT`?

## Cổng 5 — Prompt Knowledge Network AP-PDN-001

- [ ] Giải thích được vì sao đơn vị trung tâm là Question/bài toán, không phải prompt post đứng riêng.
- [ ] Giải thích được “Đặt bài toán” và “Chia sẻ prompt” khác UI nhưng dùng chung domain model như thế nào.
- [ ] Phân biệt được vote, accepted answer và Attempt; nêu được vì sao không gộp chúng thành rating 1–5 sao.
- [ ] Giải thích được vì sao Prompt Version bắt buộc khi output/Attempt có thể được tạo ở các thời điểm và model khác nhau.
- [ ] Mô tả được cách migrate prompt cũ thành self-answered Question mà không tạo vote/reputation giả.
- [ ] Nêu được vì sao email không được xuất hiện trong leaderboard và upload phải qua quarantine/scan/sanitization.
- [ ] Nêu được north-star WVSA và ít nhất ba guardrail chống vanity/gaming/abuse.

### Teach-back Cổng 5 đang chờ

Hãy mô tả bằng lời một vòng hoàn chỉnh từ lúc người A đặt bài toán, người B đăng prompt + output, người A accept, đến lúc người C thử lại. Trong phần trả lời, phân biệt rõ vote với Attempt và nói Prompt Version bảo vệ dữ liệu lịch sử như thế nào.
