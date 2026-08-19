# UX-01 — Find → Save → Reuse

## Audit outcome

Favorites began this sprint as **partial**: the `favorites` PostgreSQL table, per-user unique constraint, authenticated same-origin API, and card/detail control already existed. The feature was not complete because it lacked a recently-saved index, idempotent set-state contract, race-safe optimistic UI, a dedicated Favorites destination, filters/search, unavailable-item handling, and localized feedback.

The worktree was already dirty before this sprint. Existing changes were preserved; no reset, checkout, production deployment, entitlement, or commerce behavior was performed.

## Implemented contract

- PostgreSQL remains the source of truth. Migration `0007_tough_richard_fisk.sql` adds `favorites(user_id, created_at)` and additive prompt metadata for model compatibility/content language.
- `PUT /api/favorites/:promptId` accepts `{ "favorited": boolean }`, enforces same-origin plus authenticated user, verifies public availability only when saving, and scopes deletion to the current user. The earlier POST/DELETE endpoints remain as compatibility aliases.
- The control is optimistic, rolls back on an error, and uses a monotonically increasing request id so a late response cannot overwrite the last click intent.
- `/library/favorites` is now an authenticated private destination, sorted by `favorites.created_at DESC`, with URL-backed search/category/access filters, empty/no-result/loading/error states, and an unavailable state that never exposes an archived/private prompt's title, body, author, or metadata.
- Card facts now state access, model compatibility, and content language without exposing paid prompt body. Favorite and prompt-detail links remain separate interactive targets.

## UX guardrails

- Search/filter state is URL-backed; each active filter and Clear all are visible.
- Saved prompts are private bookmarks, not likes, purchases, entitlements, recently viewed items, or recommendation signals. Copying/opening does not save a prompt.
- Favorites is reachable through signed-in account navigation and the mobile account drawer.
- Cards clamp title and description, preserve the existing responsive theme tokens, and avoid horizontal page overflow.

## Evidence

- Local browser at 1280px: 12 cards render model/language facts, no horizontal overflow; URL `?q=brief&order=popular` renders three active-filter controls; signed-out Save opens the accessible dialog with a safe prompt return path.
- `npx tsc --noEmit`, `npm run lint`, and `node --test tests/foundation.test.mjs` pass (31 tests).

## Remaining release gate

The local browser integration is fixed at a 1280px viewport, so exact 390×844, 768×1024, and 1440×900 screenshot evidence must be captured on Vercel Preview with a configured PostgreSQL database/session. Production was not deployed. Apply migration `0007_tough_richard_fisk.sql` before enabling the new model/language fields in Preview or Production.
