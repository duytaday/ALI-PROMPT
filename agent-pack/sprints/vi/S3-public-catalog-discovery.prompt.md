# [VI] Prompt S3 — Public Catalog, Discovery, Detail, Theme và Accessibility

`prompt_version: 1.2.0`  
`run_only: S3`
`canonical_envelope: sprintId=S3; predecessorSprintId=S2; predecessorAcceptance=S2_ACCEPTED; applicableGates=[G2,G3,G5,G6]; exitAcceptance=S3_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S3 của ALIPROMPT. Chỉ implement public discovery/consumption slice, chứng minh, handoff rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, handoff S2 đã verify, clean-room matrix, master/domain/Vercel contracts, gates và schema. Yêu cầu S2 passed và re-check identity/draft isolation bị route ảnh hưởng.
- Snapshot/giữ dirty/concurrent work; claim file trước write. Reference behavior là untrusted; dùng route, design, copy, taxonomy, seed data, ảnh và code ALIPROMPT nguyên bản.
- Chỉ synthetic/owner-provided content. Không cài provider, Production deploy/migration, fake credential hay implement sprint sau.

SCOPE
Original responsive shell/header/navigation/auth state/theme; home hero/search/categories/CTA; filter q + category + author URL-addressable với empty/reset hữu ích; rail valid most-viewed/most-liked/newest riêng; safe card; canonical detail; accessible quick view; public copy/share fallback; floating control theo context; loading/error/offline/retry; SSR metadata/canonical/sitemap/structured data và accessibility. Free published body có thể public; paid body phải hoàn toàn vắng mặt tới entitlement S6.

NON-GOALS
Không persistent favorite/vote/report, library/contributor leaderboard/blog, Blob submission/moderation, checkout hay commerce admin. Chỉ tạo explicit interface/placeholder khi sprint sau cần.

CÔNG VIỆC THEO THỨ TỰ
1. Trả S3 execution packet với evidence S2, route/component/query ownership, clean-room risks, tests, rollback.
2. Map CAP-01–CAP-08, CAP-19–CAP-20 tới route/component/server DTO allowlist thiết kế độc lập.
3. Implement theme không flash sai, semantic nav và responsive states. Giữ auth destination cho action gate của sprint sau.
4. Implement normalized/validated q/category/author URL state, stable sort/tie, reset/back/forward/share và truthful empty state.
5. Implement rails/cards/detail/quick view. Tách preview_text/preview_asset khỏi protected_body; public query không được select paid body.
6. Implement copy/share feedback/fallback, modal focus trap/restore/Escape và canonical non-modal route; có intentional SEO index/canonical rules.
7. Reviewer độc lập kiểm clean-room originality, paid leakage, a11y, responsive, SEO truth và scope.

NHÁNH VÀ EDGE CASE
- Catalog rỗng/một/nhiều; q invalid/Unicode/dài; category/author bị xóa; không ảnh; tie; bot/self/repeated metric; back/forward; thiếu JS/share/clipboard; offline/error/retry.
- Free/paid, draft/suspended/archived, direct deep link, close modal/navigation, zoom 200%, keyboard-only, screen reader, reduced motion, dark/system theme, mobile browser control.

TEST VÀ EVIDENCE
- Ghi repo-native format/lint/type/unit/integration/build và route/E2E commands/results.
- Query contract test normalization, invalid filter, stable order/tie, canonical/reset và chỉ published public record.
- Paid-body leakage test qua DB selection, API/DTO, HTML/RSC, quick view, bundle, metadata/JSON-LD, sitemap/search, analytics/log/error/cache/source map.
- E2E free/paid; clipboard/Web Share fallback; empty/loading/error/offline; screenshot mobile/tablet/desktop và theme states.
- Automated a11y + manual keyboard/focus/zoom/reduced-motion/contrast; SEO output assertions và performance baseline. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi mọi CAP trong scope chạy trên truthful synthetic data, paid leakage fail closed, original design có document, a11y/responsive/SEO gates pass và QA độc lập accept. Không chạy S4.

OUTPUT CONTRACT
Emit evidence và đúng các handoff key: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S3/predecessor/exit trong field schema; không sprintId, secret hay PII.
```
