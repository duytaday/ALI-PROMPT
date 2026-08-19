# ALIPROMPT — Running Understanding Checklist

## Two-chat operating model

- [ ] Nói lại được: Product Owner quyết what/why/priority/product acceptance; Dev 1 quyết how/implementation; independent QA giữ technical verdict.
- [ ] Giải thích được vì sao hai chat giao tiếp bằng versioned work order + repo evidence + 19-key handoff, không dựa vào việc nhớ lịch sử chat.
- [ ] Phân biệt được `PARITY` với `ENHANCEMENT`; enhancement không được che parity gap hoặc tự mở multi-vendor.
- [ ] Biết Dev 1 chỉ chạy một sprint, dùng specialist subagents có file ownership rõ, rồi dừng để PO accept trước sprint tiếp theo.
- [ ] Nói được model routing mặc định: Luna cho bounded bulk/low-risk nếu available; Terra cho đa số PO/dev/review; Sol cho architecture/security/payment/migration/release blocker; deterministic task không dùng model.
- [ ] Giải thích được vì sao tăng reasoning hoặc dùng Sol cho mọi task thường tốn token mà không đảm bảo chất lượng; chỉ escalation sau evidence/eval.
- [ ] Biết tối ưu context bằng stable cached prefix, role-specific capsule, artifact path + decisive excerpt và delta context thay vì paste toàn repo/log/history.

`session_started: 2026-08-17`  
`status: awaiting_owner_teach_back`  
`product_mode: single_vendor_commerce_plus_moderated_community`  
`pack_version: 1.2.0`

Không đánh dấu vì “đã đọc”. Chỉ đánh dấu khi chủ dự án tự giải thích đúng, áp dụng vào quyết định hoặc xử lý được tình huống biên. Trước mỗi cổng, mời chủ dự án restate trước; dạy đúng phần thiếu, rồi hỏi lại bằng câu mở hoặc quiz đổi vị trí đáp án.

## Cổng 0 — Product Owner và product truth

- [ ] Phân biệt được PO sở hữu `xây gì/vì sao/ưu tiên/đo gì`, Architect sở hữu `xây bằng cách nào`, Orchestrator sở hữu `ai làm/thứ tự/file ownership` và QA sở hữu verdict kỹ thuật độc lập.
- [ ] Giải thích được vì sao product blueprint, roadmap hoặc milestone không phải bằng chứng capability đã chạy.
- [ ] Tách được `CURRENT`, `APPROVED NEXT`, `DISCOVERY`, `LATER`, `OUT` và `BLOCKED`.
- [ ] Giải thích được xung đột education-funnel/marketplace trước đây đã được active contract v1.2.0 `approved_next` giải quyết; không mở lại A/B trừ khi instruction owner mới xung đột.
- [ ] Phân loại được fact/inference/assumption/estimate/unknown và thiết kế một test rẻ cho giả định nguy hiểm nhất.
- [ ] Viết được một outcome, metric/guardrail, acceptance intent và go/pivot/stop rule thay vì chỉ nêu feature.
- [ ] Giải thích được vì sao PO không thể waive critical security/payment/protected-content/data-loss/a11y gate.
- [ ] Phân biệt product contract với delivery target Vercel/Postgres và current vinext/D1 runtime evidence.
- [ ] Giải thích được vì sao S0–S7 chỉ được tiến khi exact `predecessorAcceptance`, toàn bộ `applicableGates`, đúng `exitAcceptance` và reviewer độc lập đạt.

## Cổng 1 — Bài toán và các nhánh

- [ ] Nói được full functional parity ở đây gồm header/nav/theme; hero/category; `q`+category+author; empty state; ba rail; card/detail/modal; action; auth/library; contribution; contributor/leaderboard; blog; floating controls; responsive/a11y.
- [ ] Giải thích được functional parity khác pixel/content/code clone như thế nào.
- [ ] Liệt kê được thứ cấm sao chép: source/private API/HTML-CSS, brand/logo/copy, prompt/catalog/member data, ảnh/asset và layout pixel-perfect.
- [ ] Giải thích được vì sao trang chia sẻ prompt chưa tự trở thành hệ thống bán prompt: còn thiếu price/order/payment/webhook/entitlement/refund/license/audit.
- [ ] Restate đúng quyết định: V1 có đúng một commercial seller là owner ALIPROMPT; owner prompt có thể free/paid.
- [ ] Restate đúng nhánh cộng đồng: launch mặc định là authenticated member submit free prompt qua moderation và có thể được ghi nhận bằng public handle/leaderboard; guest submission là feature flag tắt mặc định nếu cần parity.
- [ ] Giải thích được vì sao contributor attribution không cấp price/publish/payment/refund/payout authority.
- [ ] Nêu được chi phí mới nếu đổi sang multi-vendor: KYC, tax, commission, payout, dispute, takedown, SLA và legal terms.

### Giả định/điểm chưa chốt

- [x] Brand chính thức trong pack là **ALIPROMPT**.
- [x] Target contract của agent-pack là một seller + moderated free community contribution.
- [x] Owner đã xác nhận target v1.2.0 là `approved_next`; S0 không mở lại A/B nếu không có instruction owner mới xung đột.
- [x] Deployment target là native Next.js trên Vercel; PostgreSQL qua Vercel Marketplace; Vercel Blob tách private quarantine/public sanitized assets.
- [ ] Production auth/email/payment provider, giá thật, currency, license và refund policy đã được owner chốt.
- [ ] Moderation/appeal/retention và guest-handle consent policy đã được owner chốt.

## Cổng 2 — Public UX và discovery

- [ ] Vẽ được luồng home → search/filter → card → detail/quick view → action.
- [ ] Giải thích vì sao filter `q`+category+author nên URL-addressable và reset phải xác định.
- [ ] Mô tả một empty state hữu ích mà không bịa kết quả.
- [ ] Giải thích vì sao most-viewed/most-liked/newest cần event thật, anti-abuse và tie-break ổn định.
- [ ] Nêu khác biệt quick view của free và paid; giải thích vì sao paid preview là field tách riêng.
- [ ] Nói được auth gate của favorite/vote phải giữ destination; up/down loại trừ nhau và idempotent.
- [ ] Mô tả share fallback, optimistic rollback và screen-reader feedback.
- [ ] Chỉ ra yêu cầu keyboard/focus của modal, theme/nav/carousel/floating controls và mobile layout.

## Cổng 3 — Contribution, auth và privacy

- [ ] Restate đủ form: public author/handle, một active category, title, full free body, optional images.
- [ ] Nói đúng giới hạn mặc định: member handle 3–32; guest author 2–50; title 8–160; body 20–20.000; 0–4 ảnh, 3 MiB/ảnh, 12 MiB tổng, tối đa 4096×4096, JPEG/PNG/WebP.
- [ ] Giải thích vì sao client validation chỉ hỗ trợ UX còn server mới là authority.
- [ ] Mô tả decode/re-encode, orientation, metadata stripping, variants, magic bytes và bomb/active-content rejection.
- [ ] Nêu ít nhất năm lớp anti-spam: IP/account rate, size, CSRF/nonce, honeypot/time, fingerprint/dedupe, challenge/quarantine/moderation.
- [ ] Vẽ đúng năm contributor-visible state `draft → pending_moderation → changes_requested|rejected|published`, `changes_requested → draft`; giải thích upload/scan/transform/review/approval chỉ là internal event và contributor không tự vào `published`.
- [ ] Giải thích register/login/logout/forgot/reset cần non-enumeration, session rotation, token hash/expiry/single-use và revoke.
- [ ] Giải thích guest handle/unverified profile/claim secret; vì sao leaderboard tuyệt đối không có email/contact/internal ID.
- [ ] Tính được một leaderboard top 1–50 theo selected metric và tie-breaker ổn định; xử lý self/bot/repeat abuse.

## Cổng 4 — Commerce và security invariants

- [ ] Vẽ `browse → auth → checkout → verified webhook → entitlement → reveal → refund → revoke`.
- [ ] Giải thích webhook đã verify, không phải client/AI, là payment truth.
- [ ] Giải thích server price snapshot/recalculation chống client tamper và stale price.
- [ ] Nêu cách chịu duplicate, out-of-order, replay và retry mà không fulfill hai lần.
- [ ] Nêu ít nhất sáu nơi full paid body có thể lộ: public DTO/query, HTML/RSC, bundle, meta/JSON-LD, search, analytics, log/error/source map/cache.
- [ ] Giải thích entitlement active và `private, no-store`; xử lý refund/dispute/revoke.
- [ ] Giải thích authn khác authz và đưa ví dụ IDOR ở order/library/submission/admin.
- [ ] Giải thích vì sao nội dung đã reveal không thể có DRM tuyệt đối.

## Cổng 5 — Blog, admin và tác động vận hành

- [ ] Giải thích vì sao vẫn phải làm blog empty/list/detail/admin workflow dù reference hiện chưa có bài.
- [ ] Mô tả blog draft/preview/publish/unpublish, noindex và sitemap rules.
- [ ] Nói ai được publish product/contribution/blog, suspend, resolve report, refund và release production.
- [ ] Nêu metrics cho discovery/contribution/auth/checkout/entitlement/retention mà không log body/PII.
- [ ] Mô tả rollback/compensation cho migration, image processing, webhook fulfillment và publication lỗi.
- [ ] Giải thích G0–G7 chứng minh clean-room/spec, code, security, commerce, trust/leakage, UX/SEO/a11y/performance và release như thế nào.
- [ ] Nêu phạm vi bị tác động khi đổi limit/schema/ranking/license/refund và cách version/test/migrate.

## Cổng 6 — Vercel, migration và release

- [ ] Giải thích vì sao target là native Next.js và vì sao `vinext`/Vite/Cloudflare/D1 hiện có phải được giữ làm migration evidence/rollback cho tới cutover.
- [ ] Nói đúng: dùng PostgreSQL provider hiện hành từ Vercel Marketplace, không target sản phẩm Vercel Postgres đã dừng; Drizzle cần audit SQLite/D1→PostgreSQL.
- [ ] Phân biệt Development, Preview và Production về database/schema, Blob store, secret, callback, payment/webhook và telemetry; giải thích vì sao Preview không được đụng Production.
- [ ] Vẽ trust flow `member+draft → scoped upload intent → private quarantine → validate/re-encode/strip metadata → public sanitized derivative`; arbitrary Blob URL không chứng minh ownership.
- [ ] Nói đúng upload policy: 0–4 ảnh, 3 MiB/ảnh, 12 MiB tổng; direct upload là mặc định ưu tiên. Function fallback chỉ nhận một ảnh hợp lệ và reject request từ 4.5 MB trở lên trước parse/buffer.
- [ ] Giải thích env change chỉ áp cho deployment mới; secret không được vào chat/client bundle/Preview artifact; callback host phải allowlist.
- [ ] Giải thích webhook/Cron cần idempotency, durable state, lock/checkpoint và explicit retry/alert khi duplicate/overlap/failure.
- [ ] Mô tả D1/SQLite→PostgreSQL rehearsal: schema differences, resumable backfill, count/hash/reference/money/state verification, backup/restore và compensation.
- [ ] Restate S0–S7 và lý do mỗi sprint phải verify predecessor, pass exit, emit handoff đúng 19 key rồi dừng.
- [ ] Nêu bốn production gate tách biệt: deploy commit, production migration, live provider action và domain/alias change; mỗi gate cần explicit approval + rollback.

### Deployment readiness — chỉ tick bằng evidence

- [ ] S0 ADR/active contract map đủ CAP/COM/PLT; application-code diff rỗng.
- [ ] S1 native Next.js build, typed env isolation và disposable PostgreSQL migration/backfill/rollback pass.
- [ ] S2 auth/session/RBAC/owned draft/status và contributor-commerce denial pass.
- [ ] S3 public parity + a11y/SEO/responsive và paid-body leak scan pass.
- [ ] S4 private quarantine/public derivative, 3 MiB/12 MiB limits, canonical five-state moderation và bounded cleanup pass.
- [ ] S5 engagement/library/profile/leaderboard/blog privacy/trust gates pass.
- [ ] S6 sandbox money/webhook/idempotency/entitlement/refund/revoke + contributor isolation pass.
- [ ] S7 G0–G7, isolated Preview golden journeys, performance/limits, backup/restore/migration/rollback drill và independent verdict pass.
- [ ] Exact commit/migration/config names/domain action/monitoring thresholds/rollback owner được ghi, không chứa secret.
- [ ] Owner đã phê duyệt từng production action; nếu chưa, trạng thái đúng là ready/pending, không phải deployed.

## Bằng chứng hiện có

- [x] Capability matrix ghi toàn bộ baseline công khai bắt buộc và commerce riêng.
- [x] Domain invariants khóa seller/contributor authority, limits, state, privacy, rank và commerce.
- [x] Prompt EN/VI yêu cầu original ALIPROMPT routes/design/copy/data và controlled verified S0–S7.
- [x] Bộ sprint prompt EN/VI có S0–S7, canonical predecessor/applicable-gate/exit-acceptance envelope và handoff đúng 19 top-level key.
- [x] Vercel deployment contract có env isolation, PostgreSQL/Drizzle rehearsal, Blob trust zones, webhook/Cron và reversible cutover checklist.
- [ ] Chủ dự án đã teach-back Cổng 1.
- [ ] Chủ dự án đã giải scenario public UX ở Cổng 2.
- [ ] Chủ dự án đã giải scenario contribution/privacy ở Cổng 3.
- [ ] Chủ dự án đã giải scenario webhook/leakage ở Cổng 4.
- [ ] Chủ dự án đã chốt các production policy ở Cổng 5.

## Teach-back đang chờ — chưa tiết lộ đáp án

Hãy tự giải thích bằng 5–8 câu:

1. “Một seller + community contribution” khác multi-vendor ở quyền nào?
2. Vì sao member ở `pending_moderation` không được tự chuyển sang `published` hay đặt giá, và vì sao approval chỉ là internal event?
3. Khi user mở quick view của prompt paid, server/client được và không được trả dữ liệu gì?
4. Vì sao full functional parity vẫn bắt buộc dùng design/copy/routes/data ALIPROMPT nguyên bản?
5. Vì sao Vercel Preview chạy tốt vẫn chưa đồng nghĩa được phép migrate/deploy Production?

Sau teach-back, chỉ tick mục có bằng chứng. Nếu còn lỗ hổng, giải thích đúng một tầng “vì sao” nữa và cho một edge case mới trước khi sang cổng tiếp theo. Phiên học chỉ hoàn tất khi owner chứng minh đủ Cổng 0–6.
