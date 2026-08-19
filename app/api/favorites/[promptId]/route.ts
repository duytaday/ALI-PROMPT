import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getDb } from "../../../../db";
import { favorites, prompts } from "../../../../db/schema";
import { getCurrentUser } from "../../../../lib/auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

async function requireFavoriteUser(request: NextRequest) {
  if (!isSameOrigin(request)) return { error: noStoreJson({ error: "Invalid request origin." }, 403) };
  const user = await getCurrentUser();
  if (!user) return { error: noStoreJson({ error: "Sign in is required." }, 401) };
  return { user };
}

async function requireApprovedPrompt(promptId: string) {
  const [prompt] = await getDb().select({ id: prompts.id }).from(prompts)
    .where(and(eq(prompts.id, promptId), eq(prompts.moderationStatus, "approved"))).limit(1);
  return prompt ?? null;
}

async function setFavorite(request: NextRequest, promptId: string, favorited: boolean) {
  const context = await requireFavoriteUser(request);
  if ("error" in context) return context.error;
  if (!favorited) {
    await getDb().delete(favorites).where(and(eq(favorites.userId, context.user.id), eq(favorites.promptId, promptId)));
    return noStoreJson({ ok: true, saved: false });
  }
  const prompt = await requireApprovedPrompt(promptId);
  if (!prompt) return noStoreJson({ error: "Prompt is unavailable." }, 404);
  await getDb().insert(favorites).values({ userId: context.user.id, promptId: prompt.id }).onConflictDoNothing();
  return noStoreJson({ ok: true, saved: true }, 201);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.favorited !== "boolean") return noStoreJson({ error: "favorited must be a boolean." }, 400);
  return setFavorite(request, promptId, body.favorited);
}

// Compatibility for existing clients. New UI uses PUT as the idempotent contract.
export async function POST(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params;
  return setFavorite(request, promptId, true);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params;
  return setFavorite(request, promptId, false);
}
