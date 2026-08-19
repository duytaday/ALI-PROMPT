# DEV GOAL — ALIPROMPT Prompt Knowledge Network

`goal_id: DEV-GOAL-PDN-001`  
`status: active`  
`product_contract: ALIPROMPT-COMMERCE-COMMUNITY-V1 v1.4.0`  
`decisions: AP-PDN-001, AP-PLATFORM-001`  
`owner: ALIPROMPT human owner`  
`delivery_owner: lead-dev-orchestrator`

## Goal statement

Cập nhật ALIPROMPT từ prompt catalog một tầng thành Prompt Knowledge Network có thể kiểm chứng, vận hành an toàn trên Next.js/Vercel với PostgreSQL/Supabase, mà không mất dữ liệu legacy hoặc làm yếu single-seller commerce.

## User outcome

Ba người dùng độc lập hoàn thành hành trình:

1. User A đăng một Question mô tả bài toán.
2. User B trả lời bằng Prompt Answer có Prompt Version và Output Evidence.
3. Moderator publish đúng quyền; User A chạy và accept answer.
4. User C thử đúng version, gửi Attempt success/partial/failed và output tùy chọn.
5. Vote, accepted answer, Attempt và reputation được ghi đúng vai trò, không đếm trùng.
6. Người dùng sau tìm thấy canonical Question theo search/tag/duplicate và đánh giá được bằng chứng.

## Business outcome

- Tích lũy đồ thị `problem → solution → version → evidence → verified result`.
- North-star `WVSA` đo independent approved successful attempts, không dùng view/like/số bài làm quality truth.
- ALIPROMPT vẫn là commercial seller duy nhất; community contribution luôn free và không có pricing/payout authority.

## Technical outcome

- Modular monolith Next.js trên Vercel.
- Supabase managed PostgreSQL; application dùng provider-neutral Postgres/Drizzle contract.
- Drizzle là migration authority; runtime/migration connection modes tách đúng workload.
- Raw upload ở private quarantine; chỉ sanitized approved output được public.
- Development/Preview/Production tách DB, Blob, secrets, callbacks, caches và provider modes.
- Migration legacy additive, idempotent, reconciliation được và rollback được.

## Delivery sequence

| Slice | Outcome | Exit evidence |
|---|---|---|
| K0 | Repo/data audit, ADR, Task Contract, baseline | exact sprint/gate acceptance; không app code nếu chưa được phép |
| K1 | Legacy prompt render thành canonical Question + self-answer | public DTO không PII; redirect/canonical; feature-flag rollback |
| K2 | Ask, Answer, self-share, Prompt Version và safe evidence | PK-01–PK-06; moderation/audit; no partial graph |
| K3 | Vote, accept, bookmark, Attempt, WVSA và version history | PK-07–PK-13; concurrency/idempotency/authz |
| K4 | Search, tags, synonyms và duplicate governance | PK-14–PK-15, PK-20; SEO/no-cycle/zero-result |
| K5 | Reputation ledger, review queues và privacy-safe leaderboard | PK-16–PK-17, PK-21–PK-22; abuse/reversal evidence |
| K6 | Backfill reconciliation, Preview, rollback rehearsal và release packet | PK-18–PK-19, PK-23–PK-24; QA GO; P0/P1 = 0 |

K-slice phải được map vào canonical sprint S0–S7 trong từng Task Contract. Không dùng K-label để bỏ predecessor acceptance hoặc applicable gates.

## Definition of Done

Goal chỉ hoàn thành khi đồng thời đạt:

- [ ] Core multi-user journey chạy trên isolated Preview với synthetic accounts.
- [ ] PK-01–PK-24 có PASS evidence hoặc approved scope rationale hợp lệ; không có release-blocking `NOT_RUN`.
- [ ] Prompt legacy migrate thành self-answered Question; không tạo synthetic vote/reputation.
- [ ] Prompt edit append version; Attempt cũ không bị chuyển version.
- [ ] Vote/accept/Attempt/WVSA/reputation idempotent và chống self-action/race.
- [ ] Public UI/API/HTML/RSC/cache/search/log/analytics không lộ email, secret, private Blob URL hoặc moderation evidence.
- [ ] Upload MIME/magic/size/pixel/page/malware/metadata/quarantine/sanitization tests pass.
- [ ] Drizzle fresh/upgrade/backfill/retry/reconciliation pass trên disposable Supabase environment.
- [ ] Preview không truy cập Production Supabase/Vercel resources.
- [ ] `ai:validate`, task validator, lint, test và build pass trên exact candidate.
- [ ] Accessibility, responsive, SEO/canonical/noindex và security regression pass.
- [ ] Independent QA verdict là GO, P0/P1 = 0.
- [ ] Backup/restore, cutover và rollback được rehearsal; observability/alerts có owner.
- [ ] Production deployment packet đầy đủ và đang chờ/đã có approval action-specific.

## Non-goals

- Supabase Auth, Storage, Realtime, Edge Functions hoặc Data API nếu chưa có quyết định mới.
- Multi-vendor, contributor pricing/payout/KYC/revenue share.
- Bounty bằng tiền, auto-moderation privilege hoặc vector search trong MVP.
- Drop legacy tables, Production migration/deploy, provider install, DNS hoặc live money không có phê duyệt riêng.

## Required source files

- `ACTIVE-PRODUCT-CONTRACT.md`
- `PROMPT-KNOWLEDGE-NETWORK-PRD.md`
- `PROMPT-KNOWLEDGE-DOMAIN-MODEL.md`
- `PROMPT-KNOWLEDGE-MIGRATION-ROADMAP.md`
- `PROMPT-KNOWLEDGE-ACCEPTANCE-MATRIX.md`
- `../PROMPT-IMPLEMENT-PROMPT-KNOWLEDGE-NETWORK.md`
- `../PROMPT-QA-PROMPT-KNOWLEDGE-NETWORK.md`
- `../PROMPT-DEVOPS-PREPARE-VERCEL-DEPLOY.md`

## First dev action

```text
Đọc agent-pack/product/DEV-GOAL-PROMPT-KNOWLEDGE-NETWORK.md và agent-pack/PROMPT-IMPLEMENT-PROMPT-KNOWLEDGE-NETWORK.md. Audit current repo, exact sprint/predecessor evidence và dirty worktree; tạo Task Contract cho đúng một slice. Nếu chưa có predecessor acceptance hợp lệ, chỉ chạy S0/K0, không sửa application code và dừng với evidence handoff.
```

## Stop and escalation

Dừng phần bị ảnh hưởng khi thiếu exact predecessor acceptance, ownership conflict, migration/rollback evidence, QA candidate identity, provider/plan/region/policy decision hoặc action-specific Production approval. Báo exact blocker, impact, owner và cheapest safe next action; không tự hạ gate.
