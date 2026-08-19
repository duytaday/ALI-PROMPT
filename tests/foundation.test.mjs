import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("uses native Next.js commands and a PostgreSQL database adapter", async () => {
  const [packageJson, database, schema, config] = await Promise.all([
    source("../package.json"),
    source("../db/index.ts"),
    source("../db/schema.ts"),
    source("../drizzle.config.ts"),
  ]);

  const manifest = JSON.parse(packageJson);
  assert.equal(manifest.scripts.dev, "next dev");
  assert.equal(manifest.scripts.build, "next build");
  assert.equal(manifest.scripts.start, "next start");
  assert.equal(manifest.scripts["db:check"], "drizzle-kit check");
  assert.ok(manifest.dependencies.next);
  assert.ok(manifest.dependencies.postgres);
  assert.ok(manifest.dependencies["@vercel/blob"]);
  assert.match(database, /drizzle-orm\/postgres-js/);
  assert.match(database, /POSTGRES_URL/);
  assert.doesNotMatch(database, /cloudflare:workers|drizzle-orm\/d1/);
  assert.match(schema, /pgTable/);
  assert.match(config, /dialect:\s*"postgresql"/);
});

test("keeps local database setup recoverable without nesting a second document", async () => {
  const [database, home, shell, errorBoundary, vietnameseCopy] = await Promise.all([
    source("../db/index.ts"),
    source("../app/page.tsx"),
    source("../app/_components/MarketplaceShell.tsx"),
    source("../app/error.tsx"),
    source("../messages/vi/common.ts"),
  ]);

  assert.match(database, /hasDatabaseUrl/);
  assert.match(home, /hasDatabaseUrl\(\)/);
  assert.match(home, /NODE_ENV === "development"/);
  assert.match(home, /copy\.localPreviewTitle/);
  assert.match(vietnameseCopy, /Chế độ xem trước local/);
  assert.match(shell, /hasDatabaseUrl\(\)/);
  assert.doesNotMatch(errorBoundary, /<html|<body/);
});

test("keeps marketplace access and commerce invariants in the schema", async () => {
  const schema = await source("../db/schema.ts");

  assert.match(schema, /products_only_aliprompt_seller/);
  assert.match(schema, /sellerKind} = 'aliprompt'/);
  assert.match(schema, /payment_events_provider_event_unique/);
  assert.match(schema, /entitlements_user_product_unique/);
  assert.match(schema, /prompt_media_status_allowed/);
  assert.match(schema, /favorites_user_prompt_unique/);
  assert.match(schema, /auditEvents/);
});

test("keeps lead validation and protected CSV export server-side", async () => {
  const [route, adminAuth, csvRoute] = await Promise.all([
    source("../app/api/leads/route.ts"),
    source("../lib/admin-auth.ts"),
    source("../app/api/admin/leads.csv/route.ts"),
  ]);

  assert.match(route, /ALLOWED_STAGES/);
  assert.match(route, /payload\.consent !== true/);
  assert.match(route, /hasHoneypotValue\(payload\.website\)/);
  assert.match(route, /onConflictDoUpdate/);
  assert.match(adminAuth, /getCurrentUser/);
  assert.match(adminAuth, /user\.role === "admin"/);
  assert.match(csvRoute, /await getAdminUser\(\)/);
  assert.match(csvRoute, /status: 403/);
  assert.match(csvRoute, /\^\[=\+\\-@\]/);
  assert.match(csvRoute, /Cache-Control.*private, no-store/);
});

test("keeps secure session, same-origin, and Blob staging boundaries", async () => {
  const [auth, requestSecurity, blob, register] = await Promise.all([
    source("../lib/auth.ts"),
    source("../lib/request-security.ts"),
    source("../lib/blob.ts"),
    source("../app/api/auth/register/route.ts"),
  ]);

  assert.match(auth, /bcryptjs/);
  assert.match(auth, /tokenHash/);
  assert.match(auth, /HttpOnly; SameSite=Lax/);
  assert.match(requestSecurity, /origin/);
  assert.match(requestSecurity, /x-forwarded-host/);
  assert.match(blob, /access: "private"/);
  assert.match(blob, /MAX_MEDIA_BYTES/);
  assert.match(register, /isSameOrigin/);
  assert.match(register, /hashPassword/);
  assert.match(register, /consumeAuthRateLimit/);
});

test("rate limits authentication attempts in PostgreSQL rather than browser state", async () => {
  const [schema, limiter, login, forgot, reset] = await Promise.all([
    source("../db/schema.ts"),
    source("../lib/auth-rate-limit.ts"),
    source("../app/api/auth/login/route.ts"),
    source("../app/api/auth/forgot-password/route.ts"),
    source("../app/api/auth/reset-password/route.ts"),
  ]);
  assert.match(schema, /authRateLimits/);
  assert.match(schema, /auth_rate_limits_action_key_window_unique/);
  assert.match(limiter, /onConflictDoUpdate/);
  assert.match(limiter, /keyHash/);
  assert.match(login, /maximum: 10/);
  assert.match(forgot, /action: "password_reset"/);
  assert.match(forgot, /neutralMessage/);
  assert.match(forgot, /isPasswordResetDeliveryConfigured/);
  assert.match(reset, /hashPasswordResetToken/);
  assert.match(reset, /tx\.delete\(sessions\)/);
});

test("keeps password recovery token delivery and consumption fail-closed", async () => {
  const [schema, email, reset, forgotPage] = await Promise.all([
    source("../db/schema.ts"), source("../lib/email.ts"), source("../lib/password-reset.ts"), source("../app/forgot-password/page.tsx"),
  ]);
  assert.match(schema, /passwordResetTokens/);
  assert.match(schema, /password_reset_tokens_hash_unique/);
  assert.match(email, /ALIPROMPT_EMAIL_PROVIDER === "resend"/);
  assert.match(email, /process\.env\.ALIPROMPT_ENVIRONMENT === "production"/);
  assert.match(reset, /PASSWORD_RESET_TTL_MS/);
  assert.match(forgotPage, /isPasswordResetDeliveryConfigured/);
});

test("keeps account return paths local to ALIPROMPT", async () => {
  const safeReturnTo = await source("../lib/safe-return-to.ts");
  assert.match(safeReturnTo, /value\.startsWith\("\/"\)/);
  assert.match(safeReturnTo, /value\.startsWith\("\/\/"\)/);
  assert.match(safeReturnTo, /https:\/\/aliprompt\.local/);
});

test("only permits original catalog seed content outside Production", async () => {
  const [seed, packageJson] = await Promise.all([source("../db/seed.ts"), source("../package.json")]);
  assert.match(seed, /environment !== "development" && environment !== "preview"/);
  assert.match(seed, /sourceKind: "aliprompt"/);
  assert.match(seed, /moderationStatus: "approved"/);
  assert.equal(JSON.parse(packageJson).scripts["db:seed"], "tsx db/seed.ts");
});

test("keeps catalog pagination bounded and reflected in server-side queries", async () => {
  const [catalog, pagination, contributor] = await Promise.all([source("../lib/catalog.ts"), source("../app/_components/Pagination.tsx"), source("../app/contributors/[id]/page.tsx")]);
  assert.match(catalog, /Math\.min\(filters\.page, 10_000\)/);
  assert.match(catalog, /countPublicPrompts/);
  assert.match(catalog, /\.offset\(offset\)/);
  assert.match(pagination, /URLSearchParams/);
  assert.match(pagination, /aria-current/);
  assert.match(catalog, /getPublicContributor/);
  assert.match(contributor, /if \(!contributor\) notFound\(\)/);
});

test("keeps community submission free, pending, guest-safe, and media-staged", async () => {
  const [route, page, form, captcha, schema, blob, mediaRoute, detail] = await Promise.all([
    source("../app/api/submissions/route.ts"),
    source("../app/submit/page.tsx"),
    source("../app/_components/SubmitPromptForm.tsx"),
    source("../lib/submission-captcha.ts"),
    source("../db/schema.ts"),
    source("../lib/blob.ts"),
    source("../app/api/media/[mediaId]/route.ts"),
    source("../app/prompts/[slug]/page.tsx"),
  ]);
  assert.match(route, /getCurrentUser/);
  assert.doesNotMatch(route, /Sign in is required/);
  assert.match(route, /verifySubmissionCaptcha/);
  assert.match(route, /maximum: 3/);
  assert.match(route, /guestAuthorName/);
  assert.match(route, /sourceKind: "community"/);
  assert.match(route, /moderationStatus: "pending"/);
  assert.match(route, /accessKind: "free"/);
  assert.match(route, /stagePromptMedia/);
  assert.match(route, /verifyPromptMedia/);
  assert.match(route, /discardStagedPromptMedia/);
  assert.match(blob, /await del\(key\)/);
  assert.match(blob, /get\(key, \{ access: "private" \}\)/);
  assert.match(mediaRoute, /prompts\.moderationStatus, "approved"/);
  assert.match(mediaRoute, /X-Content-Type-Options/);
  assert.match(detail, /getPublicPromptMedia/);
  assert.doesNotMatch(page, /redirect\("\/login\?return_to=%2Fsubmit"\)/);
  assert.match(page, /createSubmissionCaptcha/);
  assert.match(form, /authorName/);
  assert.match(form, /captchaAnswer/);
  assert.match(captcha, /timingSafeEqual/);
  assert.match(schema, /guest_author_name/);
});

test("keeps reactions and reporting authenticated, same-origin, and moderation-safe", async () => {
  const [reaction, report, controls, cardReactions, card, leaderboard, detail, catalog] = await Promise.all([
    source("../app/api/prompts/[promptId]/reaction/route.ts"),
    source("../app/api/prompts/[promptId]/report/route.ts"),
    source("../app/_components/PromptCommunityControls.tsx"),
    source("../app/_components/PromptReactionButtons.tsx"),
    source("../app/_components/PromptCard.tsx"),
    source("../lib/leaderboard.ts"),
    source("../app/prompts/[slug]/page.tsx"),
    source("../lib/catalog.ts"),
  ]);
  assert.match(reaction, /isSameOrigin/);
  assert.match(reaction, /getCurrentUser/);
  assert.match(reaction, /moderationStatus, "approved"/);
  assert.match(reaction, /onConflictDoUpdate/);
  assert.match(reaction, /export async function GET/);
  assert.match(reaction, /tx\.delete\(promptReactions\)/);
  assert.match(report, /consumeAuthRateLimit/);
  assert.match(report, /maximum: 5/);
  assert.match(report, /reporterId: user\.id/);
  assert.match(controls, /aria-pressed/);
  assert.match(cardReactions, /aria-pressed/);
  assert.match(cardReactions, /reaction === value \? null : value/);
  assert.match(cardReactions, /getCurrentUser|\/api\/prompts/);
  assert.match(card, /PromptReactionButtons/);
  assert.match(card, /dislikeCount/);
  assert.match(leaderboard, /users\.displayName/);
  assert.doesNotMatch(leaderboard, /users\.email/);
  assert.match(detail, /FavoriteButton/);
  assert.match(catalog, /getViewerFavorite/);
});

test("keeps checkout price server-resolved and payment entitlements webhook-verified", async () => {
  const [schema, checkout, payment, webhook, commerce] = await Promise.all([
    source("../db/schema.ts"),
    source("../app/api/checkout/[productSlug]/route.ts"),
    source("../lib/payment.ts"),
    source("../app/api/payments/webhook/route.ts"),
    source("../lib/commerce.ts"),
  ]);
  assert.match(schema, /contentPromptId/);
  assert.match(schema, /products_content_prompt_unique/);
  assert.match(checkout, /getActiveProductBySlug/);
  assert.match(checkout, /amount: product\.priceAmount/);
  assert.match(checkout, /paymentProviderIsConfigured/);
  assert.match(payment, /createHmac\("sha256"/);
  assert.match(payment, /timingSafeEqual/);
  assert.match(payment, /ALIPROMPT_ENVIRONMENT === "development"/);
  assert.match(payment, /grantSource: "payment"/);
  assert.match(payment, /onConflictDoNothing\(\)/);
  assert.match(webhook, /verifyHmacTestEvent/);
  assert.match(commerce, /isNull\(entitlements\.revokedAt\)/);
});

test("makes moderation a privileged, auditable state transition", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/submissions/[id]/route.ts"),
    source("../app/admin/submissions/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /moderationStatus, "pending"/);
  assert.match(route, /tx\.insert\(auditEvents\)/);
  assert.match(route, /moderation\.\$\{nextStatus\}/);
  assert.match(page, /Prompt chờ kiểm duyệt/);
});

test("makes report resolution privileged, stateful, and auditable", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/reports/[id]/route.ts"),
    source("../app/admin/reports/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /eq\(reports\.status, "open"\)/);
  assert.match(route, /report\.\$\{status\}/);
  assert.match(route, /tx\.insert\(auditEvents\)/);
  assert.match(page, /requireAdminUser/);
  assert.match(page, /reports\.status, "open"/);
});

test("keeps paid product creation restricted to ALIPROMPT-owned content", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/products/route.ts"),
    source("../app/admin/products/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /eq\(prompts\.sourceKind, "aliprompt"\)/);
  assert.match(route, /accessKind: "paid"/);
  assert.match(route, /sellerKind: "aliprompt"/);
  assert.match(route, /product\.created/);
  assert.match(page, /requireAdminUser/);
  assert.match(page, /Prompt ALIPROMPT/);
});

test("keeps ALIPROMPT prompt authoring separate from community submissions", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/prompts/route.ts"), source("../app/admin/prompts/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /sourceKind: "aliprompt"/);
  assert.match(route, /moderationStatus: "approved"/);
  assert.match(route, /accessKind: "free"/);
  assert.match(route, /prompt\.aliprompt_created/);
  assert.match(page, /requireAdminUser/);
  assert.match(page, /contributor submission không đi qua đường này/);
});

test("keeps catalog category creation admin-only and auditable", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/categories/route.ts"), source("../app/admin/categories/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /category\.created/);
  assert.match(route, /isActive: parsed\.data\.isActive/);
  assert.match(page, /requireAdminUser/);
  assert.match(page, /không sao chép taxonomy/);
});

test("keeps article publication admin-only and makes publication state explicit", async () => {
  const [route, page, blog] = await Promise.all([
    source("../app/api/admin/articles/route.ts"), source("../app/admin/articles/page.tsx"), source("../lib/blog.ts"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /article\.\$\{parsed\.data\.status === "published"/);
  assert.match(route, /publishedAt/);
  assert.match(route, /tx/);
  assert.match(page, /requireAdminUser/);
  assert.match(blog, /eq\(articles\.status, "published"\)/);
});

test("allows only audited admin grant and revoke transitions for entitlements", async () => {
  const [route, page] = await Promise.all([
    source("../app/api/admin/entitlements/route.ts"), source("../app/admin/entitlements/page.tsx"),
  ]);
  assert.match(route, /getAdminUser/);
  assert.match(route, /grantSource: "admin"/);
  assert.match(route, /entitlement\.admin_granted/);
  assert.match(route, /entitlement\.admin_revoked/);
  assert.match(route, /isNull\(entitlements\.revokedAt\)/);
  assert.match(page, /requireAdminUser/);
  assert.match(page, /Lý do revoke/);
});

test("keeps order administration observable but not manually payable", async () => {
  const page = await source("../app/admin/orders/page.tsx");
  assert.match(page, /requireAdminUser/);
  assert.match(page, /innerJoin\(products/);
  assert.match(page, /innerJoin\(users/);
  assert.match(page, /Trang này chỉ đọc/);
  assert.doesNotMatch(page, /method="post"/);
});

test("provides explicit global loading, retry, and unavailable-content states", async () => {
  const [error, loading, missing] = await Promise.all([
    source("../app/error.tsx"), source("../app/loading.tsx"), source("../app/not-found.tsx"),
  ]);
  assert.match(error, /reset/);
  assert.match(error, /Thử tải lại/);
  assert.match(loading, /aria-busy="true"/);
  assert.match(missing, /Không tìm thấy nội dung này/);
});

test("keeps theme preference and floating utilities reachable without removing shell actions", async () => {
  const [theme, utilities, shell] = await Promise.all([
    source("../app/_components/ThemeToggle.tsx"), source("../app/_components/FloatingUtilities.tsx"), source("../app/_components/MarketplaceShell.tsx"),
  ]);
  assert.match(theme, /localStorage/);
  assert.match(theme, /aria-label/);
  assert.match(utilities, /window\.scrollTo/);
  assert.match(utilities, /href="\/library"/);
  assert.match(utilities, /href="\/submit"/);
  assert.match(shell, /ThemeToggle/);
  assert.match(shell, /FloatingUtilities/);
});

test("keeps the marketplace shell responsive, keyboard-operable, and motion-safe", async () => {
  const [navigation, shell, styles, copy, favorite] = await Promise.all([
    source("../app/_components/MarketplaceNavigation.tsx"),
    source("../app/_components/MarketplaceShell.tsx"),
    source("../app/globals.css"),
    source("../app/_components/PromptCopyButton.tsx"),
    source("../app/_components/FavoriteButton.tsx"),
  ]);

  assert.match(shell, /MarketplaceNavigation/);
  assert.match(navigation, /aria-expanded/);
  assert.match(navigation, /Escape/);
  assert.match(navigation, /document\.body\.style\.overflow/);
  assert.match(navigation, /role="dialog"/);
  assert.match(navigation, /aria-modal="true"/);
  assert.match(shell, /skip-link/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /mobile-menu-toggle/);
  assert.match(styles, /height: 100dvh/);
  assert.match(styles, /--color-brand: #6d4aff/);
  assert.match(styles, /max-width: 1520px/);
  assert.match(styles, /max-width: 1024px/);
  assert.match(styles, /max-width: 600px/);
  assert.match(styles, /safe-area-inset/);
  assert.match(styles, /grid-template-columns: 20px/);
  assert.match(styles, /--font-ui/);
  assert.match(styles, /body \[class\]/);
  assert.match(styles, /--font-code/);
  assert.match(copy, /Đã sao chép prompt vào clipboard/);
  assert.match(favorite, /focusable/);
});

test("keeps locale routing, typed dictionaries, and three-way theme preference explicit", async () => {
  const [i18n, vi, en, proxy, layout, localeSwitcher, theme] = await Promise.all([
    source("../lib/i18n.ts"),
    source("../messages/vi/common.ts"),
    source("../messages/en/common.ts"),
    source("../proxy.ts"),
    source("../app/layout.tsx"),
    source("../app/_components/LocaleSwitcher.tsx"),
    source("../app/_components/ThemeToggle.tsx"),
  ]);

  assert.match(i18n, /locales = \["vi", "en"\]/);
  assert.match(i18n, /MessageShape/);
  assert.match(vi, /navigation/);
  assert.match(en, /MessageShape/);
  assert.match(proxy, /x-aliprompt-locale/);
  assert.match(proxy, /Accept-Language|accept-language/);
  assert.match(layout, /suppressHydrationWarning/);
  assert.match(layout, /width: "device-width"/);
  assert.match(layout, /viewportFit: "cover"/);
  assert.match(layout, /hreflang|languages/);
  assert.match(localeSwitcher, /window\.location\.hash/);
  assert.match(localeSwitcher, /searchParams/);
  assert.match(localeSwitcher, /<svg/);
  assert.match(theme, /"light" \| "dark" \| "system"/);
  assert.match(theme, /prefers-color-scheme/);
  assert.match(theme, /ThemeIcon/);
});

test("uses typed catalog copy across the localized home states", async () => {
  const [home, shelf, card] = await Promise.all([
    source("../app/page.tsx"),
    source("../app/_components/PromptShelf.tsx"),
    source("../app/_components/PromptCard.tsx"),
  ]);

  assert.match(home, /copy\.resultsKicker/);
  assert.match(home, /copy\.emptyTitle/);
  assert.match(home, /applyPreviewCatalogFilters/);
  assert.match(home, /filters\.order !== "newest"/);
  assert.match(home, /locale=\{locale\}/);
  assert.match(home, /layout="masonry"/);
  assert.match(shelf, /copy\.shelfEmptyTitle/);
  assert.match(shelf, /prompt-masonry/);
  assert.match(card, /copy\.paid/);
  assert.match(card, /copy\.free/);
  assert.match(card, /prompt-card-media/);
});

test("makes ranked discovery shelves bounded, keyboard-operable rails", async () => {
  const [shelf, rail] = await Promise.all([
    source("../app/_components/PromptShelf.tsx"), source("../app/_components/PromptRail.tsx"),
  ]);
  assert.match(shelf, /PromptRail/);
  assert.match(rail, /scrollBy/);
  assert.match(rail, /type="button"/);
  assert.match(rail, /disabled=\{position\.start\}/);
  assert.match(rail, /disabled=\{position\.end\}/);
});

test("keeps the newest visual prompt layout media-safe and responsive", async () => {
  const [catalog, styles] = await Promise.all([
    source("../lib/catalog.ts"), source("../app/globals.css"),
  ]);
  assert.match(catalog, /mediaId: sql/);
  assert.match(catalog, /promptMedia\.status/);
  assert.match(styles, /\.prompt-masonry/);
  assert.match(styles, /break-inside: avoid/);
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 600px\) \{ \.prompt-masonry/);
});

test("keeps topic discovery before catalog search as an accessible, bounded carousel", async () => {
  const [carousel, search, styles, vi, en] = await Promise.all([
    source("../app/_components/TopicCarousel.tsx"),
    source("../app/_components/CatalogSearch.tsx"),
    source("../app/globals.css"),
    source("../messages/vi/common.ts"),
    source("../messages/en/common.ts"),
  ]);

  assert.match(search, /TopicCarousel/);
  assert.match(carousel, /scrollBy/);
  assert.match(carousel, /aria-current/);
  assert.match(carousel, /<svg/);
  assert.match(carousel, /previousTopics/);
  assert.match(carousel, /nextTopics/);
  assert.match(styles, /topic-carousel-track/);
  assert.match(styles, /overscroll-behavior-inline/);
  assert.match(vi, /topicCarouselTitle/);
  assert.match(en, /topicCarouselTitle/);
});

test("gives the signed-out favorite dialog an accessible keyboard exit and focus return", async () => {
  const favorite = await source("../app/_components/FavoriteButton.tsx");
  assert.match(favorite, /aria-haspopup=\{signedIn \? undefined : "dialog"\}/);
  assert.match(favorite, /aria-expanded=\{signedIn \? undefined : showGate\}/);
  assert.match(favorite, /event\.key === "Escape"/);
  assert.match(favorite, /triggerRef\.current\?\.focus/);
});

test("keeps favorites private, idempotent, recoverable, and reusable", async () => {
  const [schema, api, favorite, page, navigation, search, styles] = await Promise.all([
    source("../db/schema.ts"),
    source("../app/api/favorites/[promptId]/route.ts"),
    source("../app/_components/FavoriteButton.tsx"),
    source("../app/library/favorites/page.tsx"),
    source("../app/_components/MarketplaceNavigation.tsx"),
    source("../app/_components/CatalogSearch.tsx"),
    source("../app/globals.css"),
  ]);
  assert.match(schema, /favorites_user_created_at_index/);
  assert.match(schema, /model_compatibility/);
  assert.match(api, /export async function PUT/);
  assert.match(api, /typeof body\.favorited !== "boolean"/);
  assert.match(api, /eq\(favorites\.userId, context\.user\.id\)/);
  assert.match(favorite, /method: "PUT"/);
  assert.match(favorite, /requestId !== requestRef\.current/);
  assert.match(favorite, /setSaved\(!desired\)/);
  assert.match(page, /moderationStatus, "approved"/);
  assert.match(page, /unavailableFavorite/);
  assert.match(page, /favoritesSearch/);
  assert.match(navigation, /library\/favorites/);
  assert.match(search, /active-filters/);
  assert.match(styles, /favorites-filter-form/);
});

test("keeps prompt variable customization local and behind the existing entitlement gate", async () => {
  const [detail, usePanel, styles] = await Promise.all([
    source("../app/prompts/[slug]/page.tsx"),
    source("../app/_components/PromptUsePanel.tsx"),
    source("../app/globals.css"),
  ]);
  assert.match(detail, /const useData = canUsePrompt \? await getPromptUseData\(prompt\.id\) : null/);
  assert.match(detail, /canUsePrompt && useData \? <PromptUsePanel prompt=\{useData\.body\}/);
  assert.match(detail, /hasActiveEntitlement/);
  assert.match(usePanel, /variablePattern/);
  assert.match(usePanel, /navigator\.clipboard\.writeText/);
  assert.match(usePanel, /Math\.ceil\(generated\.length \/ 4\)/);
  assert.match(styles, /prompt-use-panel/);
});
