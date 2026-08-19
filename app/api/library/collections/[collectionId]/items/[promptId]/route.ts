import { and, count, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../../../../db";
import { promptCollectionItems } from "../../../../../../../db/schema";
import {
  consumeWorkspaceMutationLimit,
  getOwnedCollection,
  getApprovedWorkspacePrompt,
  requireWorkspaceUser,
  workspaceIdSchema,
} from "../../../../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ collectionId: string; promptId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const route = await params;
  const collectionId = workspaceIdSchema.safeParse(route.collectionId);
  const promptId = workspaceIdSchema.safeParse(route.promptId);
  if (!collectionId.success || !promptId.success) return noStoreJson({ error: "Invalid request." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  if (!(await getOwnedCollection(collectionId.data, context.user.id))) return noStoreJson({ error: "Collection not found." }, 404);
  const usable = await getApprovedWorkspacePrompt(promptId.data);

  const added = await getDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`collection-items:${collectionId.data}`}))`);
    const [existing] = await tx
      .select({ id: promptCollectionItems.id })
      .from(promptCollectionItems)
      .where(and(eq(promptCollectionItems.collectionId, collectionId.data), eq(promptCollectionItems.promptId, promptId.data)))
      .limit(1);
    if (existing) return "existing" as const;
    if (!usable) return "unavailable" as const;
    const [total] = await tx.select({ value: count() }).from(promptCollectionItems).where(eq(promptCollectionItems.collectionId, collectionId.data));
    if (Number(total?.value ?? 0) >= 500) return "limit" as const;
    await tx.insert(promptCollectionItems).values({ collectionId: collectionId.data, promptId: promptId.data });
    return "added" as const;
  });
  if (added === "unavailable") return noStoreJson({ error: "Prompt is unavailable." }, 404);
  if (added === "limit") return noStoreJson({ error: "Collection item limit reached." }, 409);
  return noStoreJson({ ok: true, added: added === "added" }, added === "added" ? 201 : 200);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ collectionId: string; promptId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const route = await params;
  const collectionId = workspaceIdSchema.safeParse(route.collectionId);
  const promptId = workspaceIdSchema.safeParse(route.promptId);
  if (!collectionId.success || !promptId.success) return noStoreJson({ error: "Invalid request." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  if (!(await getOwnedCollection(collectionId.data, context.user.id))) return noStoreJson({ error: "Collection not found." }, 404);
  await getDb().delete(promptCollectionItems).where(and(eq(promptCollectionItems.collectionId, collectionId.data), eq(promptCollectionItems.promptId, promptId.data)));
  return noStoreJson({ ok: true });
}
