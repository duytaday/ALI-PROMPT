import Link from "next/link";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketplaceShell from "../_components/MarketplaceShell";
import PromptCard from "../_components/PromptCard";
import { getDb } from "../../db";
import { categories, entitlements, favorites, products, prompts, users } from "../../db/schema";
import { getCurrentUser } from "../../lib/auth";
import { isLocale } from "../../lib/i18n";
import { promptCollections, promptUsageEvents } from "../../db/schema";
import LibraryWorkspaceNav from "../_components/LibraryWorkspaceNav";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?return_to=%2Flibrary");
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const isEnglish = locale === "en";
  const db = getDb();
  const [savedPrompts, ownedProducts, collectionTotal, recentTotal] = await Promise.all([
    db.select({ id: prompts.id, slug: prompts.slug, title: prompts.title, summary: prompts.summary, accessKind: prompts.accessKind, modelCompatibility: prompts.modelCompatibility, contentLanguage: prompts.contentLanguage, viewCount: prompts.viewCount, likeCount: prompts.likeCount, dislikeCount: prompts.dislikeCount, categoryName: categories.name, categorySlug: categories.slug, contributorId: prompts.contributorId, contributorName: users.displayName, guestAuthorName: prompts.guestAuthorName })
      .from(favorites).innerJoin(prompts, eq(favorites.promptId, prompts.id)).leftJoin(categories, eq(prompts.categoryId, categories.id)).leftJoin(users, eq(prompts.contributorId, users.id))
      .where(and(eq(favorites.userId, user.id), eq(prompts.moderationStatus, "approved"))).orderBy(desc(favorites.createdAt)),
    db.select({ id: products.id, slug: products.slug, title: products.title, description: products.description, grantedAt: entitlements.createdAt })
      .from(entitlements).innerJoin(products, eq(entitlements.productId, products.id)).where(and(eq(entitlements.userId, user.id), eq(products.status, "active"), isNull(entitlements.revokedAt))).orderBy(desc(entitlements.createdAt)),
    db.select({ value: count() }).from(promptCollections).where(eq(promptCollections.userId, user.id)),
    db.select({ value: count() }).from(promptUsageEvents).where(eq(promptUsageEvents.userId, user.id)),
  ]);
  return <MarketplaceShell><main className="library-page"><p className="route-kicker">{isEnglish ? "PRIVATE LIBRARY" : "THƯ VIỆN RIÊNG"}</p><h1>{isEnglish ? "Your private prompt workspace." : "Không gian prompt riêng của bạn."}</h1><LibraryWorkspaceNav locale={locale} active="overview" /><section className="library-overview-grid"><Link href="/library/favorites"><strong>{savedPrompts.length}</strong><span>{isEnglish ? "Saved prompts" : "Prompt đã lưu"}</span></Link><Link href="/library/collections"><strong>{Number(collectionTotal[0]?.value ?? 0)}</strong><span>{isEnglish ? "Collections" : "Bộ sưu tập"}</span></Link><Link href="/library/recent"><strong>{Number(recentTotal[0]?.value ?? 0)}</strong><span>{isEnglish ? "Recent copies" : "Lần dùng gần đây"}</span></Link></section><section><h2>{isEnglish ? "Saved prompts" : "Prompt đã lưu"}</h2>{savedPrompts.length ? <div className="prompt-grid">{savedPrompts.slice(0, 6).map((prompt) => <PromptCard key={prompt.id} prompt={prompt} signedIn initialSaved locale={locale} />)}</div> : <div className="catalog-empty"><p>{isEnglish ? "You have not saved any prompts yet." : "Bạn chưa lưu prompt nào."}</p><Link href="/">{isEnglish ? "Explore prompts" : "Khám phá thư viện"}</Link></div>}</section><section><h2>{isEnglish ? "ALIPROMPT resources" : "Tài nguyên ALIPROMPT"}</h2>{ownedProducts.length ? <ul className="owned-products">{ownedProducts.map((product) => <li key={product.id}><strong>{product.title}</strong><p>{product.description}</p><Link href={`/checkout/${product.slug}`}>{isEnglish ? "View access" : "Xem quyền truy cập"}</Link></li>)}</ul> : <div className="catalog-empty"><p>{isEnglish ? "No paid resources in your library yet." : "Bạn chưa có tài nguyên trả phí trong thư viện."}</p></div>}</section></main></MarketplaceShell>;
}
