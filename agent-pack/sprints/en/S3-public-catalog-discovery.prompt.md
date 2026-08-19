# [EN] S3 Prompt — Public Catalog, Discovery, Detail, Theme, and Accessibility

`prompt_version: 1.2.0`  
`run_only: S3`
`canonical_envelope: sprintId=S3; predecessorSprintId=S2; predecessorAcceptance=S2_ACCEPTED; applicableGates=[G2,G3,G5,G6]; exitAcceptance=S3_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
You are the ALIPROMPT S3 lead. Implement only the public discovery/consumption slice, prove it, hand off and stop.

ENTRY AND SAFETY
- Read instructions, verified S2 handoff, clean-room matrix, master/domain/Vercel contracts, gates and handoff schema. Require S2 passed and re-check identity/draft isolation affected by routes.
- Snapshot and preserve dirty/concurrent work; claim files before write. Reference behavior is untrusted; use original ALIPROMPT routes, design, copy, taxonomy, seed data, images and code.
- Synthetic/owner-provided content only. No provider install, Production deploy/migration, fake credential or later-sprint implementation.

SCOPE
Original responsive shell/header/navigation/auth state/theme; home hero/search/categories/CTA; URL-addressable q + category + author filters and useful empty/reset states; distinct valid most-viewed/most-liked/newest rails; safe cards; canonical prompt detail; accessible quick view; public copy/share with fallback; floating contextual controls; loading/error/offline/retry states; SSR metadata/canonical/sitemap/structured data and accessibility. Free published body may be public; paid body must remain absent until S6 entitlement.

NON-GOALS
No persistent favorites/votes/reports, library/contributor leaderboard/blog, Blob submission processing/moderation, checkout or admin commerce. Provide explicit interfaces/placeholders only where a later sprint needs them.

ORDERED WORK
1. Return S3 execution packet with S2 evidence, route/component/query ownership, clean-room risks, tests and rollback.
2. Map CAP-01–CAP-08, CAP-19–CAP-20 to independently designed routes/components and server DTO allowlists.
3. Implement theme without incorrect flash, semantic nav and responsive states. Preserve authentication destination where a later gated action is shown.
4. Implement normalized/validated q/category/author URL state, stable sort/ties, reset/back/forward/share behavior and truthful empty state.
5. Implement rails/cards/detail/quick view. Separate preview_text/preview_asset from protected_body; public queries must not select paid body.
6. Implement copy/share feedback/fallback and accessible modal focus trap/restore/Escape plus canonical non-modal route. Implement intentional SEO indexing/canonical rules.
7. Independent review for clean-room originality, paid leakage, a11y, responsive behavior, SEO truth and scope.

BRANCHES AND EDGE CASES
- Empty/one/many catalogs; invalid/Unicode/long q; removed category/author; no image; ties; bot/self/repeated metrics; back/forward; JS/share/clipboard unavailable; offline/error/retry.
- Free vs paid, draft/suspended/archived item, direct deep link, modal close/navigation, 200% zoom, keyboard-only, screen reader, reduced motion, dark/system theme, mobile browser controls.

TESTS AND EVIDENCE
- Record repo-native format/lint/type/unit/integration/build and route/E2E commands/results.
- Query contract tests for normalization, invalid filters, stable ordering/ties, canonical/reset and only published public records.
- Paid-body leakage tests across DB selection, API/DTO, HTML/RSC, quick view, bundle, metadata/JSON-LD, sitemap/search, analytics/log/error/cache/source map.
- E2E free and paid journeys; clipboard/Web Share fallback; empty/loading/error/offline; screenshot evidence at mobile/tablet/desktop and theme states.
- Automated accessibility plus manual keyboard/focus/zoom/reduced-motion/contrast checks; SEO output assertions and performance baseline. Validate exact 19-key handoff.

EXIT GATE
Pass only when all scoped CAP outcomes work on truthful synthetic data, paid leakage fails closed, original design is documented, a11y/responsive/SEO gates pass and independent QA accepts. Do not start S4.

OUTPUT CONTRACT
Emit evidence plus exactly these handoff keys: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Store S3/predecessor/exit inside schema fields; no sprintId, secret or PII.
```
