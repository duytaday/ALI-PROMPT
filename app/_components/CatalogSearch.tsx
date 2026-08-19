import Link from "next/link";
import { getMessages, type Locale } from "../../lib/i18n";
import TopicCarousel from "./TopicCarousel";

type Category = { slug: string; name: string };

function catalogHref(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function CatalogSearch({
  categories,
  query,
  topic,
  order,
  locale = "vi",
}: {
  categories: Category[];
  query?: string;
  topic?: string;
  order?: string;
  locale?: Locale;
}) {
  const copy = getMessages(locale).catalog;
  const activeFilters = Boolean(query || topic || (order && order !== "newest"));
  return (
    <section id="catalog-search" className="catalog-search" aria-label={copy.searchLabel}>
      <TopicCarousel categories={categories} query={query} topic={topic} order={order} locale={locale} />
      <form action="/" method="get" className="catalog-search-form">
        <label>
          <span>{copy.searchHint}</span>
          <input name="q" defaultValue={query} maxLength={120} placeholder={copy.searchPlaceholder} />
        </label>
        <label>
          <span>{copy.topic}</span>
          <select name="topic" defaultValue={topic ?? ""}>
            <option value="">{copy.allTopics}</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label>
          <span>{copy.order}</span>
          <select name="order" defaultValue={order ?? "newest"}>
            <option value="newest">{copy.newest}</option>
            <option value="popular">{copy.popular}</option>
            <option value="helpful">{copy.helpful}</option>
          </select>
        </label>
        <button type="submit">{copy.searchAction}</button>
      </form>
      {activeFilters ? <div className="active-filters" aria-label={locale === "en" ? "Active filters" : "Bộ lọc đang dùng"}>
        {query ? <Link href={catalogHref({ topic, order })}>“{query}” ×</Link> : null}
        {topic ? <Link href={catalogHref({ q: query, order })}>{categories.find((category) => category.slug === topic)?.name ?? topic} ×</Link> : null}
        {order && order !== "newest" ? <Link href={catalogHref({ q: query, topic })}>{order === "popular" ? copy.popular : copy.helpful} ×</Link> : null}
        <Link href="/">{copy.clearAll}</Link>
      </div> : null}
    </section>
  );
}
