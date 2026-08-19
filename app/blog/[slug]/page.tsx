import Link from "next/link";
import { notFound } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import { getPublishedArticle } from "../../../lib/blog";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  return <MarketplaceShell><main><article className="article-page"><Link className="back-link" href="/blog">← Góc học AI</Link><p className="route-kicker">ALIPROMPT</p><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p>{article.publishedAt ? <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(article.publishedAt))}</time> : null}<div className="article-body">{article.body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><Link className="back-link" href="/blog">← Xem thêm bài viết</Link></article></main></MarketplaceShell>;
}
