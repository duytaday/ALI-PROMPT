# ALIPROMPT — Program Goal

`goal_id: ALIPROMPT-FULL-PARITY-ENHANCE-V1`  
`version: 1.0.0`  
`status: approved-next`  
`reference: https://promptvn.com/`  
`delivery_model: Product Owner + Dev 1 + specialist agents + independent QA`  
`roadmap: S0-S7`

## Goal chính

Thiết kế, xây dựng, kiểm chứng và chuẩn bị phát hành **ALIPROMPT** thành một nền tảng prompt production-grade có **clean-room full functional parity với toàn bộ user outcome công khai hữu ích của `promptvn.com`**, đồng thời bổ sung các enhancement nguyên bản, đo lường được để ALIPROMPT tốt hơn về:

- trải nghiệm và design system;
- catalog, search và discovery;
- accessibility, responsive và performance;
- technical SEO và content discoverability;
- contribution, moderation và community trust;
- authentication, privacy và account security;
- single-seller commerce, payment integrity và entitlement;
- observability, data safety, rollback và khả năng vận hành trên Vercel.

Goal không cho phép sao chép pixel, source code, private API, DOM/CSS structure, brand, logo, copy, prompt body, catalog/member data, image hoặc asset của website tham chiếu. ALIPROMPT phải dùng route, information architecture, design system, taxonomy, copy, dữ liệu, visual và code nguyên bản.

## Product contract

- Brand duy nhất là **ALIPROMPT**.
- V1 có đúng một commercial seller là ALIPROMPT.
- ALIPROMPT độc quyền tạo/định giá prompt trả phí, checkout, nhận doanh thu, refund và quản trị entitlement.
- Authenticated member được tạo owned draft, upload optional media và submit prompt miễn phí để moderation.
- Contributor không tự publish, đặt giá, xem payment, refund, nhận payout/commission, KYC hoặc trở thành seller.
- Guest submission mặc định tắt; multi-vendor nằm ngoài V1.
- Prompt trả phí chỉ lộ independent preview trước khi server xác nhận entitlement.

## Mandatory functional scope

### Public shell và homepage

- Header, primary/category navigation và auth state.
- Light/dark/system theme có lưu preference.
- Hero, primary search, category discovery và CTA nguyên bản.
- Floating actions, favorites/create shortcut và back-to-top.
- Responsive, keyboard, focus, contrast và reduced-motion support.

### Catalog và discovery

- Search bằng `q` kết hợp category và author/public handle.
- URL-addressable filters, canonical/reset behavior và useful empty state.
- Most-viewed, most-liked và newest rails có deterministic sorting/tie-break.
- Prompt cards có safe image, category, title, author, truthful signals và free/paid status.
- Stable detail route và accessible quick-view modal.
- Free prompt có thể hiển thị/copy full body theo policy; paid prompt chỉ public preview.

### Actions và identity

- Copy, share, favorite, upvote, downvote và report.
- Authentication gates giữ destination.
- Register, login, logout, forgot/reset password và secure session lifecycle.
- Favorites/library tách favorite, free grant và paid entitlement.

### Contribution và moderation

- Member-owned create/edit/discard/upload/submit/status workspace.
- Scoped expiring upload intent và private Vercel Blob quarantine.
- Decode/re-encode, normalize orientation, strip metadata và bounded public derivatives.
- Mặc định 0–4 ảnh, 3 MiB/ảnh, 12 MiB tổng, JPEG/PNG/WebP, tối đa 4096×4096.
- CSRF, request/rate limits, anti-spam, dedupe, optional challenge và audit.
- Contributor-visible states có đúng:
  `draft`, `pending_moderation`, `changes_requested`, `rejected`, `published`.
- Chỉ authorized moderator/operator được đưa submission vào `published`.

### Community và editorial

- Privacy-safe contributor profiles.
- Abuse-resistant leaderboard top 1–50 với stable sorting/tie-break và opt-in rules.
- Blog empty/list/detail, metadata, canonical và structured data.
- Owner/admin blog draft, preview, review, publish, unpublish và archive.

### Commerce

- Server-authoritative price, currency, license và version.
- Integer minor units và immutable order snapshot.
- Provider-neutral sandbox checkout.
- Raw-body signature verified, environment-bound, idempotent webhook.
- Durable fulfillment, event ledger và reconciliation.
- Entitlement, protected reveal/copy, buyer history, refund/dispute/revoke.
- Contributor commerce escalation phải bị từ chối server-side.

### Owner administration

- Product draft/review/publish/suspend/archive/version/price/license.
- Submission/report moderation.
- Blog lifecycle administration.
- Least-privilege commerce inspection và privileged action audit.

## Enhancement contract

Parity và enhancement là hai lane riêng.

Mỗi enhancement phải có:

- enhancement ID;
- target user và problem;
- hypothesis;
- expected user/business outcome;
- baseline/target nếu có evidence;
- metric và guardrail;
- dependency, effort và risk;
- experiment/acceptance;
- rollback hoặc kill switch;
- owner và revisit trigger.

Enhancement không được dùng để che parity gap. Security, privacy, accessibility, performance, operability và data integrity enhancement có thể được làm cùng slice nếu là điều kiện bắt buộc để ship an toàn.

## Technical target

- Native Next.js trên Vercel.
- Git-based isolated Preview trước Production.
- Provider-neutral PostgreSQL qua current Vercel Marketplace integration.
- Drizzle với explicit D1/SQLite-to-PostgreSQL compatibility audit và translated migrations.
- Resumable backfill + count/hash/state/referential/money reconciliation.
- Private quarantine Blob store và separate public sanitized-assets Blob store.
- Typed environment schema và isolated Development/Preview/Production resources.
- Provider-neutral auth, email, payment và observability adapters.
- Signed/idempotent webhook và authenticated/locked/idempotent Cron maintenance.
- Legacy vinext/Cloudflare/D1 được giữ tới khi parity, migration, rollback và observation evidence pass.

## Delivery roadmap

| Sprint | Outcome |
| --- | --- |
| S0 | Repository/current-target audit, active contract, capability ledger, route/journey/AC, ADRs; không sửa application code |
| S1 | Native Next.js/Vercel foundation, env isolation, Preview readiness và PostgreSQL migration scaffolding |
| S2 | Identity/session/RBAC/audit và member-owned contributor workspace |
| S3 | Original ALIPROMPT design system, public catalog/discovery/detail/theme/a11y/SEO |
| S4 | Blob quarantine/sanitization, submission, moderation và authorized free publication |
| S5 | Engagement, library, contributor profile, leaderboard và blog |
| S6 | ALIPROMPT-only sandbox checkout/webhook/entitlement/refund/reconcile |
| S7 | Full hardening, isolated Preview acceptance, migration/restore/rollback rehearsal và Production go/no-go packet |

## Definition of done

Program chỉ được gọi là hoàn thành khi:

1. Mọi public capability hữu ích có artifact + evidence hoặc explicit owner exclusion.
2. Mỗi capability đã đi qua:
   `observed -> specified -> planned -> implemented -> verified -> released`.
3. Mọi selected enhancement có hypothesis/metric/guardrail và evidence.
4. S0-S7 có valid predecessor handoff, independent QA và Product Owner acceptance.
5. Full golden journeys và negative tests pass trên cùng immutable isolated Vercel Preview.
6. Không leak paid body, PII, secret hoặc raw upload.
7. Database/Blob migration, backup, restore, reconciliation và rollback đã rehearsal.
8. Production action có exact human approval và production-safe smoke evidence; nếu chưa có thì trạng thái là `release-ready, approvals-pending`.

## Non-goals

- Pixel clone hoặc copy protected reference material.
- Multi-vendor, seller onboarding, contributor pricing, revenue share, payout, KYC hoặc tax splitting.
- Auto-publish/auto-ban/auto-price/auto-refund bằng LLM.
- Production provider activation, migration, deploy, DNS/domain/alias hoặc live money không có exact human approval.
- Gọi plan, mockup, code generation hoặc agent claim là release evidence.

## Acceptance authority

- Human owner: product mode, legal/policy, real providers/prices và Production authority.
- Product Owner: problem, outcome, parity/enhancement scope, priority, metric và product acceptance.
- Dev 1: architecture, implementation, tests và rollback trong approved sprint.
- Independent QA: technical verdict trên exact revision và evidence.

Không actor nào được tự mở rộng quyền của mình hoặc waive critical security/privacy/payment/data/accessibility blocker.
