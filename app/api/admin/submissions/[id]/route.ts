import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { auditEvents, prompts } from "../../../../../db/schema";
import { getAdminUser } from "../../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../../lib/request-security";

const bodySchema = z.object({ action: z.enum(["approve", "reject"]), reason: z.string().trim().min(4).max(1000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const { id } = await params;
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ action: form?.get("action"), reason: form?.get("reason") });
  if (!parsed.success) return noStoreJson({ error: "Provide an action and a concise reason." }, 400);

  const db = getDb();
  const [before] = await db.select({ id: prompts.id, status: prompts.moderationStatus, slug: prompts.slug, title: prompts.title })
    .from(prompts).where(and(eq(prompts.id, id), eq(prompts.sourceKind, "community"), eq(prompts.moderationStatus, "pending"))).limit(1);
  if (!before) return noStoreJson({ error: "This pending submission is no longer available." }, 409);

  const nextStatus = parsed.data.action === "approve" ? "approved" : "rejected";
  await db.transaction(async (tx) => {
    await tx.update(prompts).set({ moderationStatus: nextStatus, publishedAt: nextStatus === "approved" ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }).where(eq(prompts.id, before.id));
    await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "prompt", entityId: before.id, action: `moderation.${nextStatus}`, reason: parsed.data.reason, before: { status: before.status }, after: { status: nextStatus } });
  });
  return Response.redirect(new URL("/admin/submissions", request.url), 303);
}
