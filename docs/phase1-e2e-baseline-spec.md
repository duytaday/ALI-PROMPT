# ALIPROMPT — Phase 1 E2E Baseline Specification

This is the executable-test contract to be implemented once the native Next.js foundation exists. Fixtures use only original ALIPROMPT records and test payment events.

| ID | Flow | Preconditions | Expected outcome | Evidence |
| --- | --- | --- | --- | --- |
| P1-001 | Visitor discovers home catalog | Seeded published free prompts | Shell, search controls, ranked shelves, cards and floating utilities are usable | Desktop/tablet/mobile E2E + screenshots |
| P1-002 | Visitor searches and filters | Seeded prompts across original topics | Query/topic survive URL reload; matching results shown | E2E + server validation test |
| P1-003 | Visitor receives no results | No matching fixture | Explicit empty state and recovery path, no error | E2E + screenshot |
| P1-004 | Visitor opens prompt and copies | Published free prompt | Original prompt-use dialog opens; copy announces success; dialog closes by button/Escape | Keyboard + clipboard E2E |
| P1-005 | Visitor saves/votes without account | Signed out | Auth gate; no favorite/reaction row created | E2E + database assertion |
| P1-006 | Member favorites and un-favorites | Signed-in member | Idempotent state change, Library reflects it | E2E + database assertion |
| P1-007 | Member reports a prompt | Signed-in member | Report validation, success state, moderation item and audit event created | E2E + admin assertion |
| P1-008 | Member submits free prompt | Signed-in contributor | Valid staged media/submission enters pending review; never public immediately | E2E + state-machine assertion |
| P1-009 | Invalid or abusive submission | Signed-in member; invalid fixture | File/body/rate-limit error with retry guidance; no public record | Negative E2E |
| P1-010 | Editor moderates submission | Editor role | Approve/reject needs reason and writes audit event; approved item becomes discoverable | E2E + audit assertion |
| P1-011 | Auth lifecycle | Visitor/member fixture | Register, verify, login, logout, recovery request; neutral anti-enumeration message | E2E + security assertions |
| P1-012 | Private Library authorization | Two signed-in members | A member cannot read or mutate another member's favorites/library/entitlement | Cross-user E2E |
| P1-013 | Contributor and leaderboard | Multiple approved contributors | Public profile contains minimized data; deterministic score/tie policy; no email field | E2E + privacy snapshot |
| P1-014 | Blog lifecycle | Draft and published original article fixtures | Index has empty/populated states; unpublished article not public; metadata/canonical present | E2E + HTML metadata assertion |
| P1-015 | Start checkout | Signed-in member; ALIPROMPT product | Server-resolved product/price; correct pending order; no client price trusted | E2E + database assertion |
| P1-016 | Payment callback abuse resistance | Provider event fixtures | Invalid signature/replay/mismatch do not grant; one verified event grants once | Integration tests |
| P1-017 | Entitled content | Member with verified grant | Paid resource appears in private Library; non-entitled user sees gated preview | Cross-user E2E |
| P1-018 | Admin operations authorization | Visitor/editor/admin fixtures | Protected routes/actions enforce least privilege and generate audit events | Role matrix E2E |
| P1-019 | Accessibility baseline | All public routes | No critical automated violations; keyboard/focus/error announcement contracts work | axe + manual test record |
| P1-020 | SEO/performance baseline | Preview build | Sitemap, robots, canonical, structured data, image policy, route budgets pass | Preview crawl + Lighthouse |
| P1-021 | Failure/retry baseline | Controlled provider/database/upload failures | User gets safe error and retry path; no double-write or leaked detail | E2E + logs review |

## Required fixture rules

* Use isolated Preview database/schema and Blob prefix only.
* Never place reference prompt body, author identity, asset, category label, or customer data in fixtures.
* Payment fixtures are signed by a test-only key and cannot be accepted in Production.
* Every test resets through migrations/seeds; tests do not depend on production data or reference-site availability.
