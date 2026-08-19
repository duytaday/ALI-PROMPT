import Link from "next/link";
import { and, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import LibraryCollectionsClient from "../../_components/LibraryCollectionsClient";
import LibraryWorkspaceNav from "../../_components/LibraryWorkspaceNav";
import { getDb } from "../../../db";
import { promptCollectionItems, promptCollections, prompts } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/auth";
import { isLocale } from "../../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?return_to=%2Flibrary%2Fcollections");
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const isEnglish = locale === "en";
  const db = getDb();
  const collections = await db.select({ id: promptCollections.id, name: promptCollections.name, description: promptCollections.description, itemCount: count(promptCollectionItems.id) })
    .from(promptCollections).leftJoin(promptCollectionItems, eq(promptCollectionItems.collectionId, promptCollections.id))
    .where(eq(promptCollections.userId, user.id)).groupBy(promptCollections.id).orderBy(desc(promptCollections.updatedAt)).limit(50);
  const raw = await searchParams;
  const requestedId = typeof raw.collection === "string" ? raw.collection : "";
  const selected = collections.find((collection) => collection.id === requestedId) ?? collections[0] ?? null;
  const itemRows = selected ? await db.select({ promptId: promptCollectionItems.promptId, slug: prompts.slug, title: prompts.title, summary: prompts.summary })
    .from(promptCollectionItems).leftJoin(prompts, and(eq(promptCollectionItems.promptId, prompts.id), eq(prompts.moderationStatus, "approved")))
    .where(eq(promptCollectionItems.collectionId, selected.id)).orderBy(desc(promptCollectionItems.createdAt)).limit(500) : [];
  const safeCollections = collections.map((collection) => ({ ...collection, itemCount: Number(collection.itemCount) }));
  const items = itemRows.map((item) => ({ ...item, unavailable: !item.slug || !item.title }));
  return <MarketplaceShell><main className="library-page"><p className="route-kicker">{isEnglish ? "PRIVATE LIBRARY" : "THƯ VIỆN RIÊNG"}</p><h1>{isEnglish ? "Collections" : "Bộ sưu tập"}</h1><p>{isEnglish ? "Keep prompts in private groups without changing saved prompts or access rights." : "Sắp xếp prompt thành nhóm riêng mà không thay đổi prompt đã lưu hoặc quyền truy cập."}</p><LibraryWorkspaceNav locale={locale} active="collections" /><LibraryCollectionsClient key={selected?.id ?? "empty"} locale={locale} collections={safeCollections} selected={selected ? { ...selected, itemCount: Number(selected.itemCount) } : null} items={items} /><Link className="back-link" href="/library">{isEnglish ? "← Library overview" : "← Tổng quan thư viện"}</Link></main></MarketplaceShell>;
}
