# ALIPROMPT UX/UI enhancement report

## Scope and safety boundary

This implementation improves the shared marketplace presentation only. It does not alter PostgreSQL queries, auth/authorization, paid-content entitlement checks, checkout verification, or Blob handling. The local catalog preview remains development-only and explicitly labelled; production still requires its own database configuration.

## Audit findings

| Priority | Finding | Impact | Resolution |
| --- | --- | --- | --- |
| P0 | At the mobile breakpoint the header wrapped/overflowed its links instead of offering a replacement navigation path. | Visitors could not reliably reach core public flows on a phone. | Added an accessible mobile drawer with all public destinations, account links, backdrop close, Escape handling, body scroll lock, focus entry, and a keyboard Tab trap. |
| P1 | No common motion contract governed interactive controls. | Hover/focus feedback was inconsistent and could ignore reduced-motion preferences. | Added marketplace-scoped duration/easing tokens, transform/opacity-only entrance/interaction motion, and a global reduced-motion override. |
| P1 | Copy and access state had limited visual feedback. | Users could not immediately confirm copy completion or distinguish free and paid cards at a glance. | Added copy confirmation with `aria-live`, clear free/paid pills that do not rely only on color, and improved card/button feedback. |
| P1 | Global loading state gave no layout preview. | Perceived latency was higher and the transition to content felt abrupt. | Added fixed-size skeleton lines with a reduced-motion fallback. |
| P2 | Header/nav hierarchy and card affordance were visually flat. | Discovery actions were less scannable. | Added active navigation indicator, focus styles, card lift only on fine-pointer hover, stronger search focus state, safe-area spacing, and 44px mobile targets. |

## Implemented changes

- `app/_components/MarketplaceNavigation.tsx`: new client-only responsive navigation layer; no server data access.
- `app/_components/MarketplaceShell.tsx`: replaces the old three-link nav with the shared navigation component while preserving all existing account/auth actions.
- `app/_components/CatalogSearch.tsx`: adds a stable `#catalog-search` target for the Topics navigation path.
- `app/_components/PromptCard.tsx`: clearer semantic free/paid state.
- `app/_components/PromptCopyButton.tsx`: visible copy status plus screen-reader announcement.
- `app/_components/FavoriteButton.tsx`: Tab focus containment for the existing sign-in dialog.
- `app/loading.tsx`: lightweight, layout-stable skeleton state.
- `app/globals.css`: marketplace-scoped design/motion tokens, responsive shell rules, drawer motion, input/card feedback, safe-area handling, and `prefers-reduced-motion` guardrails.
- `tests/foundation.test.mjs`: source-level regression evidence for mobile navigation, reduced motion, and feedback affordances.

## Before / after behavior

| Scenario | Before | After |
| --- | --- | --- |
| Mobile navigation | Header links could wrap or require horizontal scrolling. | A 44px menu opens a focus-managed drawer containing catalog, topics, submit, library, leaderboard, blog, and account destinations. |
| Keyboard interaction | Save dialog supported Escape but did not contain Tab. | Save dialog and mobile drawer both retain keyboard focus until closed; closing returns focus to the trigger. |
| Motion preference | No common marketplace motion contract. | Motion uses named durations/easing and is effectively disabled for `prefers-reduced-motion: reduce`. |
| Copy feedback | Announced only through a visually hidden message. | Button changes to “Đã sao chép” and a visible `role=status` message confirms the result. |
| Loading | Text-only waiting state. | Text remains available while skeleton lines retain the expected visual rhythm. |

## Evidence

- Local desktop smoke at `http://127.0.0.1:3000/`: header, catalog search, active nav state, and preview content render without console errors or horizontal overflow at the available 1280px browser viewport.
- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `node --test tests/foundation.test.mjs`: pass (26 tests after the UX regression test was added).
- `npm run build`: pass; all listed Next.js routes compile successfully.

## Responsive and accessibility guardrails

- CSS includes 800px and 560px breakpoints; the header changes from desktop nav to drawer, forms stack, type uses `clamp()`, touch targets are at least 44px, and safe-area insets are applied to drawers/floating controls.
- The drawer does not remove destinations from the information architecture. It only changes the presentation at small widths.
- The navigation uses semantic `nav`, labelled controls, `aria-expanded`, `aria-controls`, keyboard Escape, a Tab loop, and visible `:focus-visible` states.
- Paid prompt rendering and entitlement logic were not touched. No full paid prompt body is added to client data.

## Known gaps / next verification gate

- This workspace has no configured local PostgreSQL development database, so live data-backed prompt detail, auth, submission, favorites, admin, and checkout paths cannot be exercised end-to-end from this local machine. Their existing server-side boundaries were intentionally left intact.
- The in-app browser available during this change was fixed at a desktop viewport. Breakpoint behavior is covered by the implemented responsive CSS and source regression test, but the required 360/390/430/768/1024 screenshot sweep remains a Vercel Preview gate.
- No Production deployment was made. Vercel Preview is technically build-ready, but should be created only with isolated Preview environment variables and Product Owner approval.

## Typography consistency enhancement (2026-08-19)

- **Baseline issue:** old display selectors forced Georgia while most UI inherited a missing Geist variable and fell back to a system sans-serif. This made headings such as “Mới xuất bản” visually inconsistent.
- **Change:** a single Vietnamese-friendly UI font stack now applies to body text, navigation, labels, forms, cards, headings, editorial content, and legacy components. Only `pre`/`code` retain an explicit monospace stack for prompt and technical-content alignment.
- **Evidence:** local browser computed the identical UI stack for the body, catalog hero heading, section heading, prompt-card title, input, and button. Lint, TypeScript, foundation tests, and the production build pass.
- **Guardrail:** source regression coverage requires the UI and code font tokens plus the component-wide typography rule, preventing a new route from silently restoring the serif fallback.

## Topic carousel enhancement (2026-08-19)

- **Baseline issue:** topic discovery appeared only as small static chips after the form, making it easy to miss before a visitor starts typing.
- **Change:** the catalog now presents a horizontal, link-based topic rail before search. It preserves the current keyword/sort when selecting a topic, marks the active topic, supports touch/trackpad scrolling, and adds labelled previous/next controls on larger viewports. Static links remain functional if JavaScript is unavailable.
- **Evidence:** local browser confirmed the rail renders before the search form, has no horizontal page overflow, and selecting “Làm rõ brief” navigates to `/vi?topic=lam-ro-brief` with the selected state and filtered result view.
- **Guardrail:** source regression tests require the carousel placement, bounded scroll behavior, navigation labels, selection state, and both VI/EN copy keys.

## Guest prompt-submission enhancement (2026-08-19)

- **Baseline issue:** `/submit` redirected every signed-out visitor to account creation, adding friction before they could share a free community prompt.
- **Change:** the form is public and has the requested author name, category, title, prompt content, optional image, and simple math anti-spam fields. A signed-in visitor can still submit; that contribution is linked to their user account, while a guest uses the submitted display name. Both paths create only a free, pending community prompt.
- **Safety guardrails:** same-origin enforcement, a signed 20-minute challenge, a hidden honeypot, a 3-per-IP/15-minute server-side rate limit, active-category validation, private media staging, and moderator-only approval remain in force. Guest identity never grants account, contributor, admin, payment, or library access.
- **Data change:** `prompts.guest_author_name` is introduced by migration `0006_motionless_silk_fever`; public cards/detail and moderation show the appropriate user or guest attribution without crediting a guest prompt to ALIPROMPT.
- **Deployment requirement:** set a distinct, long random `SUBMISSION_CAPTCHA_SECRET` in Preview and Production and apply the database migration before enabling the public endpoint.

## Prompt-card reaction enhancement (2026-08-19)

- **Baseline issue:** likes/dislikes existed only on the prompt detail page, so visitors could not evaluate a prompt while browsing catalog cards.
- **Change:** every `PromptCard` now displays distinct useful/not-useful counts and controls. A signed-in user can choose like, choose dislike, switch between them, or click the active control again to remove their reaction. Signed-out visitors see the counts and are sent to login with a safe return path before they can react.
- **Safety and correctness:** the shared reaction endpoint remains same-origin, authentication-bound, and restricted to approved prompts. Reaction count deltas and the per-user reaction record update in one transaction; the card refreshes the viewer’s current state through the approved-prompt endpoint.
- **Evidence:** local browser showed both action controls, correct 16px SVG icons, separate 96/3 counts, and no horizontal overflow. Lint, TypeScript, static regression tests, and production build pass.

## Newest-prompt visual masonry enhancement (2026-08-19)

- **Baseline issue:** every discovery shelf used a horizontal rail, so the newest prompts did not create the visual browsing rhythm needed for image-backed community work.
- **Change:** the newest shelf now uses a responsive masonry layout. Each visual card keeps its category, access state, author/meta, reaction controls, and saved state. Approved prompt media is shown through the existing access-controlled media route; prompts without media use an original ALIPROMPT gradient placeholder rather than borrowed reference artwork.
- **Responsive guardrail:** four fluid columns on wide screens contract to two columns below 900px and one below 600px; cards use `break-inside: avoid` so no content is cut between columns.
- **Data/security guardrail:** the catalog selects only the first validated/public media identifier for each already-approved prompt. It does not expose Blob keys, private/pending media, paid prompt body, or any new client-side entitlement data.

## Responsive viewport enhancement (2026-08-19)

### What changed

- The root viewport now declares `width=device-width`, `initial-scale=1`, and `viewport-fit=cover`; mobile safe-area insets protect the header, drawer, page gutters, floating actions, and footer.
- The layout follows explicit guardrails: two-column catalogue/product grids at 1024px and below, tighter safe-area-aware gutters at 900px, a single-column form/grid layout at 600px and below, and compact type/rails at 360px and below.
- Long content may shrink within its grid/flex container; media cannot exceed its container; the document clips accidental horizontal paint overflow.
- Floating actions become normal in-flow, wrapping 44px-touch-target actions on phones so they never obscure the last content or browser controls.
- At constrained desktop/tablet widths the full nav consistently swaps for the accessible drawer before it can collide with account controls. The menu icon now has an explicit 20px three-bar grid, preventing the blank-button regression.

### Evidence and remaining gate

- Local browser check at 1280px: `width=device-width, initial-scale=1, viewport-fit=cover` present; no horizontal overflow; the 44px menu opened a 420px drawer, locked background scroll, and kept the drawer inside the viewport.
- Source regression tests now assert the 1024px/600px breakpoints, safe-area usage, viewport declaration, and visible 20px menu bars. Lint, TypeScript, production build, and the foundation test suite pass.
- The available local browser is fixed at 1280px. A real 320/360/390/430/768/1024 device screenshot sweep remains required on Vercel Preview before release; this is not represented as complete.

## Locale and theme extension (in progress)

### Architecture implemented

- `proxy.ts` canonicalizes public page URLs to `/vi` or `/en`, honors a stored `aliprompt-locale` choice before `Accept-Language`, and rewrites only once to retain the existing App Router route tree. API and asset paths are excluded.
- `messages/vi/common.ts` is the source dictionary shape. `messages/en/common.ts` is typed against that shape, so a missing shared key is a TypeScript failure.
- `lib/i18n.ts` centralizes valid locales and typed dictionary access.
- `app/layout.tsx` reads the proxied locale for `<html lang>`, locale-specific root metadata, canonical/hreflang alternates, and locale-specific Open Graph metadata.
- `LocaleSwitcher` preserves pathname, query string, and hash while persisting the explicit choice.
- The shared marketplace shell, drawer navigation, theme switcher, and locale switcher use the dictionaries. The `ALIPROMPT` brand remains unchanged in both languages.
- The catalog hero, search/filter controls, ranked shelves, prompt access/meta labels, filtered-result heading, empty state, account actions, footer, and floating utilities now read from the same dictionaries. Vietnamese source content is explicitly identified on the English catalog rather than silently presented as translated.
- Theme now supports **Light**, **Dark**, and **System**. A static pre-paint script resolves the stored/system preference before React paints, while the client control tracks system changes and persists explicit selection.
- Semantic canvas/surface/text/border/brand/focus/overlay/shadow tokens are provided for both themes and applied to shared marketplace, form, card, drawer, loading, and feedback surfaces.

### Verified evidence

- `/vi?q=brief&order=popular` and `/en?q=brief&order=popular` retain query state; language switching between them preserved query state in the local browser.
- Local browser confirmed correct `html[lang]`, canonical, `hreflang` alternate, no horizontal overflow at the available desktop viewport, no actual browser errors/hydration warnings after the proxy restart, and English labels for Sign in, Create account, Library, and Submit prompt.
- Light preference persisted after reload; Dark rendering was visually checked against the shared catalog UI.

### i18n acceptance status and remaining work

The **routing, metadata, dictionary type checking, locale persistence, and shared shell are implemented**. Full route/content internationalization is not yet complete: most existing public forms, error/loading states, admin UI, transactional email copy, and dynamic owned-content fields still contain Vietnamese literals. The English route therefore must not be released as “fully translated” yet. A follow-up schema/content migration is required for owned bilingual fields and explicit `contentLocale`/translation-status handling for community content; community prompts must not be machine-translated or silently presented as English.

Vercel Preview remains blocked until that migration and the required VI/EN × Light/Dark responsive screenshot/E2E matrix are complete.
