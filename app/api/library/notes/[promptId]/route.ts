import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "../../../../../db";
import { promptNotes } from "../../../../../db/schema";
import { getCurrentUser } from "../../../../../lib/auth";
import {
  consumeWorkspaceMutationLimit,
  getUsableWorkspacePrompt,
  noteInputSchema,
  requireWorkspaceUser,
  workspaceIdSchema,
} from "../../../../../lib/prompt-workspace";
import { noStoreJson } from "../../../../../lib/request-security";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ error: "Sign in is required." }, 401);
  const promptId = workspaceIdSchema.safeParse((await params).promptId);
  if (!promptId.success) return noStoreJson({ error: "Invalid prompt." }, 400);
  const [note] = await getDb()
    .select({ note: promptNotes.body, updatedAt: promptNotes.updatedAt })
    .from(promptNotes)
    .where(and(eq(promptNotes.userId, user.id), eq(promptNotes.promptId, promptId.data)))
    .limit(1);
  return noStoreJson({ note: note?.note ?? "", updatedAt: note?.updatedAt ?? null });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const context = await requireWorkspaceUser(request);
  if ("error" in context) return context.error;
  const promptId = workspaceIdSchema.safeParse((await params).promptId);
  const body = await request.json().catch(() => null);
  const parsed = noteInputSchema.safeParse(body);
  if (!promptId.success || !parsed.success) return noStoreJson({ error: "Invalid note." }, 400);
  if (!(await consumeWorkspaceMutationLimit(request, context.user.id))) return noStoreJson({ error: "Too many workspace changes. Try again shortly." }, 429);
  if (!(await getUsableWorkspacePrompt(promptId.data, context.user.id))) return noStoreJson({ error: "Prompt is unavailable." }, 404);

  const note = parsed.data.note.trim();
  if (!note) {
    await getDb().delete(promptNotes).where(and(eq(promptNotes.userId, context.user.id), eq(promptNotes.promptId, promptId.data)));
    return noStoreJson({ ok: true, note: "", deleted: true });
  }
  const [saved] = await getDb()
    .insert(promptNotes)
    .values({ userId: context.user.id, promptId: promptId.data, body: note })
    .onConflictDoUpdate({
      target: [promptNotes.userId, promptNotes.promptId],
      set: { body: note, updatedAt: new Date().toISOString() },
    })
    .returning({ note: promptNotes.body, updatedAt: promptNotes.updatedAt });
  return noStoreJson({ ok: true, note: saved.note, updatedAt: saved.updatedAt });
}
