import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../../db";
import { promptCollections } from "../../../../../db/schema";
import {
  collectionPatchSchema,
  consumeWorkspaceMutationLimit,
  requireWorkspaceUser,
  workspaceIdSchema,
} from "../../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const collectionId = workspaceIdSchema.safeParse((await params).collectionId);
  const body = await request.json().catch(() => null);
  const parsed = collectionPatchSchema.safeParse(body);
  if (!collectionId.success || !parsed.success) return noStoreJson({ error: "Invalid collection." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);

  const updates: { name?: string; description?: string | null; updatedAt: string } = { updatedAt: new Date().toISOString() };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.description !== undefined) updates.description = parsed.data.description?.trim() || null;
  const [collection] = await getDb()
    .update(promptCollections)
    .set(updates)
    .where(and(eq(promptCollections.id, collectionId.data), eq(promptCollections.userId, context.user.id)))
    .returning({ id: promptCollections.id, name: promptCollections.name, description: promptCollections.description, updatedAt: promptCollections.updatedAt });
  if (!collection) return noStoreJson({ error: "Collection not found." }, 404);
  return noStoreJson({ collection });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ collectionId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const collectionId = workspaceIdSchema.safeParse((await params).collectionId);
  if (!collectionId.success) return noStoreJson({ error: "Invalid collection." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  const [deleted] = await getDb()
    .delete(promptCollections)
    .where(and(eq(promptCollections.id, collectionId.data), eq(promptCollections.userId, context.user.id)))
    .returning({ id: promptCollections.id });
  if (!deleted) return noStoreJson({ error: "Collection not found." }, 404);
  return noStoreJson({ ok: true });
}
