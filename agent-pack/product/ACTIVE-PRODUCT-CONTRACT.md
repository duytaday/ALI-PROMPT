# ALIPROMPT Active Product Contract Record

`contract_id: ALIPROMPT-COMMERCE-COMMUNITY-V1`  
`version: 1.4.0`  
`status: approved_next`  
`last_audited: 2026-08-17`  
`decision_owner: ALIPROMPT human owner`

## Quyết định đã được owner chốt

Owner đã chọn **B — Commerce/community target active** trong phiên làm việc ngày 2026-08-17, qua các chỉ dẫn nối tiếp: xây full functional parity bằng brand ALIPROMPT, deploy trên Vercel, cho thành viên nạp prompt, và tổ chức việc hoàn thành theo từng sprint.

- `agent-pack/MASTER-PROMPT.md`, `agent-pack/PROMPT-CHO-CHAT-DEV.md`, `agent-pack/RUNBOOK.md` và `agent-pack/sprints/` là target contract `APPROVED NEXT`.
- `README.md`, implementation hiện tại và `docs/product-blueprint.md` là bằng chứng `CURRENT BASELINE/GAP`; chúng không còn là target cuối nếu mâu thuẫn với contract này.
- Theo quyết định owner `AP-PLATFORM-001` ngày 2026-08-18, target là native Next.js trên Vercel với PostgreSQL managed bởi Supabase, Vercel Blob và migration có rollback từ vinext/Cloudflare D1.
- Supabase trong scope hiện tại là PostgreSQL provider. Application tiếp tục dùng Drizzle/Postgres contract; Supabase Auth, Storage, Realtime, Edge Functions và Data API không tự động trở thành target nếu chưa có ADR, threat/data migration review và owner decision riêng.
- Runtime Vercel dùng connection pool phù hợp serverless đã verify; migration/backup tooling dùng direct/session connection phù hợp. Không dùng cùng một connection mode/credential cho mọi workload theo cảm tính.
- Drizzle migration files là schema migration authority hiện hành. Không chạy song song Drizzle migration và `supabase db push` như hai nguồn sự thật; thay đổi authority cần ADR và migration-history plan riêng.
- V1 có đúng một commercial seller là ALIPROMPT. Thành viên chỉ nạp prompt miễn phí qua draft/upload/moderation; họ không tự publish, đặt giá, nhận payout hay điều khiển commerce.
- Theo quyết định owner `AP-PDN-001` ngày 2026-08-17, community target vận hành như một Prompt Knowledge Network: Question mô tả bài toán, Prompt Answer cung cấp prompt + output, Attempt ghi lần thử độc lập, cộng đồng vote và người hỏi có thể accept một answer.
- Hai entry “Đặt bài toán” và “Chia sẻ prompt” dùng chung một domain model; chia sẻ prompt tạo self-answered Question. Prompt catalog hiện tại được migrate cộng thêm và có rollback, không bị rewrite phá hủy.
- Vote đo tính hữu ích, Attempt đo kết quả chạy; view/like/số bài không được dùng một mình làm quality truth hoặc reputation.
- Email và PII không được xuất hiện trong public profile, leaderboard, cache, search index hoặc analytics event.
- Guest submission bị tắt mặc định và chỉ được mở qua quyết định abuse/privacy riêng. Multi-vendor nằm ngoài V1 và cần product/security/legal contract mới.
- Production deployment, live provider activation, production migration, DNS/domain/alias và tiền thật vẫn là các action gate cần phê duyệt riêng; approval target không phải approval thực hiện các action đó.

S0 phải kiểm chứng repository state, hoàn thiện KPI/guardrail còn `TBD`, ADR và acceptance; không được mở lại lựa chọn A/B trừ khi xuất hiện chỉ dẫn owner mới mâu thuẫn rõ ràng.

## Current implementation evidence

- `README.md:50`: V1 chưa có payment, learner dashboard, LMS hoặc model runtime; form đang thu lead để kiểm chứng nhu cầu và vận hành workshop thủ công.
- `docs/product-blueprint.md:95-105`: community prompt marketplace, subscription/cart/coupon/affiliate và các nền tảng lớn khác nằm ngoài V1 education funnel.
- `docs/product-blueprint.md:107-112`: chỉ mở rộng khi có trigger từ funnel và vận hành thật.

## Approved target contract

- `agent-pack/RUNBOOK.md` và `agent-pack/MASTER-PROMPT.md` mô tả chương trình build single-vendor paid commerce cộng moderated free community contribution.
- Target giữ đúng một commercial seller là ALIPROMPT; contributor chỉ gửi prompt miễn phí và không có payout/commission/KYC.
- Community target chi tiết nằm tại `PROMPT-KNOWLEDGE-NETWORK-PRD.md`, `PROMPT-KNOWLEDGE-DOMAIN-MODEL.md`, `PROMPT-KNOWLEDGE-MIGRATION-ROADMAP.md` và `PROMPT-KNOWLEDGE-ACCEPTANCE-MATRIX.md`.

## Điều chưa được phép suy luận

- Không gọi hai phạm vi trên là cùng một active V1.
- Không gọi milestone M1–M5 là capability đã implemented, verified hoặc released.
- Không gọi target là implemented/verified/released chỉ vì agent-pack đã được owner duyệt.
- Không đổi sang multi-vendor khi chưa có product-mode decision riêng.

## Decision record

- Contract ID: `ALIPROMPT-COMMERCE-COMMUNITY-V1`
- Version: `1.4.0`
- Active source: `agent-pack/MASTER-PROMPT.md`, Vietnamese equivalent, runbook, domain/deployment contracts, sprint prompts, `AP-PDN-001` knowledge-network artifacts and `AP-PLATFORM-001` Vercel+Supabase provider decision
- Current baseline source: repository implementation, `README.md`, `docs/product-blueprint.md`
- Superseded/informational sources: education-funnel scope remains historical/current-state evidence, not the approved destination
- Approver: ALIPROMPT human owner
- Effective date: `2026-08-17`
- Customer outcome: ask or find a concrete AI task, compare evidenced Prompt Answers, run a specific Prompt Version and contribute a trustworthy result signal; users may separately discover and buy ALIPROMPT products
- Business outcome: launch safe single-seller prompt commerce plus a moderated prompt knowledge network whose reusable problem/solution/evidence graph improves discovery and trust
- North-star/leading metric: `Weekly Verified Successful Attempts (WVSA)`; absolute target remains `TBD_IN_S0_WITH_OWNER` and agents must not invent a target value
- Guardrails: no protected-body/PII leak; no contributor commerce authority; accessible public journeys; verified payment/entitlement integrity; reversible migration
- Committed scope: the versioned mandatory capability baseline and S0–S7 roadmap in the agent pack, refined for community by decision `AP-PDN-001`
- Non-goals: multi-vendor, contributor pricing/revenue/payout/KYC/tax allocation, copied reference assets/code/copy, unauthorized Production actions
- Backlog/acceptance/metric impact: commerce/community backlog and `AP-PDN-001` knowledge-network artifacts are `APPROVED NEXT`; S0 validates baseline data, locks target values and shapes implementation slices without calling them CURRENT
- Revisit trigger: explicit owner superseding decision, material legal/security/provider constraint, Supabase plan/network/pooling/backup evidence that invalidates the target, or S0 evidence proving the contract infeasible as written

## Safe default cho agent

- Treat contract này là `APPROVED NEXT`, không phải bằng chứng implementation.
- S0 vẫn audit read-only và không sửa application code; S1–S7 chỉ chạy khi exact predecessor acceptance, mọi applicable-gate evidence và reviewer binding hợp lệ.
- PO làm rõ KPI/guardrail và scope ambiguity nhưng không được âm thầm hạ target về education funnel.
- Orchestrator chỉ giao đúng sprint hiện tại; Architect không tự mở multi-vendor hoặc Production action.
- QA không thể biến approval, plan hay tài liệu thành release evidence.
