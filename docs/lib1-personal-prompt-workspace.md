# LIB1 — Personal Prompt Workspace

Date: 2026-08-19  
Status: Implemented locally; Preview and Production are not deployed.

## Decision record

| Decision | Reason | Guardrail |
| --- | --- | --- |
| Collections are private relational references | A prompt can be in many collections without creating copies of content. | Owner-scoped queries; collection deletion cascades only its memberships. |
| Recently Used is an append-only metadata event | Reuse history must follow a real clipboard success, not a page view. | Only user, prompt ID, active version, format, timestamp and opaque UUID key are stored. |
| Notes are one plain-text row per user/prompt | It gives a predictable private note surface without an editor/HTML attack surface. | 2,000-character bound; empty note deletes; no HTML rendering. |
| Paid access is rechecked at action time | A saved reference or old copy must never become an entitlement. | Copy events and reopening paid history check current approved status and entitlement. |

## Data and API contract

- Migration: `0009_far_serpent_society.sql`.
- Tables: `prompt_collections`, `prompt_collection_items`, `prompt_usage_events`, `prompt_notes`.
- All mutations use trusted server session identity plus same-origin validation; request user IDs are ignored because none are accepted.
- Collection limits are 50 per user and 500 items per collection. Creation/item-limit paths use PostgreSQL advisory transaction locks; membership and usage idempotency are unique-index backed.
- Private responses use `Cache-Control: no-store`. No route selects or returns a prompt body for collections, notes, or usage history.

## User flow

1. A signed-in user opens a prompt and can create/select a private collection, add the prompt, and save a plain-text note.
2. A successful browser clipboard write sends a metadata-only idempotent copy event. Failed clipboard writes send nothing.
3. `/library` provides Overview, Saved, Collections and Recently Used. Unavailable prompts remain removable but display no protected content.
4. Reopening a recent paid prompt requires its current entitlement; history itself grants no access.

## Local evidence

- Baseline before implementation: TypeScript, lint, Drizzle check, `npm test`, and production dependency audit passed.
- Final: `npm test` passed: AI contract validation, Drizzle check, production build, 41 JavaScript tests and 1 TypeScript test.
- `npm run lint` and `npx tsc --noEmit` passed.
- Browser smoke check: unauthenticated `/library` safely redirects to login; no horizontal overflow at 360px-equivalent and 1440px local viewports.

## Remaining external gate

No isolated Supabase/Vercel Preview credentials were present. Apply the generated migration only through the authorized Preview migration runner, then run authenticated collection/note/copy E2E and the full 360/390/430/768/1024/1440 × VI/EN × theme matrix. Production remains hold pending explicit owner approval.

## Teach-back checklist

- [ ] Explain why a collection stores prompt IDs rather than prompt bodies.
- [ ] Explain why clipboard success, not page view, creates recent-use history.
- [ ] Explain why a previous copy cannot restore a revoked paid entitlement.
