import { and, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { promptReactions, prompts } from "../../../../../db/schema";
import { getCurrentUser } from "../../../../../lib/auth";
import { isSameOrigin, noStoreJson } from "../../../../../lib/request-security";

const payloadSchema = z.object({ value: z.union([z.literal(-1), z.literal(1), z.null()]) });

export async function GET(_request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params;
  const user = await getCurrentUser();
  const db = getDb();
  const [prompt] = await db.select({ likeCount: prompts.likeCount, dislikeCount: prompts.dislikeCount }).from(prompts)
    .where(and(eq(prompts.id, promptId), eq(prompts.moderationStatus, "approved"))).limit(1);
  if (!prompt) return noStoreJson({ error: "Prompt is unavailable." }, 404);
  if (!user) return noStoreJson({ value: null, ...prompt });
  const [reaction] = await db.select({ value: promptReactions.value }).from(promptReactions)
    .where(and(eq(promptReactions.userId, user.id), eq(promptReactions.promptId, promptId))).limit(1);
  return noStoreJson({ value: reaction?.value === 1 || reaction?.value === -1 ? reaction.value : null, ...prompt });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ error: "Sign in is required." }, 401);
  const { promptId } = await params;
  const payload = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return noStoreJson({ error: "Choose a valid reaction." }, 400);

  const db = getDb();
  const [prompt] = await db.select({ id: prompts.id }).from(prompts)
    .where(and(eq(prompts.id, promptId), eq(prompts.moderationStatus, "approved"))).limit(1);
  if (!prompt) return noStoreJson({ error: "Prompt is unavailable." }, 404);

  const result = await db.transaction(async (tx) => {
    const [previous] = await tx.select({ value: promptReactions.value }).from(promptReactions)
      .where(and(eq(promptReactions.userId, user.id), eq(promptReactions.promptId, prompt.id))).limit(1);
    const likeDelta = (payload.data.value === 1 ? 1 : 0) - (previous?.value === 1 ? 1 : 0);
    const dislikeDelta = (payload.data.value === -1 ? 1 : 0) - (previous?.value === -1 ? 1 : 0);
    if (payload.data.value === null) {
      await tx.delete(promptReactions).where(and(eq(promptReactions.userId, user.id), eq(promptReactions.promptId, prompt.id)));
    } else {
      await tx.insert(promptReactions).values({ userId: user.id, promptId: prompt.id, value: payload.data.value })
        .onConflictDoUpdate({ target: [promptReactions.userId, promptReactions.promptId], set: { value: payload.data.value, updatedAt: sql`now()` } });
    }
    const [updated] = await tx.update(prompts).set({
      likeCount: sql`GREATEST(0, ${prompts.likeCount} + ${likeDelta})`,
      dislikeCount: sql`GREATEST(0, ${prompts.dislikeCount} + ${dislikeDelta})`,
    }).where(eq(prompts.id, prompt.id)).returning({ likeCount: prompts.likeCount, dislikeCount: prompts.dislikeCount });
    return { value: payload.data.value, ...updated };
  });
  return noStoreJson({ ok: true, ...result });
}
