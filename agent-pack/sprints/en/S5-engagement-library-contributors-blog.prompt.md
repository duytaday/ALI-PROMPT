# [EN] S5 Prompt — Engagement, Library, Contributors, Leaderboard, and Blog

`prompt_version: 1.2.0`  
`run_only: S5`
`canonical_envelope: sprintId=S5; predecessorSprintId=S4; predecessorAcceptance=S4_ACCEPTED; applicableGates=[G2,G3,G5,G6]; exitAcceptance=S5_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
You are the ALIPROMPT S5 lead. Implement only engagement/personal/community/editorial outcomes, prove them, hand off and stop.

ENTRY AND SAFETY
- Read instructions, passed S4 handoff, master/domain/Vercel contracts, matrix, gates and schema. Re-check member ownership, public DTO and paid-body/upload boundaries.
- Snapshot dirty/concurrent work, claim exact files and preserve unrelated changes. Use synthetic/owner content; no scraped filler, fake credentials, live provider, Production migration/deploy or S6 commerce.

SCOPE
Login-gated favorites; mutually exclusive idempotent up/down votes; tightly rate-limited guest/member reports; personal library that clearly separates favorites, free grants and future paid-entitlement records without revealing protected body; privacy-safe contributor pages; opt-in abuse-resistant top-1–50 leaderboard by approved contributions/valid views/valid likes; blog honest empty/list/detail and owner/admin draft/preview/review/publish/unpublish/archive with correct SEO.

NON-GOALS
No checkout, payment webhook, real paid entitlement fulfillment/refund, contributor selling, guest contribution activation or Production scheduling/deploy. S6 owns commerce state; use an explicit interface/test fixture only.

ORDERED WORK
1. Return execution packet with S4 evidence, trust/privacy/abuse boundaries, owned paths, metrics, tests and rollback.
2. Implement favorite/vote/report uniqueness, ownership, idempotency, optimistic rollback and announced UI feedback. Preserve intended destination through auth gates.
3. Implement library DTOs and sections with server ownership checks. A placeholder paid record never contains protected_body and cannot grant access.
4. Implement public contributor allowlist/consent and published-free-only queries. Exclude drafts/rejected/changes/suspended/private fields.
5. Implement leaderboard metric allowlist and clamp 1–50; stable tie-breaks from domain contract; filter bots/self/repeats and moderation-ineligible profiles.
6. Implement blog state/authorization, private noindex preview, published-only list/feed/sitemap/structured data and honest empty state.
7. Independent trust/privacy/a11y/SEO review and abuse scenario review.

BRANCHES AND EDGE CASES
- Anonymous favorite/vote, repeated/concurrent toggle, change vote direction, deleted/suspended prompt, optimistic failure, duplicate/spam report, abusive self/bot/repeated events.
- Empty library, same prompt in multiple sections, revoked/future entitlement, wrong-user IDOR, contributor opt-out/rename/confusable handle, ties/invalid metric/limit, guest pseudonym privacy.
- Empty blog, draft preview leak, stale publish, unpublish/republish, invalid slug/canonical, article deletion, structured-data claims without DB truth.

TESTS AND EVIDENCE
- Record repo-native format/lint/type/unit/integration/build and migration commands/results.
- DB/API concurrency and uniqueness tests for favorites/votes/reports; auth gate destination and optimistic rollback E2E; abuse/rate/dedupe tests.
- Negative IDOR/privacy/PII tests for library/profile/leaderboard/report/blog preview and public DTO/log/metadata/sitemap.
- Leaderboard deterministic sorting/ties/metric allowlist/1–50 clamp/abuse filtering tests with fixed fixtures.
- Blog state/auth/SEO tests plus empty/list/detail/preview/publish/unpublish E2E; keyboard/mobile/a11y checks. Validate exact 19-key handoff.

EXIT GATE
Pass only when engagement is idempotent/abuse-resistant, library/profile/leaderboard privacy fails closed, blog public/admin journeys and SEO are truthful, no protected content leaks and independent QA accepts. Do not start S6.

OUTPUT CONTRACT
Emit evidence and exactly: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Encode S5/predecessor/exit within schema fields; no sprintId, secret or raw PII.
```
