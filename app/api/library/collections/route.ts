import { count, desc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { promptCollectionItems, promptCollections } from "../../../../db/schema";
import {
  collectionInputSchema,
  consumeWorkspaceMutationLimit,
  requireWorkspaceUser,
} from "../../../../lib/prompt-workspace";
import { getCurrentUser } from "../../../../lib/auth";
import { noStoreJson } from "../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ error: "Sign in is required." }, 401);
  const collections = await getDb()
    .select({
      id: promptCollections.id,
      name: promptCollections.name,
      description: promptCollections.description,
      updatedAt: promptCollections.updatedAt,
      itemCount: count(promptCollectionItems.id),
    })
    .from(promptCollections)
    .leftJoin(promptCollectionItems, eq(promptCollectionItems.collectionId, promptCollections.id))
    .where(eq(promptCollections.userId, user.id))
    .groupBy(promptCollections.id)
    .orderBy(desc(promptCollections.updatedAt), desc(promptCollections.createdAt))
    .limit(50);
  return noStoreJson({ collections: collections.map((item) => ({ ...item, itemCount: Number(item.itemCount) })) });
}

export async function POST(request: NextRequest) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const body = await request.json().catch(() => null);
  const parsed = collectionInputSchema.safeParse(body);
  if (!parsed.success) return noStoreJson({ error: "Invalid collection." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) {
    return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  }

  const collection = await getDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`collection-limit:${context.user.id}`}))`);
    const [existing] = await tx
      .select({ value: count() })
      .from(promptCollections)
      .where(eq(promptCollections.userId, context.user.id));
    if (Number(existing?.value ?? 0) >= 50) return null;
    const [created] = await tx
      .insert(promptCollections)
      .values({
        userId: context.user.id,
        name: parsed.data.name,
        description: parsed.data.description?.trim() || null,
      })
      .returning({
        id: promptCollections.id,
        name: promptCollections.name,
        description: promptCollections.description,
        updatedAt: promptCollections.updatedAt,
      });
    return created;
  });

  if (!collection) return noStoreJson({ error: "Collection limit reached." }, 409);
  return noStoreJson({ collection: { ...collection, itemCount: 0 } }, 201);
}
