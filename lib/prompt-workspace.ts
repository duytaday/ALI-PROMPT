import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { products, promptCollections, prompts } from "../db/schema";
import { getCurrentUser } from "./auth";
import { consumeAuthRateLimit, requestIdentity } from "./auth-rate-limit";
import { hasActiveEntitlement } from "./commerce";
import { isSameOrigin, noStoreJson } from "./request-security";
import type { NextRequest } from "next/server";

export const collectionInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(280).optional().nullable(),
});

export const collectionPatchSchema = collectionInputSchema.partial().refine(
  (value) => value.name !== undefined || value.description !== undefined,
  "Provide a collection name or description.",
);

export const workspaceIdSchema = z.string().uuid();
export const noteInputSchema = z.object({ note: z.string().max(2_000) });
export const usageInputSchema = z.object({
  promptId: workspaceIdSchema,
  promptVersion: z.string().trim().min(1).max(32),
  copyFormat: z.enum(["plain", "markdown", "json"]),
  idempotencyKey: z.string().uuid(),
});

export async function requireWorkspaceUser(request: NextRequest) {
  if (!isSameOrigin(request)) return { error: noStoreJson({ error: "Invalid request origin." }, 403) };
  const user = await getCurrentUser();
  if (!user) return { error: noStoreJson({ error: "Sign in is required." }, 401) };
  return { user };
}

export async function consumeWorkspaceMutationLimit(request: Request, userId: string) {
  return consumeAuthRateLimit({
    action: "workspace",
    identity: `${userId}:${requestIdentity(request)}`,
    maximum: 180,
  });
}

export async function getOwnedCollection(collectionId: string, userId: string) {
  const [collection] = await getDb()
    .select({ id: promptCollections.id, name: promptCollections.name })
    .from(promptCollections)
    .where(and(eq(promptCollections.id, collectionId), eq(promptCollections.userId, userId)))
    .limit(1);
  return collection ?? null;
}

/** Returns approved public metadata only, never a prompt body. */
export async function getApprovedWorkspacePrompt(promptId: string) {
  const [prompt] = await getDb()
    .select({ id: prompts.id, accessKind: prompts.accessKind, productId: products.id })
    .from(prompts)
    .leftJoin(products, and(eq(products.contentPromptId, prompts.id), eq(products.status, "active")))
    .where(and(eq(prompts.id, promptId), eq(prompts.moderationStatus, "approved")))
    .limit(1);
  return prompt ?? null;
}

/** A copy/notes write also requires the viewer's current paid entitlement. */
export async function getUsableWorkspacePrompt(promptId: string, userId: string) {
  const prompt = await getApprovedWorkspacePrompt(promptId);
  if (!prompt) return null;
  if (prompt.accessKind === "paid" && !(await hasActiveEntitlement(userId, prompt.productId))) return null;
  return prompt;
}

export function normalizedOptional(value: string | null | undefined) {
  const result = value?.trim();
  return result ? result : null;
}
