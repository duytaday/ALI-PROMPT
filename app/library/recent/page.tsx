import Link from "next/link";
import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import LibraryWorkspaceNav from "../../_components/LibraryWorkspaceNav";
import RecentHistoryControls from "../../_components/RecentHistoryControls";
import { getDb } from "../../../db";
import { entitlements, products, promptUsageEvents, prompts } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/auth";
import { isLocale } from "../../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function RecentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?return_to=%2Flibrary%2Frecent");
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const isEnglish = locale === "en";
  const raw = await searchParams;
  const page = typeof raw.page === "string" && /^\d+$/.test(raw.page) ? Math.min(Math.max(Number(raw.page), 1), 10_000) : 1;
  const rawRows = await getDb().select({ id: promptUsageEvents.id, promptId: promptUsageEvents.promptId, promptVersion: promptUsageEvents.promptVersion, copyFormat: promptUsageEvents.copyFormat, createdAt: promptUsageEvents.createdAt, slug: prompts.slug, title: prompts.title, accessKind: prompts.accessKind, entitlementId: entitlements.id })
    .from(promptUsageEvents).leftJoin(prompts, and(eq(promptUsageEvents.promptId, prompts.id), eq(prompts.moderationStatus, "approved")))
    .leftJoin(products, and(eq(products.contentPromptId, prompts.id), eq(products.status, "active")))
    .leftJoin(entitlements, and(eq(entitlements.productId, products.id), eq(entitlements.userId, user.id), isNull(entitlements.revokedAt)))
    .where(eq(promptUsageEvents.userId, user.id)).orderBy(desc(promptUsageEvents.createdAt), desc(promptUsageEvents.id)).limit(20).offset((page - 1) * 20);
  const rows = rawRows.map((row) => {
    const canReopen = Boolean(row.slug && row.title && (row.accessKind === "free" || row.entitlementId));
    return { ...row, slug: canReopen ? row.slug : null, title: canReopen ? row.title : null };
  });
  return <MarketplaceShell><main className="library-page recent-page"><p className="route-kicker">{isEnglish ? "PRIVATE LIBRARY" : "THƯ VIỆN RIÊNG"}</p><h1>{isEnglish ? "Recently used" : "Dùng gần đây"}</h1><p>{isEnglish ? "Only successful clipboard copies appear here. No prompt content or variable values are stored." : "Chỉ các lần sao chép clipboard thành công xuất hiện ở đây. Không lưu nội dung prompt hoặc giá trị biến."}</p><LibraryWorkspaceNav locale={locale} active="recent" />{rows.length ? <><div className="recent-history-heading"><span>{isEnglish ? "Newest first" : "Mới nhất trước"}</span><RecentHistoryControls locale={locale} /></div><ul className="recent-history-list">{rows.map((row) => <li key={row.id}>{row.slug && row.title ? <Link href={`/prompts/${row.slug}`}>{row.title}</Link> : <span>{isEnglish ? "Unavailable prompt" : "Prompt không còn khả dụng"}</span>}<small>{new Date(row.createdAt).toLocaleString(locale)} · {row.copyFormat} · v{row.promptVersion}</small><RecentHistoryControls locale={locale} eventId={row.id} /></li>)}</ul>{rows.length === 20 ? <Link href={`/library/recent?page=${page + 1}`}>{isEnglish ? "Load older history" : "Xem lịch sử cũ hơn"}</Link> : null}</> : <div className="catalog-empty"><p>{isEnglish ? "No successful copies yet." : "Chưa có lần sao chép thành công."}</p><Link href="/">{isEnglish ? "Explore prompts" : "Khám phá prompt"}</Link></div>}</main></MarketplaceShell>;
}
