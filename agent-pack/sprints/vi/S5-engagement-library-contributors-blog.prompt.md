# [VI] Prompt S5 — Engagement, Library, Contributors, Leaderboard và Blog

`prompt_version: 1.2.0`  
`run_only: S5`
`canonical_envelope: sprintId=S5; predecessorSprintId=S4; predecessorAcceptance=S4_ACCEPTED; applicableGates=[G2,G3,G5,G6]; exitAcceptance=S5_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
Bạn là lead S5 của ALIPROMPT. Chỉ implement engagement/personal/community/editorial outcomes, chứng minh, handoff rồi dừng.

ENTRY VÀ AN TOÀN
- Đọc instruction, handoff S4 đã pass, master/domain/Vercel contracts, matrix, gates và schema. Re-check member ownership, public DTO, paid-body/upload boundaries.
- Snapshot dirty/concurrent work, claim exact file và giữ unrelated changes. Chỉ dùng synthetic/owner content; không scraped filler, fake credential, live provider, Production migration/deploy hay S6 commerce.

SCOPE
Login-gated favorite; up/down vote loại trừ nhau và idempotent; guest/member report rate-limit chặt; personal library tách rõ favorite, free grant và future paid-entitlement record nhưng không reveal protected body; privacy-safe contributor page; opt-in abuse-resistant leaderboard top 1–50 theo approved contributions/valid views/valid likes; blog honest empty/list/detail và owner/admin draft/preview/review/publish/unpublish/archive đúng SEO.

NON-GOALS
Không checkout, payment webhook, real paid-entitlement fulfillment/refund, contributor selling, bật guest contribution hay Production scheduling/deploy. S6 sở hữu commerce state; chỉ dùng explicit interface/test fixture.

CÔNG VIỆC THEO THỨ TỰ
1. Trả execution packet với evidence S4, trust/privacy/abuse boundary, owned path, metrics, tests, rollback.
2. Implement favorite/vote/report uniqueness, ownership, idempotency, optimistic rollback và announced UI feedback. Giữ intended destination qua auth gate.
3. Implement library DTO/section với server ownership. Placeholder paid record không chứa protected_body và không grant access.
4. Implement public contributor allowlist/consent và published-free-only query. Loại draft/rejected/changes/suspended/private field.
5. Implement leaderboard metric allowlist và clamp 1–50; stable tie-break theo domain contract; filter bot/self/repeat và profile không đủ moderation.
6. Implement blog state/auth, private noindex preview, published-only list/feed/sitemap/structured data và honest empty state.
7. Independent trust/privacy/a11y/SEO review và abuse scenario review.

NHÁNH VÀ EDGE CASE
- Anonymous favorite/vote, repeated/concurrent toggle, đổi vote direction, deleted/suspended prompt, optimistic failure, duplicate/spam report, abusive self/bot/repeated event.
- Library rỗng, cùng prompt nhiều section, revoked/future entitlement, wrong-user IDOR, contributor opt-out/rename/confusable handle, tie/invalid metric/limit, guest pseudonym privacy.
- Blog rỗng, draft preview leak, stale publish, unpublish/republish, invalid slug/canonical, article deletion, structured-data claim không có DB truth.

TEST VÀ EVIDENCE
- Ghi repo-native format/lint/type/unit/integration/build và migration command/result.
- DB/API concurrency + uniqueness cho favorite/vote/report; auth destination + optimistic rollback E2E; abuse/rate/dedupe tests.
- Negative IDOR/privacy/PII cho library/profile/leaderboard/report/blog preview và public DTO/log/metadata/sitemap.
- Leaderboard deterministic sort/tie/metric allowlist/clamp 1–50/abuse filter bằng fixed fixtures.
- Blog state/auth/SEO + empty/list/detail/preview/publish/unpublish E2E; keyboard/mobile/a11y. Validate handoff đúng 19 key.

EXIT GATE
Chỉ pass khi engagement idempotent/chống abuse, library/profile/leaderboard privacy fail closed, blog public/admin + SEO truthful, không protected-content leak và QA độc lập accept. Không chạy S6.

OUTPUT CONTRACT
Emit evidence và đúng: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Ghi S5/predecessor/exit trong field schema; không sprintId, secret hay raw PII.
```
