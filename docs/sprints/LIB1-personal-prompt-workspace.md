# ALIPROMPT — Sprint LIB1: Personal Prompt Workspace

## Sprint control

| Field | Value |
| --- | --- |
| Sprint ID | LIB1 |
| Version | 1.0.0 |
| Status | Draft / Ready for Product Owner review |
| Product Owner approval | Pending |
| Created | 2026-08-19 |
| Start / End | TBD |
| Team capacity | TBD |
| Candidate scope | 16 story points |
| Delivery target | Local + isolated Vercel Preview |
| Production deployment | Out of scope without explicit approval |

Pasting the Dev Prompt does not authorize a Production deployment. The Product Owner may start implementation with the exact command `START LIB1`; Production requires a separate explicit approval after Preview acceptance.

## Sprint Goal

Biến Library hiện tại thành không gian làm việc riêng để người dùng có thể tổ chức prompt theo Collections, quay lại prompt vừa dùng và lưu ghi chú cá nhân trên mọi thiết bị, mà không lưu prompt đã điền biến, nội dung clipboard hoặc làm lộ prompt trả phí.

## Why this sprint

ALIPROMPT đã có Favorites, Library, prompt versions và Guided Prompt Workspace. Khoảng trống tiếp theo không phải là thêm một nút “Save” khác, mà là giúp người dùng tìm lại và tiếp tục công việc khi số prompt đã lưu tăng lên. LIB1 mở rộng hành vi đã có theo ba lớp giá trị:

1. **Organize:** một prompt có thể nằm trong nhiều Collection riêng tư.
2. **Resume:** Recently Used chỉ ghi nhận sau khi người dùng copy prompt thành công.
3. **Remember:** ghi chú cá nhân plain text gắn với từng prompt.

Sprint không dùng recommendation ML, không lưu variable values và không dùng Supabase Auth/Realtime/Data API.

## Candidate backlog

### ALI-LIB1-001 — Private Collections — 8 SP — P1

**User Story:** As a signed-in user, I want to group saved prompts into private collections, so that I can find the right prompt for each project or workflow.

**Acceptance Criteria:**

- Người dùng có thể tạo, đổi tên, sửa mô tả và xóa Collection riêng của mình.
- Một prompt có thể thuộc nhiều Collection; add/remove là idempotent và không thay đổi trạng thái Favorite.
- Xóa Collection chỉ xóa membership, tuyệt đối không xóa prompt, entitlement hoặc Favorite.
- Collection mặc định là private và không có public URL có thể đoán để đọc nội dung.
- Mọi read/write phải scope bằng authenticated `userId`; không tin `userId` từ body, query hoặc client state.
- Collection name dài 1–80 ký tự sau normalize; description tối đa 280 ký tự; không render user text bằng unsafe HTML.
- Giới hạn hợp lý: tối đa 50 Collections/user và 500 items/Collection; API trả lỗi VI/EN có thể hành động khi vượt giới hạn.
- Prompt archived/unapproved/deleted không làm vỡ Collection: hiển thị item “không còn khả dụng” tối thiểu và cho phép người dùng remove; không làm lộ protected body.
- Library có IA rõ ràng cho Overview, Saved, Collections và Recently Used; route Favorites hiện có vẫn hoạt động.
- CRUD có loading, empty, success, validation, conflict và retry states; keyboard/focus/screen reader hoạt động.

### ALI-LIB1-002 — Recently Used & Continue — 5 SP — P1

**User Story:** As a signed-in user, I want to see prompts I recently used, so that I can continue a repeated workflow without searching again.

**Acceptance Criteria:**

- Chỉ ghi nhận usage sau khi thao tác Copy thực sự thành công ở client; page view không được coi là “used”.
- Event chỉ lưu allowlisted metadata: user, prompt, version identifier, copy format, timestamp và opaque idempotency key.
- Tuyệt đối không lưu generated prompt text, original paid body, variable values, personal note hoặc clipboard content.
- Retry cùng idempotency key không tạo duplicate event hoặc tăng count hai lần.
- Recently Used hiển thị tối đa 20 item mặc định, có bounded pagination cho lịch sử dài hơn và sort mới nhất trước.
- Người dùng có thể xóa một event hoặc clear history của chính mình; thao tác destructive có confirm và trạng thái phục hồi hợp lý khi request fail.
- Anonymous copy không tạo server history; UI giải thích ngắn rằng đăng nhập mới đồng bộ lịch sử.
- Paid/archived/unavailable prompt không làm lộ body; quyền xem/use tiếp tục được kiểm tra server-side tại thời điểm mở lại.
- History response là private/no-store và không cache chéo user.

### ALI-LIB1-003 — Private Prompt Notes — 3 SP — P2

**User Story:** As a signed-in user, I want to attach a private note to a prompt, so that I can remember how I use it without changing the original prompt.

**Acceptance Criteria:**

- Một user có tối đa một note trên mỗi prompt; note là plain text, tối đa 2,000 ký tự.
- Save là upsert idempotent; empty normalized value xóa note theo contract rõ ràng.
- UI có explicit saved/saving/error state; debounce không được làm mất note khi navigation/unmount.
- Note chỉ owner đọc/sửa/xóa; admin product UI không mặc định hiển thị personal notes.
- Note không xuất hiện trong public search, metadata, structured data, analytics, logs hoặc error report.
- Hiển thị note bằng escaped text; có test XSS và cross-account IDOR.
- UI có copy VI/EN và giải thích đây là ghi chú riêng, không phải một phần của prompt gốc.

## Data and API contract

Dev phải xác minh schema hiện tại trước khi đặt tên migration. Thiết kế tối thiểu dự kiến:

- `prompt_collections`: `id`, `user_id`, `name`, `description`, `created_at`, `updated_at`.
- `prompt_collection_items`: `collection_id`, `prompt_id`, `created_at`; unique membership và indexes phục vụ owner/list queries.
- `prompt_usage_events`: opaque event ID/idempotency key, `user_id`, `prompt_id`, allowlisted version/format, `used_at`; không có content fields.
- `prompt_notes`: `user_id`, `prompt_id`, plain-text `body`, timestamps; unique `(user_id, prompt_id)`.

Rules:

- Drizzle là schema/migration authority duy nhất.
- App đang kết nối PostgreSQL trực tiếp; không được dựa vào Supabase RLS như lớp authorization duy nhất. Mọi query vẫn phải owner-scope ở server.
- Foreign keys và delete behavior phải được review rõ ràng. Xóa Collection chỉ cascade membership. Xóa user có thể cascade dữ liệu workspace của chính user. Xóa prompt không được tạo orphan rows.
- Thêm index dựa trên query paths: owner + updated/created time, collection membership và recent usage.
- Không chạy migration trong request handler hoặc application startup.
- Migration phải được rehearsal trên isolated Preview database và có rollback/resume note.

## UX/UI requirements

- Mobile-first tại 360, 390, 430, 768, 1024 và 1440px.
- VI/EN đầy đủ cho label, validation, empty/error state và screen-reader announcements.
- Light/Dark/System, visible focus, keyboard navigation và reduced-motion.
- Touch target tối thiểu 44×44px; không horizontal overflow hoặc modal/dialog vượt viewport.
- Desktop có thể dùng sidebar + content; mobile dùng tabs hoặc accessible sheet, không giấu primary actions trong hover.
- Collection picker phải dùng focus trap/focus return đúng; Escape đóng khi an toàn.
- Optimistic UI chỉ dùng khi có rollback chính xác. Không hiển thị success trước khi server đã xác nhận với destructive actions.
- Preserve URL/filter state khi chuyển giữa Saved, Collections và Recently Used khi hợp lý.

## Security and privacy requirements

- Server-side authentication và owner authorization trên mọi route.
- CSRF/origin validation cho state-changing endpoints theo contract hiện tại.
- Rate limit/bound writes cho create, rename, note save, history clear và membership changes.
- Negative tests: unauthenticated, wrong account, guessed UUID, deleted collection, archived prompt, malformed JSON, oversized text, duplicate retry và concurrent updates.
- Không log prompt body, generated output, variable values, notes, clipboard hoặc database secrets.
- Paid prompt body không xuất hiện trong Collection/History/Note DTO, HTML, RSC payload, metadata, public cache hay analytics.
- Private pages/responses dùng dynamic/private/no-store đúng boundary.
- Không đưa database credential hoặc service-role secret vào `NEXT_PUBLIC_*`.

## Analytics contract

Nếu repository chưa có analytics provider được phê duyệt, không tự thêm provider mới trong sprint này. Có thể chuẩn bị privacy-safe event interface với các event:

- `collection_created`
- `prompt_added_to_collection`
- `recent_prompt_reopened`
- `personal_note_saved`

Event chỉ chứa opaque IDs hoặc enum cần thiết; không chứa collection name, note body, prompt body, variables hoặc clipboard content.

## Out of scope

- Public/shared Collections, collaboration, team workspace hoặc share links.
- Nested folders, drag-and-drop ordering và offline sync.
- Recommendation ML, embeddings, vector database hoặc external model calls.
- Import/export prompt content.
- Supabase Auth, Storage, Realtime, Edge Functions hoặc Data API.
- Rewrite Favorites, auth, checkout, entitlement hoặc Guided Prompt Workspace ngoài thay đổi tối thiểu để tích hợp.
- Production migration/deployment nếu chưa có explicit approval riêng.

## Definition of Ready

- [ ] Product Owner gửi exact `START LIB1`.
- [ ] Start/end date, team capacity và owners được xác nhận.
- [ ] OPS1 database/Preview path đủ ổn định để rehearsal migration.
- [ ] Contract Favorites, Prompt Copy và server auth hiện tại được Dev xác minh.
- [ ] Ba stories được estimate lại và fit trong tối đa 85% team capacity.
- [ ] Privacy copy cho History và Notes được Product Owner duyệt.

## Definition of Done

- [ ] Acceptance Criteria của committed stories đạt.
- [ ] Drizzle migration check, clean install và upgrade rehearsal pass trên isolated Preview.
- [ ] TypeScript, lint, unit/integration tests và production build pass.
- [ ] API auth, CSRF, IDOR, idempotency, concurrency, XSS và paid-body leakage tests pass.
- [ ] Critical E2E pass cho create/rename/delete Collection, add/remove prompt, successful-copy history, reopen, clear history và note save/delete.
- [ ] 360/390/430/768/1024/1440 × VI/EN × Light/Dark/System đã được QA.
- [ ] Keyboard, screen reader basics và reduced-motion đã được QA.
- [ ] Query count/latency và pagination có evidence hợp lý; không có unbounded query hoặc N+1 mới.
- [ ] Không còn P0/P1; known P2/P3 có owner và disposition.
- [ ] Có files changed, migration ID, test output, screenshots và Vercel Preview URL trong handoff.
- [ ] Independent QA và Product Owner chấp nhận sprint; Production vẫn Hold nếu chưa có approval riêng.

## Master Dev Prompt

```text
# DEV PROMPT — SPRINT LIB1: PERSONAL PROMPT WORKSPACE

Bạn là Senior Product Engineer chịu trách nhiệm triển khai Sprint LIB1 cho ALIPROMPT. Hãy IMPLEMENT, TEST và HAND OFF feature hoàn chỉnh; không chỉ audit hoặc viết kế hoạch.

SPRINT GOAL
Biến Library hiện tại thành không gian làm việc riêng để user tổ chức prompt bằng private Collections, quay lại Recently Used và lưu private Notes trên mọi thiết bị, mà không lưu generated prompt, variable values, clipboard content hoặc làm lộ paid prompt body.

START AUTHORITY
- Chỉ coi sprint được phép bắt đầu khi Product Owner gửi exact: START LIB1.
- Lệnh này cho phép thay đổi local code/schema và deploy isolated Vercel Preview nếu credentials/resources đã có.
- Lệnh này KHÔNG cho phép Production migration hoặc Production deployment.
- Nếu thiếu Preview/Supabase credential, vẫn hoàn thành code, migrations, tests và local evidence; báo rõ external blocker thay vì giả lập deployment thành công.

REPOSITORY FACTS CẦN XÁC MINH
- Next.js App Router + TypeScript + Drizzle + postgres-js + Supabase PostgreSQL + Vercel Blob.
- Favorites và /library đã tồn tại.
- PromptUsePanel đã có variable builder, token estimate và copy flow.
- Prompt versions, auth, entitlement và paid-content boundaries đã tồn tại.
- Working tree có thể dirty và chứa thay đổi của owner/agent khác.
Không tin mù các facts trên: đọc AGENTS.md, README, package scripts, schema, migrations, auth, catalog, favorites, PromptUsePanel, Library, i18n và tests trước khi sửa.

NON-NEGOTIABLE
1. Chạy git status và giữ nguyên mọi unrelated change; không reset, checkout, xóa hoặc ghi đè công việc hiện có.
2. Drizzle là migration authority. Không sửa remote schema bằng dashboard và không chạy migration trong request/startup.
3. Mọi private query phải lấy user từ trusted server session và owner-scope; không nhận userId từ client.
4. Không dựa vào Supabase RLS như authorization duy nhất vì app dùng PostgreSQL driver trực tiếp.
5. Không log/store prompt body, generated prompt, variable values, clipboard content hoặc personal note trong analytics/error telemetry.
6. Không đưa paid prompt body vào Collections/History/Notes DTO, HTML, RSC payload, public cache, metadata hoặc analytics.
7. Không thêm Supabase Auth/Storage/Realtime/Data API, external AI API hoặc analytics provider mới.
8. Production deploy/migration luôn Hold cho đến khi có approval riêng sau Preview acceptance.

PHASE 1 — BASELINE & DESIGN
1. Chạy baseline phù hợp: TypeScript, lint, tests, Drizzle check và build. Ghi exact result.
2. Map current routes/components/schema cho Favorites, Library, Prompt Copy, auth, entitlement và i18n.
3. Trả ngắn gọn design decision record trước implementation:
   - route/API contract;
   - owner authorization boundary;
   - schema + indexes + delete behavior;
   - idempotency strategy cho copy usage;
   - private cache strategy;
   - mobile information architecture.
4. Nếu phát hiện implementation hiện tại khác facts, điều chỉnh solution theo evidence nhưng giữ nguyên Sprint Goal và security invariants.

PHASE 2 — PRIVATE COLLECTIONS
1. Thêm Drizzle schema/migration cho collections và memberships.
2. Implement create/list/read/rename/update/delete Collection và add/remove membership.
3. Một prompt được phép nằm trong nhiều Collections; membership unique và mutation idempotent.
4. Favorites độc lập với Collections. Add vào Collection không auto-favorite; remove khỏi Collection không unfavorite.
5. Xóa Collection chỉ xóa memberships, không xóa prompt/favorite/entitlement.
6. Enforce: name 1–80, description <=280, max 50 Collections/user, max 500 items/Collection.
7. Mọi API/query owner-scoped; chống IDOR, guessed UUID, race và duplicate request.
8. Unavailable prompt hiển thị safe placeholder và Remove action, không lộ protected data.

PHASE 3 — RECENTLY USED
1. Gắn tracking vào existing Copy flow chỉ SAU browser clipboard success.
2. Anonymous copy không ghi server history.
3. Store duy nhất allowlisted metadata: opaque event/idempotency key, user, prompt, version identifier, copy format và timestamp.
4. Không store original/generated text, variable values, clipboard, note hoặc paid body.
5. Retry cùng idempotency key không duplicate hoặc tăng count hai lần.
6. Implement Recently Used newest-first, default 20, bounded pagination, reopen, delete one và clear all.
7. Reopen luôn kiểm tra trạng thái prompt và entitlement hiện tại; history không cấp quyền truy cập.
8. Response private/no-store; không cache chéo account.

PHASE 4 — PRIVATE NOTES
1. Một plain-text note/user/prompt, tối đa 2,000 chars; unique database constraint.
2. Upsert idempotent; empty normalized note thực hiện delete theo documented contract.
3. UI có saving/saved/error state. Debounce phải flush hoặc cảnh báo trước navigation để không silently mất dữ liệu.
4. Escape output; không dùng dangerouslySetInnerHTML cho note.
5. Notes không xuất hiện trong public/admin product UI, search, metadata, logs hoặc analytics.
6. Test wrong-account read/write/delete và XSS payload.

PHASE 5 — LIBRARY UX/UI
1. Tạo IA rõ ràng: Overview, Saved, Collections, Recently Used; preserve existing Favorites URL/behavior.
2. Desktop có thể dùng sidebar + content; mobile dùng tabs/sheet accessible.
3. Collection picker hỗ trợ keyboard, focus trap/return, Escape và screen-reader labels.
4. Có loading, empty, validation, conflict, unavailable, save-success, save-failure, delete-confirm và retry states.
5. VI/EN đầy đủ, Light/Dark/System, reduced motion.
6. QA 360/390/430/768/1024/1440; touch targets >=44x44; không overflow/CTA truncation.
7. Optimistic update chỉ khi rollback state chính xác; destructive success chỉ hiển thị sau server confirmation.

PHASE 6 — PERFORMANCE, PRIVACY & SECURITY
1. Bound/paginate every list; không N+1. Thêm index theo actual query path và inspect representative query plan khi có Preview data.
2. Dùng private/no-store/dynamic đúng boundary; không public-cache Library data.
3. Enforce auth, owner authorization, CSRF/origin và bounded/rate-limited writes.
4. Negative tests: anonymous, cross-account, malformed JSON, oversize, missing/deleted entity, archived prompt, duplicate retry, concurrent rename/add/remove/note save.
5. Secret/privacy scan cho responses, logs, RSC/HTML payload và analytics interface.
6. Nếu chưa có analytics provider approved, không cài provider; chỉ tạo typed privacy-safe events nếu thực sự cần.

PHASE 7 — TEST & PREVIEW
1. Chạy Drizzle migration check, clean install rehearsal và upgrade rehearsal trên isolated database.
2. Chạy TypeScript, lint, unit/integration tests và production build.
3. E2E tối thiểu:
   - create/rename/delete own Collection;
   - add/remove one prompt và same prompt in multiple Collections;
   - reject wrong-account Collection/Note/History access;
   - successful Copy creates exactly one history item;
   - failed clipboard Copy creates no history;
   - reopen/clear history;
   - note save/reload/delete;
   - paid/unavailable prompt never leaks body;
   - VI/EN + themes + mobile + keyboard.
4. Deploy Vercel Preview only when isolated resources exist. Không dùng --prod.
5. Verify /api/health, /api/readiness, logs, console, hydration và relevant query latency.

OUT OF SCOPE
- Public/shared Collections, collaboration, nested folders, drag ordering, offline sync.
- AI recommendations, embeddings, vector DB, external model calls.
- Import/export prompt content, notifications hoặc social features.
- Supabase Auth/Storage/Realtime/Edge/Data API.
- Production migration/deployment.

FINAL HANDOFF FORMAT
1. Sprint outcome: Pass / Partial / Blocked.
2. Stories completed và Acceptance Criteria evidence.
3. Architecture decisions/trade-offs.
4. Exact files + migration IDs changed.
5. Commands/tests và exact results.
6. Security/privacy negative-test results.
7. Mobile/i18n/theme/accessibility QA matrix.
8. Vercel Preview URL và health/readiness result nếu có.
9. Known risks/P2/P3, rollback/resume instructions và external blockers.
10. Exact Product Owner approval còn cần; không tự tuyên bố Production-ready.

Hãy bắt đầu bằng baseline audit ngắn, sau đó triển khai liên tục các thay đổi an toàn trong scope. Chỉ dừng khi thực sự cần credentials/provider resource/Production authority hoặc khi có conflict với unrelated dirty changes không thể cô lập.
```

## Product Owner acceptance prompt

Sau khi Dev handoff, Product Owner dùng câu lệnh sau trong chat Dev:

```text
Review LIB1 against every committed Acceptance Criterion and Definition of Done using repository, migration, test, security, responsive, i18n/theme and Vercel Preview evidence. Do not accept claims without evidence. Return exactly one verdict: LIB1_ACCEPTED, LIB1_RETURNED_WITH_GAPS, or LIB1_BLOCKED. Production deployment remains unauthorized.
```

## Project-owner teach-back

- [ ] Giải thích vì sao Collection không thay thế Favorite và một prompt có thể nằm trong nhiều Collection.
- [ ] Giải thích vì sao Recently Used chỉ được ghi sau Copy success, không phải page view.
- [ ] Nêu bốn loại nội dung tuyệt đối không được lưu trong usage history.
- [ ] Giải thích vì sao Supabase RLS không thể là authorization duy nhất với direct PostgreSQL driver.
- [ ] Giải thích vì sao xóa Collection chỉ được xóa membership.

