# Master prompt — Sprint 0 audit (2026-08-19)

## Clean-room boundary

The public homepage of PromptVN was inspected only to record generic jobs and information hierarchy: discovery/search, category selection, ranked prompt shelves, a card-level use/report path, and signed-out authentication entry. No source, assets, image URLs, taxonomy labels, prompt bodies, copy, account data, or private flows were used in ALIPROMPT.

## Current parity/gap matrix

| Area | Status | Evidence / next action |
| --- | --- | --- |
| Shared shell, theme, locale, mobile drawer | Implemented, local verified | Typed VI/EN dictionaries and Light/Dark/System control exist; real device/Preview sweep remains. |
| Discovery, topics, URL search/sort/pagination | Implemented, partial | Keyword/topic/order state, chips and rails exist. Model/language/access filtering and mobile filter sheet remain. |
| Prompt cards | Implemented, partial | Outcome, category, model/language, access, view, reaction and private save exist. Card-level Copy/Use and secondary report menu remain. |
| Prompt detail/use | Implemented, partial | Server entitlement guard, media, favorite, reactions and report exist. Variable form/preview/copy added in this sprint; quick-view/share/related prompts remain. |
| Favorites/library | Implemented, local verified | Private idempotent API, optimistic rollback, dedicated saved list and unavailable state exist; authenticated DB/browser E2E remains. |
| Submit/moderation/admin/commerce | Implemented, local verified | See Phase 1 audit; external Preview services remain required. |
| SEO/performance/Preview QA | Not accepted | No isolated Vercel Preview, browser matrix, Lighthouse or independent QA evidence yet. |

## Baseline commands

- `npx tsc --noEmit` — pass
- `npm run lint` — pass
- `node --test tests/foundation.test.mjs` — pass
- `npm run build` — pass

## Risks and gates

- Worktree was already broadly dirty; no user changes were reset or discarded.
- Local mode has no PostgreSQL session fixtures, so cross-user, entitlement, and persisted-favorite browser E2E cannot be claimed.
- The available browser viewport is fixed at 1280px. The 360/390/430/768/1024/1440 screenshot matrix requires Vercel Preview/device emulation.
- Production deployment remains prohibited without Product Owner approval.
