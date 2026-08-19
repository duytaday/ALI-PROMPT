# ALIPROMPT Prompt Knowledge Network — Migration & Delivery Roadmap

`decision_id: AP-PDN-001`  
`migration_mode: additive_reversible`  
`production_actions: approval_gated`

## 1. Migration principle

Không biến đổi phá hủy bảng `prompts` hiện tại. Dùng expand → backfill → verify → dual-read/cutover → contract, với rollback ở mỗi bước.

Prompt cũ được bảo tồn như một self-answered Question:

```text
Legacy Prompt
├── Question: use case/title/context được suy ra hoặc đưa vào enrichment queue
└── Prompt Answer của contributor cũ
    ├── Prompt Version 1: legacy body
    └── Author Output Evidence: legacy prompt_media
```

## 2. Field mapping

| Current | Target | Quy tắc |
|---|---|---|
| `prompts.id` | migration map | giữ bảng `legacy_entity_map` để idempotent |
| `prompts.slug` | `questions.slug` | giữ slug nếu hợp lệ; redirect URL cũ |
| `title` | `questions.title` | không tự thêm claim chưa có trong dữ liệu |
| `summary` | question goal/context | thiếu thì `needs_enrichment=true` |
| `body` | `prompt_versions.prompt_body` | version 1, giữ nguyên attribution |
| `category_id` | vertical tag | preserve category; synonym hóa sau |
| `contributor_id` | question/answer author | null/guest → legacy unclaimed profile |
| `prompt_media` | author proof artifact | re-scan; tạo sanitized derivative |
| likes/dislikes | answer votes/counters | chỉ migrate per-user vote có identity; counter-only là legacy metric |
| favorites | question bookmarks | chỉ khi có user mapping |
| view count | question legacy views | ghi `legacy_view_count`, không giả thành unique views |
| reports | moderation case | open reports được ưu tiên review |

Không dựng vote giả từ aggregate counter. Nếu dữ liệu chỉ có `like_count`, lưu nó là historical display/analytics field và không tạo reputation event.

## 3. URL and SEO migration

- Mỗi Question có URL canonical `/questions/{id}/{slug}`.
- URL prompt cũ 301 tới Question tương ứng sau cutover.
- Modal-only detail được thay bằng trang crawlable có title, description và structured breadcrumbs.
- Duplicate Question vẫn có URL nhưng canonical/duplicate banner trỏ về Question chuẩn.
- Không index draft, pending, rejected, private artifact hoặc member email.

## 4. Delivery slices

### K0 — Contract, ADR and data audit

Outcome: xác nhận volume, quality, identity mapping, file types, moderation backlog và rollback constraints.

Acceptance:

- data inventory có row/file count, null distribution và PII map;
- ADR chốt aggregate, transaction boundary, artifact pipeline và search;
- WVSA instrumentation spec được owner/analytics review;
- không mutation production.

### K1 — Read-only canonical Question

Outcome: một prompt legacy render như Question + self-answer trên URL canonical.

Acceptance:

- legacy catalog vẫn hoạt động;
- old URL redirect/canonical behavior có test;
- public DTO không chứa email;
- media chỉ dùng sanitized approved variant;
- feature flag rollback tức thời.

### K2 — Ask and answer

Outcome: verified member tạo Question; member khác trả lời bằng Prompt Answer + output.

Acceptance:

- success, validation, unauthorized, upload rejection và moderation branches có test;
- answer không evidence không thể publish;
- Question suggestion hiển thị duplicate candidates trước submit;
- audit trail ghi publish/reject.

### K3 — Vote, accept, bookmark and attempt

Outcome: knowledge quality được đo tách biệt bằng vote và kết quả thử.

Acceptance:

- self-vote bị chặn server-side;
- vote idempotent/reversible;
- chỉ question owner accept answer thuộc question;
- Attempt bind exact Prompt Version;
- independent WVSA loại tác giả và moderation-rejected attempt.

### K4 — Search, tags and duplicate governance

Outcome: người dùng tìm được canonical solution theo ngành, tác vụ và model.

Acceptance:

- migrate 31 category thành vertical tags;
- task/model/output tags được seed có kiểm soát;
- synonym không tạo result silo;
- duplicate không tạo cycle và preserve signpost URL;
- lexical search đo zero-result và reformulation.

### K5 — Reputation signal and review queues

Outcome: đóng góp hữu ích được ghi nhận; moderator xử lý backlog có bằng chứng.

Acceptance:

- reputation ledger append-only, reversal idempotent;
- leaderboard không public PII và không xếp chỉ theo số bài;
- queues gồm first post, low quality, artifact risk, reports, duplicate và suggested edit;
- sensitive privilege vẫn manual/role trong MVP.

### K6 — Cutover and legacy contraction

Outcome: Question trở thành read model mặc định sau parity và rollback rehearsal.

Acceptance:

- backfill reconciliation 100% trên required entities hoặc exception ledger được owner chấp nhận;
- no orphan approved media;
- redirects, analytics continuity và sitemap verified;
- rollback rehearsal pass;
- xóa/contract legacy chỉ bằng migration riêng đã được approve.

## 5. Initial backlog

### MUST

- PII fix: loại email khỏi leaderboard/public DTO/cache/index;
- Question/Answer/Version/Artifact/Attempt schema + ADR;
- safe upload and moderation states;
- legacy mapping/backfill dry-run;
- canonical page and redirects;
- ask, answer, self-share;
- vote/accept/bookmark/attempt;
- tags/synonyms/duplicate;
- reputation ledger signal-only;
- analytics for WVSA and guardrails.

### BET

- “cần câu trả lời” feed để kích supply theo demand;
- tag-expert notifications;
- prompt comparison view;
- model-version health indicator.

### LATER

- bounty, privilege automation, semantic search, follow/chat, money-based incentives.

## 6. Instrumentation events

- `question_viewed`, `duplicate_suggestion_shown`, `question_submitted`;
- `answer_started`, `answer_submitted`, `answer_published`;
- `prompt_copied`, `question_bookmarked`;
- `attempt_started`, `attempt_submitted`, `attempt_moderated`;
- `answer_accepted`, `vote_cast`, `vote_reversed`;
- `report_opened`, `moderation_decided`;
- `search_performed`, `search_zero_result`, `search_result_opened`.

Mỗi event có anonymous/session privacy-safe id, authenticated user id khi hợp lệ, entity id, prompt version id khi liên quan, timestamp và schema version. Không log raw prompt, email, input/output file hoặc PII.

## 7. Release gates

- Privacy review: public queries/caches/search không lộ email hoặc private metadata.
- Security review: upload, authz, rate limit, vote abuse và moderation access.
- Data review: idempotent backfill, reconciliation, rollback và retention.
- QA: state transitions, concurrency, idempotency, accessibility và SEO.
- Product: outcome/acceptance khớp PRD; metric không phải vanity-only.
- Human approval: production migration, provider activation, domain/DNS và money remain separately gated.

## 8. Critical edge cases

- hai answer được accept đồng thời;
- vote đổi trong lúc reputation projection retry;
- prompt sửa sau khi có Attempt success;
- Question bị duplicate sau khi đã có answers;
- artifact sạch lúc upload nhưng moderation reject vì nội dung;
- user bị xóa/suspended nhưng contribution cần attribution;
- legacy prompt không có contributor, summary hoặc media;
- duplicate chain/cycle;
- model đổi tên/deprecate khiến success rate cũ gây hiểu lầm;
- creator và tester là cùng người hoặc cluster account;
- file mang MIME giả, EXIF GPS, malware hoặc decompression bomb.

## 9. Rollback strategy

- additive tables và backfill không xóa legacy source;
- feature flags riêng cho read path, write path, attempt, reputation và new ranking;
- dual-write chỉ sau khi có idempotency key và reconciliation;
- cutover read có thể quay lại catalog legacy mà không rollback data;
- outbox/reputation projection có replay cursor;
- public artifact publish dùng immutable keys, revoke bằng status/policy layer;
- contract/drop legacy là bước cuối, ngoài MVP và cần approval riêng.

## 10. Definition of Ready cho implementation task

Một slice chỉ Ready khi có active Product Contract reference, actor/outcome, exact scope/non-goals, data classification, business rules, applicable gates, acceptance branches, migration/rollback, analytics và reviewer binding. Roadmap này không tự cấp predecessor acceptance hoặc quyền mở sprint.
