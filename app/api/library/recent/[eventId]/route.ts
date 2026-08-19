import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../../db";
import { promptUsageEvents } from "../../../../../db/schema";
import {
  consumeWorkspaceMutationLimit,
  requireWorkspaceUser,
  workspaceIdSchema,
} from "../../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const eventId = workspaceIdSchema.safeParse((await params).eventId);
  if (!eventId.success) return noStoreJson({ error: "Invalid history entry." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  const [deleted] = await getDb()
    .delete(promptUsageEvents)
    .where(and(eq(promptUsageEvents.id, eventId.data), eq(promptUsageEvents.userId, context.user.id)))
    .returning({ id: promptUsageEvents.id });
  if (!deleted) return noStoreJson({ error: "History entry not found." }, 404);
  return noStoreJson({ ok: true });
}
