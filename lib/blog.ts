import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { articles } from "../db/schema";

const publicArticleFields = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  excerpt: articles.excerpt,
  body: articles.body,
  publishedAt: articles.publishedAt,
};

export async function listPublishedArticles(limit = 30) {
  return getDb().select(publicArticleFields).from(articles)
    .where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt), desc(articles.createdAt))
    .limit(Math.min(Math.max(limit, 1), 50));
}

export async function getPublishedArticle(slug: string) {
  const [article] = await getDb().select(publicArticleFields).from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published"))).limit(1);
  return article ?? null;
}
