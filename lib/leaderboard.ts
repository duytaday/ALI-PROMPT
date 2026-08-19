import { and, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { prompts, users } from "../db/schema";

export async function getContributorLeaderboard(limit = 100) {
  return getDb().select({
    id: users.id,
    displayName: users.displayName,
    promptCount: count(prompts.id),
    helpfulCount: sql<number>`COALESCE(SUM(${prompts.likeCount}), 0)`,
    score: sql<number>`COUNT(${prompts.id}) * 10 + COALESCE(SUM(${prompts.likeCount}), 0)`,
  }).from(users).innerJoin(prompts, and(eq(prompts.contributorId, users.id), eq(prompts.moderationStatus, "approved")))
    .groupBy(users.id, users.displayName)
    .orderBy(desc(sql`COUNT(${prompts.id}) * 10 + COALESCE(SUM(${prompts.likeCount}), 0)`), desc(count(prompts.id)), users.displayName)
    .limit(Math.min(Math.max(limit, 1), 100));
}
