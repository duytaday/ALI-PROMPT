import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { promptUsageEvents, promptVersions } from "../../../../db/schema";
import {
  consumeWorkspaceMutationLimit,
  getUsableWorkspacePrompt,
  requireWorkspaceUser,
  usageInputSchema,
} from "../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../lib/request-security";

export const dynamic = "force-dynamic";

/** Receives metadata only after a browser clipboard write succeeds. */
export async function POST(request: NextRequest) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const body = await request.json().catch(() => null);
  const parsed = usageInputSchema.safeParse(body);
  if (!parsed.success) return noStoreJson({ error: "Invalid usage event." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);

  const usable = await getUsableWorkspacePrompt(parsed.data.promptId, context.user.id);
  if (!usable) return noStoreJson({ error: "Prompt is unavailable." }, 404);
  const [activeVersion] = await getDb()
    .select({ version: promptVersions.version })
    .from(promptVersions)
    .where(and(eq(promptVersions.promptId, usable.id), eq(promptVersions.isActive, true)))
    .limit(1);
  if ((activeVersion?.version ?? "legacy") !== parsed.data.promptVersion) {
    return noStoreJson({ error: "Prompt version is no longer active." }, 409);
  }

  const inserted = await getDb()
    .insert(promptUsageEvents)
    .values({ userId: context.user.id, ...parsed.data })
    .onConflictDoNothing({ target: [promptUsageEvents.userId, promptUsageEvents.idempotencyKey] })
    .returning({ id: promptUsageEvents.id });
  return noStoreJson({ ok: true, recorded: inserted.length === 1 }, inserted.length === 1 ? 201 : 200);
}
