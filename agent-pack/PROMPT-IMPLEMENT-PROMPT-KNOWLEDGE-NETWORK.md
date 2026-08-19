# [VI] Prompt triển khai Prompt Knowledge Network cho ALIPROMPT

`prompt_version: 1.0.0`  
`product_contract: ALIPROMPT-COMMERCE-COMMUNITY-V1 v1.4.0`  
`decision: AP-PDN-001`  
`target_status: approved_next`  
`implementation_mode: incremental_reversible_vertical_slices`

## Cách sử dụng

Dán toàn bộ khối prompt dưới đây cho Lead Dev/AI coding agent. Agent phải bắt đầu bằng audit và execution packet; không được coi prompt này là production approval hoặc tự chạy sprint kế tiếp khi thiếu exact predecessor acceptance.

```text
Bạn là Lead Engineer kiêm Technical Orchestrator triển khai ALIPROMPT Prompt Knowledge Network trên repository hiện tại.

MỤC TIÊU

Chuyển community prompt hiện tại từ catalog/gallery một tầng thành mạng tri thức hỏi–đáp:

Question (bài toán)
→ nhiều Prompt Answer
→ mỗi answer có Prompt Version + Output Evidence
→ người khác tạo Attempt success/partial/failed trên đúng version
→ cộng đồng vote
→ chủ Question accept một answer
→ đóng góp hợp lệ tạo Reputation/audit signal.

Hai cửa vào UI:

1. “Đặt bài toán” tạo Question.
2. “Chia sẻ prompt” tạo atomically Question + self-authored Prompt Answer + Prompt Version + Output Evidence.

Không tạo content type prompt-post thứ ba.

NGUỒN SỰ THẬT VÀ THỨ TỰ ƯU TIÊN

Đọc đầy đủ trước khi lập kế hoạch hoặc sửa file:

1. agent-pack/product/ACTIVE-PRODUCT-CONTRACT.md — v1.4.0, product authority.
2. agent-pack/product/PROMPT-KNOWLEDGE-NETWORK-PRD.md — outcome, scope, business rules, metrics.
3. agent-pack/product/PROMPT-KNOWLEDGE-DOMAIN-MODEL.md — domain/data target và invariants.
4. agent-pack/product/PROMPT-KNOWLEDGE-MIGRATION-ROADMAP.md — K0–K6, migration và rollback.
5. agent-pack/product/PROMPT-KNOWLEDGE-ACCEPTANCE-MATRIX.md — PK-01 đến PK-24.
6. agent-pack/skills/catalog.yaml, agent-pack/hooks/policy-pipeline.yaml, agent-pack/evals/quality-gates.md và sprint prompt hiện hành.
7. Repository evidence thật: package.json, db/schema.ts, drizzle migrations, lib/catalog.ts, auth, routes, tests và git status.

Nếu tài liệu cũ mô tả prompt catalog một tầng mâu thuẫn với AP-PDN-001, AP-PDN-001 thắng cho community target. Single-seller commerce, contributor không có payout/pricing, production approval gates và các invariant security/payment hiện tại vẫn giữ nguyên.

Plan, PRD, migration file hoặc prompt này không phải bằng chứng capability đã implemented, verified hay released.

RANH GIỚI QUYỀN HẠN

- Product Owner sở hữu what/why/outcome/scope/order/metric/product acceptance intent.
- Architect sở hữu ADR, schema boundary, transaction, migration, search và upload architecture.
- Engineering triển khai đúng Task Contract và owned paths.
- QA reviewer độc lập sở hữu technical verdict.
- Human owner giữ production migration/deploy, live provider, DNS, tiền thật, pricing/legal/policy và risk acceptance.
- Không tự deploy Production, chạy migration Production, kích hoạt provider, đổi DNS hoặc xử lý tiền thật.
- Không tự gọi sprint sau nếu chưa có exact predecessor acceptance và reviewer evidence.

FIRST ACTION — BẮT BUỘC TRƯỚC CODE

1. Đọc mọi instruction/AGENTS.md áp dụng.
2. Kiểm tra git status và bảo toàn toàn bộ dirty/untracked/concurrent work; không reset, checkout, clean hoặc overwrite file không thuộc scope.
3. Audit current implementation theo bốn trạng thái:
   - CURRENT: có repo/runtime/test evidence;
   - APPROVED NEXT: có contract nhưng chưa implemented;
   - GAP/BLOCKED: thiếu dependency/decision/evidence;
   - OUT/LATER: không thuộc slice hiện tại.
4. Xác định sprint hiện hành và verify exact predecessor acceptance từ artifact, không suy đoán theo roadmap.
5. Tạo một Task Contract từ agent-pack/templates/task-contract.md, ghi exact scope, non-scope, allowed paths, acceptance, gates, risk, test, migration và rollback.
6. Chạy node agent-pack/scripts/validate-task-contract.mjs --all --self-test.
7. Trước write, trả một execution packet ngắn gồm:
   - sprint/slice;
   - current evidence và gap;
   - actor/outcome;
   - owned paths;
   - schema/migration impact;
   - applicable acceptance IDs PK-*;
   - security/privacy risks;
   - test plan và rollback.

Nếu chưa có S0_ACCEPTED hoặc exact predecessor acceptance hợp lệ, chỉ thực hiện audit/ADR/Task Contract thuộc S0/K0 rồi DỪNG; không sửa application code.

TARGET ARCHITECTURE

Ưu tiên modular monolith phù hợp repository:

- Next.js App Router + React;
- Supabase managed PostgreSQL + Drizzle; runtime host là Vercel;
- server-side command/service layer cho mutation và invariant;
- public query DTO riêng, tuyệt đối không trả raw database row;
- Vercel Blob: raw private quarantine và sanitized public artifact tách biệt;
- PostgreSQL full-text search cho MVP;
- transactional outbox cho reputation projection, search/counter projection và notification side effects;
- không tách microservice hoặc vector search khi chưa có evidence.

Platform decision `AP-PLATFORM-001`: Supabase chỉ là PostgreSQL provider ở scope hiện tại. Không tự chuyển auth, Blob artifacts, Realtime hoặc Data API sang Supabase. Drizzle migration files là schema authority; không tạo migration history cạnh tranh bằng Supabase CLI nếu chưa có ADR đổi authority.

Bounded contexts:

- Identity & Trust;
- Knowledge;
- Evidence;
- Taxonomy & Discovery;
- Community Governance;
- Trust & Safety;
- Commerce tách riêng và chỉ ALIPROMPT có seller authority.

DOMAIN MODEL BẮT BUỘC

Triển khai additive, không phá bảng legacy trước cutover:

1. users/public_profiles
   - public handle, bio/avatar và quality counters;
   - email/auth/internal IDs không xuất hiện trong public DTO.

2. questions
   - author, slug, title, goal, context, input description, constraints;
   - status draft|pending|published|closed|duplicate|archived;
   - accepted answer và canonical duplicate reference;
   - 1–5 canonical tags.

3. prompt_answers
   - thuộc đúng một question và author;
   - summary, usage instructions, current version;
   - status draft|pending|published|rejected|archived.

4. prompt_versions
   - immutable sau publish;
   - prompt body, variables schema, provider/model/version/run settings;
   - edits append version mới, không rewrite version cũ.

5. output_artifacts + output_artifact_links
   - text/image/PDF cho MVP;
   - staged/scanning/clean/rejected/deleted và moderation state;
   - link tới đúng prompt version hoặc attempt;
   - chỉ sanitized derivative được public.

6. attempts
   - bind exact prompt_version_id;
   - success|partial|failed;
   - actual provider/model/version, notes và optional output;
   - independent được server derive bằng tester != answer author;
   - chỉ approved independent success được tính WVSA.

7. tags/question_tags/tag_synonyms
   - tag kinds vertical|task|model|output|language;
   - migrate 31 category hiện tại thành vertical tags;
   - synonym resolve về canonical tag.

8. question_votes/answer_votes
   - unique user/target, value -1 hoặc +1;
   - reversible/idempotent;
   - cấm self-vote server-side.

9. reputation_events/privilege_grants
   - append-only ledger, policy_version, causation_id unique và reversal event;
   - MVP chỉ dùng reputation làm signal/badge;
   - sensitive privilege vẫn manual/role, không tự mở theo threshold khi chưa có abuse evidence.

10. bookmarks, comments, duplicate links, revisions, moderation cases/decisions, audit/outbox events.

BUSINESS INVARIANTS — KHÔNG ĐƯỢC LÀM YẾU

- Question là đơn vị trung tâm; Prompt Answer là giải pháp.
- Vote đo usefulness; Attempt đo kết quả thực nghiệm; accepted answer đo kết quả của người hỏi. Không gộp ba tín hiệu thành rating 1–5.
- Một Question có tối đa một accepted answer; update phải atomic và chống race.
- Chỉ question owner accept; answer phải thuộc question đó.
- Self-answer hợp lệ nhưng self-accept không tạo reputation và phải tuân thời gian chờ cấu hình.
- Published answer bắt buộc có ít nhất một clean/approved Output Evidence.
- Một user chỉ có một current vote trên mỗi target; không self-vote.
- Prompt edit tạo version mới; Attempt lịch sử luôn giữ version cũ.
- Duplicate không được tạo self-link hoặc cycle; source URL vẫn là signpost tới canonical question.
- Guest submission mặc định tắt; verified member mới được ask/answer/share.
- Community contribution luôn free và không cấp seller/pricing/payout/refund/commerce authority.
- Favorite/bookmark không tăng reputation hoặc ranking trực tiếp.
- View count/số bài/aggregate likes không phải quality truth.
- Counter like legacy không được biến thành voter, vote row hoặc reputation giả.
- Email, contact, IP, auth ID, abuse fingerprint và moderation evidence không được public qua UI/API/HTML/RSC/cache/search/log/analytics.
- Mutation phải kiểm tra authz/ownership server-side; client-supplied userId/role/owner không phải authority.

PUBLIC ROUTES/JOURNEYS TỐI THIỂU

- /questions — feed có Cần câu trả lời, Đang hoạt động, Đã kiểm chứng, Mới nhất.
- /questions/ask — form bài toán với duplicate suggestion.
- /questions/[id]/[slug] — canonical detail, nhiều ordered answers, evidence và attempts.
- /share-prompt — Question + self-answer transaction.
- /tags và /tags/[slug].
- /users/[handle] — public profile không PII.
- /bookmarks — private member library.
- /review — role-protected moderation queues.

Nếu cần giữ route /prompts/[slug], dùng compatibility redirect hoặc adapter; không tạo hai nguồn sự thật lâu dài.

QUESTION FORM

Bắt buộc:

- outcome-oriented title;
- goal;
- context;
- input description;
- constraints;
- 1–5 tags.

Trước submit phải hiển thị candidate duplicate. Validation ở client để UX và server làm authority. Nội dung có raw PII, secret hoặc protected customer data phải bị chặn/đưa review theo policy.

PROMPT ANSWER/SHARE FORM

Bắt buộc:

- prompt body;
- variables/placeholder guidance;
- usage instructions;
- tool/provider/model/version đã chạy;
- ít nhất một output text/image/PDF;
- xác nhận quyền chia sẻ.

SharePrompt phải atomic: nếu Question, Answer, Version hoặc evidence metadata thất bại thì không để partial public graph. Blob staging orphan phải có cleanup/reconciliation.

UPLOAD SECURITY

- MVP allowlist: text evidence, JPG, PNG, WebP và PDF; không arbitrary ZIP/office executable content.
- Giới hạn byte/pixel/page/count lấy từ versioned config sau audit; không invent production value nếu chưa approved.
- Validate extension + MIME sniffing + magic bytes; decode/re-encode raster, normalize orientation, strip EXIF/GPS.
- Defend malformed file, decompression bomb, parser exploit và duplicate artifact hash.
- Raw upload vào private quarantine bằng short-lived, user/draft/environment-scoped intent.
- Malware/content moderation xong mới tạo sanitized public derivative.
- Không public raw key, signed private URL, scan metadata hoặc moderation evidence.

RANKING VÀ METRICS

Không sort answer chỉ bằng count thô. Thiết kế score versioned gồm:

- accepted signal;
- adjusted useful vote score;
- attempt success confidence theo sample size;
- freshness/model compatibility;
- trust/moderation penalty;
- deterministic tie-break.

Trọng số phải cấu hình và observable; nếu S0 chưa có owner decision thì giữ placeholder cấu hình an toàn, không bịa product truth.

North-star:

Weekly Verified Successful Attempts (WVSA) = approved Attempt success, do người không phải answer author tạo, bind một Prompt Version cụ thể.

Instrument tối thiểu:

- question_viewed, duplicate_suggestion_shown, question_submitted;
- answer_started/submitted/published;
- prompt_copied, question_bookmarked;
- attempt_started/submitted/moderated;
- answer_accepted, vote_cast/reversed;
- report_opened, moderation_decided;
- search_performed/zero_result/result_opened.

Không log raw prompt, email, input/output bytes hoặc PII vào analytics.

MIGRATION TỪ CURRENT CATALOG

Dùng expand → backfill → verify → compatibility read/dual-write → cutover → contract.

Mapping:

- prompts → Question + self-authored Prompt Answer + Prompt Version 1;
- prompt_media → author Output Artifact;
- categories → vertical tags;
- prompt_reactions có user identity → answer votes;
- aggregate like/dislike counters → legacy metrics only;
- favorites → Question bookmarks;
- view_count → legacy_view_count, không giả unique view;
- reports → moderation cases;
- products/orders/payment_events/entitlements giữ domain Commerce.

Yêu cầu:

- legacy_entity_map và idempotency key;
- backfill chạy lại không tạo duplicate;
- row/count/hash/invariant reconciliation;
- incomplete record vào enrichment/exception ledger;
- old slug route redirect/canonical ổn định;
- feature flags tách read path, write path, attempt, reputation và ranking;
- chưa drop/contract legacy trong MVP;
- có rollback rehearsal trước production cutover.

DELIVERY — MỖI LẦN CHỈ MỘT SLICE ĐƯỢC PHÉP

K0 — audit/ADR/data inventory, không app code nếu predecessor chưa hợp lệ.
K1 — read-only canonical Question adapter cho legacy prompt, public DTO privacy fix.
K2 — ask, answer, self-share và safe evidence submission.
K3 — vote, accept, bookmark, Attempt và version history.
K4 — search, tags, synonyms, duplicate governance và canonical SEO.
K5 — reputation ledger signal-only, review queues và privacy-safe leaderboard.
K6 — reconciliation, compatibility cutover và rollback rehearsal; production action vẫn cần approval.

Orchestrator phải map K-slice vào sprint S0–S7 hiện hành trong Task Contract. K-label không thay thế canonical sprint envelope và không cấp quyền bỏ predecessor/gate.

TEST VÀ ACCEPTANCE

Áp agent-pack/product/PROMPT-KNOWLEDGE-ACCEPTANCE-MATRIX.md.

Mỗi slice phải có test phù hợp:

- unit: validation, state transition, ranking helper, reputation policy;
- integration: authz, ownership, transaction, idempotency, version binding;
- DB/migration: constraint, concurrency, backfill rerun, reconciliation, rollback;
- security: self-vote, IDOR, CSRF/origin, XSS, upload, PII leakage, rate abuse;
- UI/e2e: ask → answer → accept → third-party attempt;
- accessibility: semantic structure, keyboard, focus, labels, status announcement;
- SEO: canonical, redirect, duplicate signpost, noindex private/moderation states.

Không sửa hoặc làm yếu test để tạo pass. Ghi command/result thật; pre-existing/unrelated failure phải tách rõ evidence.

MINIMUM END-TO-END PRODUCT ACCEPTANCE

User A đã verify tạo Question.
User B đăng Prompt Answer + Prompt Version + clean output.
Moderator/policy publish đúng quyền.
User A thử và accept Answer.
User C vote và tạo Attempt success trên đúng version.
WVSA tăng đúng một lần sau moderation.
User B sửa prompt tạo version mới nhưng Attempt cũ vẫn thuộc version cũ.
Public page/profile/leaderboard không chứa email hoặc private metadata.
Report/duplicate/unauthorized/upload-reject branches hoạt động và có audit.

QUALITY COMMANDS

Chạy theo scope và package hiện hành, tối thiểu khi phù hợp:

- node agent-pack/scripts/validate-task-contract.mjs --all --self-test
- npm run ai:validate
- npm run lint
- npm test
- npm run build
- Drizzle generate/migration checks chỉ khi Task Contract cho phép và không đụng production.

Command pass chỉ là technical evidence, không tự cấp G0–G7, product acceptance, release verdict hoặc production approval.

STOP CONDITIONS

Dừng slice và báo blocker nếu bước kế tiếp cần:

- production credential/provider/deploy/migration/DNS;
- destructive contract/drop;
- legal retention/content/license decision;
- numeric target/limit mà behavior sẽ thay đổi đáng kể;
- file ownership conflict/concurrent writer;
- exact predecessor acceptance hoặc independent reviewer còn thiếu.

Không dùng thiếu provider làm cớ dừng toàn bộ: có thể xây interface/fake/local adapter trong scope đã duyệt.

OUTPUT TRƯỚC VÀ SAU IMPLEMENTATION

Trước code: execution packet như FIRST ACTION.

Sau code:

1. Outcome đạt/chưa đạt.
2. Files/migrations thay đổi.
3. Acceptance PK-* pass/fail/blocked kèm evidence.
4. Test command và kết quả thật.
5. Security/privacy/a11y/SEO/data review.
6. Migration/rollback status.
7. Remaining risks/unknowns.
8. Exact next owner và approval cần có.
9. Machine handoff đúng agent-pack/schemas/handoff.schema.json khi được yêu cầu; không thêm top-level key, secret, raw PII hoặc chain-of-thought.

FIRST RESPONSE

Không code ngay. Đọc source-of-truth, audit current repo và trả execution packet cho đúng một K-slice/sprint đang hợp lệ. Nếu chưa chứng minh được predecessor acceptance, chọn S0/K0, không sửa application code và dừng sau audit/handoff.
```

## Tin nhắn khởi động ngắn

```text
Đọc và thực thi agent-pack/PROMPT-IMPLEMENT-PROMPT-KNOWLEDGE-NETWORK.md. Bắt đầu bằng audit repo + exact sprint/predecessor evidence + Task Contract. Chỉ làm đúng một K-slice hợp lệ; nếu chưa có predecessor acceptance thì chạy S0/K0, không sửa application code và dừng với handoff.
```
