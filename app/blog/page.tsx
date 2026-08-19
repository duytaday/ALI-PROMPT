import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import { listPublishedArticles } from "../../lib/blog";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" });

export default async function BlogPage() {
  const articles = await listPublishedArticles();
  return <MarketplaceShell><main className="blog-page"><p className="route-kicker">GÓC HỌC AI</p><h1>Học cách làm việc với AI, có ngữ cảnh.</h1><p>Bài viết nguyên bản của ALIPROMPT dành cho người muốn biến AI thành trợ lý hữu ích trong công việc thực tế.</p>{articles.length ? <div className="article-list">{articles.map((article) => <article key={article.id}><p>{article.publishedAt ? dateFormatter.format(new Date(article.publishedAt)) : "ALIPROMPT"}</p><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Đọc bài viết</Link></article>)}</div> : <div className="catalog-empty"><h2>Bài viết đang được biên soạn</h2><p>Nội dung đầu tiên sẽ xuất hiện tại đây sau khi được biên tập và xuất bản.</p></div>}</main></MarketplaceShell>;
}
