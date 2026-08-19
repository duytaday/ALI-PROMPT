import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "../db";
import { categories, favorites, products, promptMedia, promptReactions, promptVersions, prompts, users } from "../db/schema";

export type CatalogFilters = {
  query?: string;
  topic?: string;
  contributor?: string;
  order?: "newest" | "popular" | "helpful";
  page?: number;
};

const MAX_QUERY_LENGTH = 120;

export function normalizeCatalogFilters(filters: CatalogFilters) {
  const query = filters.query?.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH) || undefined;
  const topic = filters.topic?.trim().slice(0, 96) || undefined;
  const contributor = filters.contributor?.trim().slice(0, 120) || undefined;
  const order: NonNullable<CatalogFilters["order"]> = filters.order === "popular" || filters.order === "helpful" ? filters.order : "newest";
  const page = Number.isInteger(filters.page) && filters.page && filters.page > 0 ? Math.min(filters.page, 10_000) : 1;
  return { query, topic, contributor, order, page };
}

function publicPromptClauses(filters: ReturnType<typeof normalizeCatalogFilters>) {
  const clauses = [eq(prompts.moderationStatus, "approved")];
  if (filters.query) {
    const pattern = `%${filters.query.replace(/[%_\\]/g, "\\$&")}%`;
    clauses.push(or(ilike(prompts.title, pattern), ilike(prompts.summary, pattern))!);
  }
  if (filters.topic) clauses.push(eq(categories.slug, filters.topic));
  if (filters.contributor) clauses.push(eq(users.id, filters.contributor));
  return clauses;
}

export async function getActiveCategories() {
  return getDb()
    .select({ id: categories.id, slug: categories.slug, name: categories.name, description: categories.description })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function listPublicPrompts(rawFilters: CatalogFilters = {}, limit = 48) {
  const filters = normalizeCatalogFilters(rawFilters);
  const clauses = publicPromptClauses(filters);

  const query = getDb()
    .select({
      id: prompts.id,
      slug: prompts.slug,
      title: prompts.title,
      summary: prompts.summary,
      accessKind: prompts.accessKind,
      modelCompatibility: prompts.modelCompatibility,
      contentLanguage: prompts.contentLanguage,
      viewCount: prompts.viewCount,
      likeCount: prompts.likeCount,
      dislikeCount: prompts.dislikeCount,
      publishedAt: prompts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      contributorId: users.id,
      contributorName: users.displayName,
      guestAuthorName: prompts.guestAuthorName,
      mediaId: sql<string | null>`(
        select ${promptMedia.id}
        from ${promptMedia}
        where ${promptMedia.promptId} = ${prompts.id}
          and (${promptMedia.status} = 'validated' or ${promptMedia.status} = 'public')
        order by ${promptMedia.createdAt} asc
        limit 1
      )`,
      productId: products.id,
      productSlug: products.slug,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.contributorId, users.id))
    .leftJoin(products, and(eq(products.contentPromptId, prompts.id), eq(products.status, "active")))
    .where(and(...clauses));

  const safeLimit = Math.min(Math.max(limit, 1), 48);
  const offset = (filters.page - 1) * safeLimit;
  if (filters.order === "popular") return query.orderBy(desc(prompts.viewCount), desc(prompts.publishedAt)).limit(safeLimit).offset(offset);
  if (filters.order === "helpful") return query.orderBy(desc(prompts.likeCount), desc(prompts.publishedAt)).limit(safeLimit).offset(offset);
  return query.orderBy(desc(prompts.publishedAt), desc(prompts.createdAt)).limit(safeLimit).offset(offset);
}

export async function countPublicPrompts(rawFilters: CatalogFilters = {}) {
  const filters = normalizeCatalogFilters(rawFilters);
  const [result] = await getDb()
    .select({ value: count() })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.contributorId, users.id))
    .where(and(...publicPromptClauses(filters)));
  return Number(result?.value ?? 0);
}

export async function getPublicPrompt(slug: string) {
  const [prompt] = await getDb()
    .select({
      id: prompts.id,
      slug: prompts.slug,
      title: prompts.title,
      summary: prompts.summary,
      accessKind: prompts.accessKind,
      modelCompatibility: prompts.modelCompatibility,
      contentLanguage: prompts.contentLanguage,
      viewCount: prompts.viewCount,
      likeCount: prompts.likeCount,
      dislikeCount: prompts.dislikeCount,
      publishedAt: prompts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      contributorId: users.id,
      contributorName: users.displayName,
      guestAuthorName: prompts.guestAuthorName,
      productId: products.id,
      productSlug: products.slug,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.contributorId, users.id))
    .leftJoin(products, and(eq(products.contentPromptId, prompts.id), eq(products.status, "active")))
    .where(and(eq(prompts.slug, slug), eq(prompts.moderationStatus, "approved")))
    .limit(1);
  return prompt ?? null;
}

export async function getPromptUseData(promptId: string) {
  const [version] = await getDb().select({ body: promptVersions.body, version: promptVersions.version, variableDefinitions: promptVersions.variableDefinitions, usageMetadata: promptVersions.usageMetadata, outputSchema: promptVersions.outputSchema, lastTestedAt: promptVersions.lastTestedAt })
    .from(promptVersions).where(and(eq(promptVersions.promptId, promptId), eq(promptVersions.isActive, true))).orderBy(desc(promptVersions.createdAt)).limit(1);
  if (version) return version;
  const [legacy] = await getDb().select({ body: prompts.body }).from(prompts).where(eq(prompts.id, promptId)).limit(1);
  return legacy ? { body: legacy.body, version: "legacy", variableDefinitions: [], usageMetadata: {}, outputSchema: null, lastTestedAt: null } : null;
}

export async function getViewerReaction(promptId: string, userId?: string) {
  if (!userId) return null;
  const [reaction] = await getDb().select({ value: promptReactions.value }).from(promptReactions)
    .where(and(eq(promptReactions.promptId, promptId), eq(promptReactions.userId, userId))).limit(1);
  return reaction?.value === 1 || reaction?.value === -1 ? reaction.value : null;
}

export async function getPublicContributor(id: string) {
  const [contributor] = await getDb().select({ id: users.id, displayName: users.displayName }).from(users).where(eq(users.id, id)).limit(1);
  return contributor ?? null;
}

export async function getViewerFavorite(promptId: string, userId?: string) {
  if (!userId) return false;
  const [favorite] = await getDb().select({ id: favorites.id }).from(favorites)
    .where(and(eq(favorites.promptId, promptId), eq(favorites.userId, userId))).limit(1);
  return Boolean(favorite);
}

export async function getPublicPromptMedia(promptId: string) {
  return getDb().select({ id: promptMedia.id, altText: promptMedia.altText }).from(promptMedia)
    .where(and(eq(promptMedia.promptId, promptId), or(eq(promptMedia.status, "validated"), eq(promptMedia.status, "public")))).limit(4);
}
