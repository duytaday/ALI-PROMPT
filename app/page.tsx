import Link from "next/link";
import { headers } from "next/headers";
import CatalogSearch from "./_components/CatalogSearch";
import MarketplaceShell from "./_components/MarketplaceShell";
import PromptCard from "./_components/PromptCard";
import PromptShelf from "./_components/PromptShelf";
import Pagination from "./_components/Pagination";
import { countPublicPrompts, getActiveCategories, listPublicPrompts, normalizeCatalogFilters } from "../lib/catalog";
import { getCurrentUser } from "../lib/auth";
import { hasDatabaseUrl } from "../db";
import { getMessages, isLocale } from "../lib/i18n";

export const dynamic = "force-dynamic";

const localPreviewCategories = [
  { slug: "lam-ro-brief", name: "Làm rõ brief" },
  { slug: "noi-dung-chien-dich", name: "Nội dung & chiến dịch" },
  { slug: "van-hanh-sop", name: "Vận hành & SOP" },
  { slug: "hoc-va-nghien-cuu", name: "Học & nghiên cứu" },
];

const localPreviewPrompts = [
  { id: "preview-brief", slug: "brief-khach-hang-khong-bo-sot", title: "Chuyển yêu cầu khách hàng mơ hồ thành brief có thể thực thi", summary: "Tạo bộ câu hỏi làm rõ, giả định và tiêu chí nghiệm thu trước khi bắt tay làm.", accessKind: "free", viewCount: 1284, likeCount: 96, dislikeCount: 3, categoryName: "Làm rõ brief", categorySlug: "lam-ro-brief", contributorId: null, contributorName: null, guestAuthorName: null },
  { id: "preview-content", slug: "ke-hoach-noi-dung-co-chung-cu", title: "Lập kế hoạch nội dung từ insight đã được cung cấp", summary: "Xây kế hoạch có góc tiếp cận, bằng chứng còn thiếu và CTA phù hợp thay vì ý tưởng chung chung.", accessKind: "free", viewCount: 1046, likeCount: 84, dislikeCount: 2, categoryName: "Nội dung & chiến dịch", categorySlug: "noi-dung-chien-dich", contributorId: null, contributorName: null, guestAuthorName: null },
  { id: "preview-sop", slug: "sop-cong-viec-lap-lai", title: "Đóng gói việc lặp lại thành SOP có điểm kiểm tra", summary: "Biến một công việc lặp lại thành quy trình để con người hoặc AI hỗ trợ có kiểm soát.", accessKind: "free", viewCount: 918, likeCount: 73, dislikeCount: 1, categoryName: "Vận hành & SOP", categorySlug: "van-hanh-sop", contributorId: null, contributorName: null, guestAuthorName: null },
  { id: "preview-research", slug: "doc-tai-lieu-khong-nham-lan", title: "Đọc tài liệu và phân biệt dữ kiện với suy luận", summary: "Tóm tắt tài liệu mà vẫn giữ được nguồn, mức độ chắc chắn và câu hỏi mở.", accessKind: "paid", viewCount: 765, likeCount: 68, dislikeCount: 4, categoryName: "Học & nghiên cứu", categorySlug: "hoc-va-nghien-cuu", contributorId: null, contributorName: null, guestAuthorName: null },
];

function applyPreviewCatalogFilters(filters: ReturnType<typeof normalizeCatalogFilters>) {
  const query = filters.query?.toLocaleLowerCase("vi");
  const matching = localPreviewPrompts.filter((prompt) => {
    if (filters.topic && prompt.categorySlug !== filters.topic) return false;
    if (!query) return true;
    return [prompt.title, prompt.summary, prompt.categoryName]
      .some((value) => value.toLocaleLowerCase("vi").includes(query));
  });

  return matching.toSorted((left, right) => {
    if (filters.order === "popular") return right.viewCount - left.viewCount;
    if (filters.order === "helpful") return right.likeCount - left.likeCount;
    return 0;
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const copy = getMessages(locale).catalog;
  const raw = await searchParams;
  const filters = normalizeCatalogFilters({
    query: typeof raw.q === "string" ? raw.q : undefined,
    topic: typeof raw.topic === "string" ? raw.topic : undefined,
    order: typeof raw.order === "string" ? raw.order as "newest" | "popular" | "helpful" : undefined,
    page: typeof raw.page === "string" ? Number(raw.page) : undefined,
  });
  const hasFilters = Boolean(filters.query || filters.topic || filters.order !== "newest");
  if (process.env.NODE_ENV === "development" && !hasDatabaseUrl()) {
    const previewPrompts = applyPreviewCatalogFilters(filters);
    return (
      <MarketplaceShell>
        <main>
          <section className="catalog-hero">
            <p>{copy.libraryKicker}</p>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroDescription}</p>
            <Link className="hero-link" href="/submit">{copy.heroAction}</Link>
          </section>
          <CatalogSearch categories={localPreviewCategories} query={filters.query} topic={filters.topic} order={filters.order} locale={locale} />
          <section className="catalog-results">
            <aside className="local-preview-notice" aria-label="Trạng thái dữ liệu local">
              <strong>{copy.localPreviewTitle}</strong>
              <span>{copy.localPreviewBody}</span>
            </aside>
            {locale === "en" ? <aside className="content-locale-notice" role="status">{copy.translationNotice}</aside> : null}
            {hasFilters ? <section aria-labelledby="catalog-results-title"><div className="section-heading"><div><p>{copy.resultsKicker}</p><h2 id="catalog-results-title">{copy.resultsTitle}</h2></div><span>{previewPrompts.length} {copy.itemCount}</span></div>{previewPrompts.length ? <div className="prompt-grid">{previewPrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} locale={locale} />)}</div> : <div className="catalog-empty"><h2>{copy.emptyTitle}</h2><p>{copy.emptyBody}</p><Link href="/">{copy.resetFilters}</Link></div>}</section> : <><PromptShelf title={copy.popular} description={copy.popularDescription} prompts={localPreviewPrompts} locale={locale} /><PromptShelf title={copy.helpful} description={copy.helpfulDescription} prompts={[...localPreviewPrompts].reverse()} locale={locale} /><PromptShelf title={copy.newest} description={copy.newestDescription} prompts={localPreviewPrompts} locale={locale} layout="masonry" /></>}
          </section>
        </main>
      </MarketplaceShell>
    );
  }

  const [categories, prompts, total, mostViewed, mostHelpful, user] = await Promise.all([
    getActiveCategories(),
    listPublicPrompts(filters, hasFilters ? 18 : 12),
    hasFilters ? countPublicPrompts(filters) : Promise.resolve(0),
    hasFilters ? Promise.resolve([]) : listPublicPrompts({ order: "popular" }, 12),
    hasFilters ? Promise.resolve([]) : listPublicPrompts({ order: "helpful" }, 12),
    getCurrentUser(),
  ]);

  return <MarketplaceShell>
    <main>
      <section className="catalog-hero">
        <p>{copy.libraryKicker}</p>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroDescription}</p>
        <Link className="hero-link" href="/submit">{copy.heroAction}</Link>
      </section>
      <CatalogSearch categories={categories} query={filters.query} topic={filters.topic} order={filters.order} locale={locale} />
      {locale === "en" ? <aside className="content-locale-notice" role="status">{copy.translationNotice}</aside> : null}
      {hasFilters ? <section className="catalog-results" aria-labelledby="catalog-results-title"><div className="section-heading"><div><p>{copy.resultsKicker}</p><h2 id="catalog-results-title">{copy.resultsTitle}</h2></div><span>{total} {copy.itemCount}</span></div>{prompts.length ? <><div className="prompt-grid">{prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} signedIn={Boolean(user)} locale={locale} />)}</div><Pagination page={filters.page} total={total} pageSize={18} query={filters.query} topic={filters.topic} order={filters.order} /></> : <div className="catalog-empty"><h2>{copy.emptyTitle}</h2><p>{copy.emptyBody}</p><Link href="/">{copy.resetFilters}</Link></div>}</section> : <section className="catalog-results"><PromptShelf title={copy.popular} description={copy.popularDescription} prompts={mostViewed} signedIn={Boolean(user)} locale={locale} /><PromptShelf title={copy.helpful} description={copy.helpfulDescription} prompts={mostHelpful} signedIn={Boolean(user)} locale={locale} /><PromptShelf title={copy.newest} description={copy.newestDescription} prompts={prompts} signedIn={Boolean(user)} locale={locale} layout="masonry" /></section>}
    </main>
  </MarketplaceShell>;
}
