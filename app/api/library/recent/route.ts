import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { promptUsageEvents } from "../../../../db/schema";
import { consumeWorkspaceMutationLimit, requireWorkspaceUser } from "../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  await getDb().delete(promptUsageEvents).where(eq(promptUsageEvents.userId, context.user.id));
  return noStoreJson({ ok: true });
}
