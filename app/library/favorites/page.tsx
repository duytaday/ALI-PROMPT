import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import PromptCard from "../../_components/PromptCard";
import FavoriteButton from "../../_components/FavoriteButton";
import { getDb } from "../../../db";
import { categories, favorites, prompts, users } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/auth";
import { getMessages, isLocale } from "../../../lib/i18n";

export const dynamic = "force-dynamic";

function hrefForFilters(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/library/favorites?${query}` : "/library/favorites";
}

export default async function FavoritesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?return_to=%2Flibrary%2Ffavorites");
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const copy = getMessages(locale).catalog;
  const raw = await searchParams;
  const query = typeof raw.q === "string" ? raw.q.trim().slice(0, 120) : "";
  const topic = typeof raw.topic === "string" ? raw.topic.trim().slice(0, 96) : "";
  const access = raw.access === "paid" || raw.access === "free" ? raw.access : "";
  const db = getDb();
  const [rows, activeCategories] = await Promise.all([
    db.select({ favoritePromptId: favorites.promptId, savedAt: favorites.createdAt, id: prompts.id, slug: prompts.slug, title: prompts.title, summary: prompts.summary, accessKind: prompts.accessKind, modelCompatibility: prompts.modelCompatibility, contentLanguage: prompts.contentLanguage, viewCount: prompts.viewCount, likeCount: prompts.likeCount, dislikeCount: prompts.dislikeCount, categoryName: categories.name, categorySlug: categories.slug, contributorId: prompts.contributorId, contributorName: users.displayName, guestAuthorName: prompts.guestAuthorName })
      .from(favorites)
      .leftJoin(prompts, and(eq(favorites.promptId, prompts.id), eq(prompts.moderationStatus, "approved")))
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .leftJoin(users, eq(prompts.contributorId, users.id))
      .where(eq(favorites.userId, user.id))
      .orderBy(desc(favorites.createdAt)),
    db.select({ slug: categories.slug, name: categories.name }).from(categories).where(eq(categories.isActive, true)),
  ]);
  const publicRows = rows.filter((row) => row.id && row.slug && row.title && row.summary && row.accessKind) as Array<typeof rows[number] & { id: string; slug: string; title: string; summary: string; accessKind: string }>;
  const unavailableRows = rows.filter((row) => !row.id);
  const normalizedQuery = query.toLocaleLowerCase(locale);
  const filtered = publicRows.filter((prompt) => {
    if (topic && prompt.categorySlug !== topic) return false;
    if (access && prompt.accessKind !== access) return false;
    if (!normalizedQuery) return true;
    return [prompt.title, prompt.summary, prompt.categoryName].some((value) => value?.toLocaleLowerCase(locale).includes(normalizedQuery));
  });
  const toPromptCard = (prompt: typeof publicRows[number]) => ({
    id: prompt.id,
    slug: prompt.slug,
    title: prompt.title,
    summary: prompt.summary,
    accessKind: prompt.accessKind,
    modelCompatibility: prompt.modelCompatibility,
    contentLanguage: prompt.contentLanguage,
    viewCount: prompt.viewCount ?? 0,
    likeCount: prompt.likeCount ?? 0,
    dislikeCount: prompt.dislikeCount ?? 0,
    categoryName: prompt.categoryName,
    categorySlug: prompt.categorySlug,
    contributorId: prompt.contributorId,
    contributorName: prompt.contributorName,
    guestAuthorName: prompt.guestAuthorName,
  });
  const hasFilters = Boolean(query || topic || access);
  return <MarketplaceShell><main className="library-page favorites-page"><p className="route-kicker">{copy.discover}</p><h1>{copy.favoritesTitle}</h1><p>{copy.favoritesDescription}</p>
    <div className="favorites-heading"><span>{publicRows.length} {copy.itemCount}</span><Link href="/">{locale === "en" ? "Explore prompts" : "Khám phá prompt"}</Link></div>
    <form className="favorites-filter-form" action="/library/favorites" method="get">
      <label><span>{copy.favoritesSearch}</span><input name="q" defaultValue={query} maxLength={120} placeholder={copy.favoritesSearchPlaceholder} /></label>
      <label><span>{copy.topic}</span><select name="topic" defaultValue={topic}><option value="">{copy.allTopics}</option>{activeCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      <label><span>{locale === "en" ? "Access" : "Truy cập"}</span><select name="access" defaultValue={access}><option value="">{copy.all}</option><option value="free">{copy.free}</option><option value="paid">{copy.paid}</option></select></label>
      <button type="submit">{locale === "en" ? "Apply" : "Lọc"}</button>
    </form>
    {hasFilters ? <div className="active-filters" aria-label={locale === "en" ? "Active filters" : "Bộ lọc đang dùng"}>{query ? <Link href={hrefForFilters({ topic, access })}>“{query}” ×</Link> : null}{topic ? <Link href={hrefForFilters({ q: query, access })}>{topic} ×</Link> : null}{access ? <Link href={hrefForFilters({ q: query, topic })}>{access} ×</Link> : null}<Link href="/library/favorites">{copy.clearAll}</Link></div> : null}
    {rows.length === 0 ? <div className="catalog-empty"><p>{copy.favoritesEmpty}</p><Link href="/">{locale === "en" ? "Explore prompts" : "Khám phá prompt"}</Link></div> : filtered.length ? <div className="prompt-grid">{filtered.map((prompt) => <PromptCard key={prompt.id} prompt={toPromptCard(prompt)} signedIn initialSaved locale={locale} />)}</div> : <div className="catalog-empty"><h2>{locale === "en" ? "No saved prompts match these filters" : "Không có prompt đã lưu phù hợp"}</h2><p>{locale === "en" ? "Try a shorter keyword or clear a filter." : "Hãy thử từ khóa ngắn hơn hoặc bỏ bớt bộ lọc."}</p><Link href="/library/favorites">{copy.clearAll}</Link></div>}
    {unavailableRows.length ? <section className="favorites-unavailable" aria-label={locale === "en" ? "Unavailable saved prompts" : "Prompt đã lưu không khả dụng"}><h2>{locale === "en" ? "Unavailable saved prompts" : "Prompt đã lưu không khả dụng"}</h2>{unavailableRows.map((favorite) => <div key={favorite.favoritePromptId}><p>{copy.unavailableFavorite}</p><FavoriteButton promptId={favorite.favoritePromptId} promptSlug="library/favorites" signedIn initialSaved locale={locale} /></div>)}</section> : null}
  </main></MarketplaceShell>;
}
