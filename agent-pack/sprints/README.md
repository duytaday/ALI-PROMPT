# ALIPROMPT S0–S7 Paste-ready Sprint Prompts

`pack_version: 1.2.0`  
`deployment_target: native Next.js on Vercel`  
`execution_rule: one sprint per invocation`

Chọn **một** ngôn ngữ và chạy đúng thứ tự. Không nạp hai bản của cùng sprint vào một agent.

| Sprint | Tiếng Việt | English | Kết quả chính |
| --- | --- | --- | --- |
| S0 | [`vi/S0-audit-contracts-adrs.prompt.md`](./vi/S0-audit-contracts-adrs.prompt.md) | [`en/S0-audit-contracts-adrs.prompt.md`](./en/S0-audit-contracts-adrs.prompt.md) | Audit, active contract, ADR, executable spec |
| S1 | [`vi/S1-vercel-foundation-migration.prompt.md`](./vi/S1-vercel-foundation-migration.prompt.md) | [`en/S1-vercel-foundation-migration.prompt.md`](./en/S1-vercel-foundation-migration.prompt.md) | Next.js/Vercel foundation and reversible migration scaffolding |
| S2 | [`vi/S2-identity-rbac-contributor-workspace.prompt.md`](./vi/S2-identity-rbac-contributor-workspace.prompt.md) | [`en/S2-identity-rbac-contributor-workspace.prompt.md`](./en/S2-identity-rbac-contributor-workspace.prompt.md) | Identity, RBAC, member drafts/status workspace |
| S3 | [`vi/S3-public-catalog-discovery.prompt.md`](./vi/S3-public-catalog-discovery.prompt.md) | [`en/S3-public-catalog-discovery.prompt.md`](./en/S3-public-catalog-discovery.prompt.md) | Public parity, detail, theme, accessibility, SEO |
| S4 | [`vi/S4-blob-upload-moderation.prompt.md`](./vi/S4-blob-upload-moderation.prompt.md) | [`en/S4-blob-upload-moderation.prompt.md`](./en/S4-blob-upload-moderation.prompt.md) | Blob quarantine, sanitization, submission, moderation |
| S5 | [`vi/S5-engagement-library-contributors-blog.prompt.md`](./vi/S5-engagement-library-contributors-blog.prompt.md) | [`en/S5-engagement-library-contributors-blog.prompt.md`](./en/S5-engagement-library-contributors-blog.prompt.md) | Engagement, library, profiles, leaderboard, blog |
| S6 | [`vi/S6-single-seller-commerce.prompt.md`](./vi/S6-single-seller-commerce.prompt.md) | [`en/S6-single-seller-commerce.prompt.md`](./en/S6-single-seller-commerce.prompt.md) | ALIPROMPT-only sandbox commerce and entitlements |
| S7 | [`vi/S7-hardening-preview-cutover-gate.prompt.md`](./vi/S7-hardening-preview-cutover-gate.prompt.md) | [`en/S7-hardening-preview-cutover-gate.prompt.md`](./en/S7-hardening-preview-cutover-gate.prompt.md) | Hardening, Preview acceptance, production cutover gate |

## Cách chạy

1. Dán prompt tổng cùng ngôn ngữ nếu chat chưa có context.
2. Dán duy nhất prompt sprint hiện tại.
3. Agent phải đọc repository evidence và handoff sprint trước; kế hoạch/tuyên bố không được tính là capability đã chạy.
4. Chỉ chấp nhận exit khi có command/artifact evidence và handoff validate schema.
5. Lưu handoff vào vị trí do repo/ADR chọn, rồi bắt đầu chat/task mới hoặc invocation mới cho sprint kế.

S0 dùng `predecessorAcceptance: START` và không sửa application code. S1–S7 yêu cầu đúng predecessor label `Sx_ACCEPTED`, predecessor handoff có `acceptance.overallStatus: passed`, cùng evidence/reviewer binding đúng revision và environment; nếu không, agent chỉ được xác minh/sửa blocker thuộc sprint hiện tại khi prompt cho phép và phải dừng. Không sprint nào tự gọi sprint sau.

## Handoff cố định

Mỗi sprint phải validate JSON bằng `agent-pack/schemas/handoff.schema.json`. Handoff có đúng 19 top-level key sau, không thêm `sprintId` hay metadata ngoài schema:

`schemaVersion`, `handoffVersion`, `handoffId`, `createdAt`, `objective`, `scope`, `repository`, `repoEvidence`, `ownership`, `decisions`, `trustBoundaries`, `changes`, `tests`, `acceptance`, `security`, `risks`, `rollback`, `nextOwner`, `approvals`.

Sprint ID, predecessor acceptance, applicable gates, requested exit acceptance và reviewer acceptance được ghi trong `objective`, `scope`, `decisions`, `acceptance` và `approvals` phù hợp schema.

## Quyền Production

Bộ prompt là specification/implementation workflow, không phải quyền deploy. Không agent nào được bịa hoặc xin credential trong chat, cài live provider, chạy production migration, charge/refund thật, đổi DNS/domain/alias hay deploy Production nếu thiếu phê duyệt rõ action + target + commit + migration + rollback. S7 có thể kết thúc ở trạng thái **ready, approvals pending**; đó là kết quả đúng, không phải lý do giả pass.
