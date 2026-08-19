import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { auditEvents, categories, prompts } from "../../../../db/schema";
import { getAdminUser } from "../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({ title: z.string().trim().min(8).max(180), summary: z.string().trim().min(24).max(500), body: z.string().trim().min(80).max(12_000), categoryId: z.string().uuid() });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ title: form?.get("title"), summary: form?.get("summary"), body: form?.get("body"), categoryId: form?.get("categoryId") });
  if (!parsed.success) return noStoreJson({ error: "Complete every prompt field and choose an active topic." }, 400);
  const db = getDb();
  const [category] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.id, parsed.data.categoryId), eq(categories.isActive, true))).limit(1);
  if (!category) return noStoreJson({ error: "Choose a valid active topic." }, 400);
  const slug = `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`;
  await db.transaction(async (tx) => {
    const [prompt] = await tx.insert(prompts).values({ slug, title: parsed.data.title, summary: parsed.data.summary, body: parsed.data.body, categoryId: category.id, contributorId: admin.id, sourceKind: "aliprompt", moderationStatus: "approved", accessKind: "free", publishedAt: new Date().toISOString() }).returning({ id: prompts.id });
    await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "prompt", entityId: prompt.id, action: "prompt.aliprompt_created", after: { slug, categoryId: category.id, accessKind: "free" } });
  });
  return Response.redirect(new URL("/admin/prompts", request.url), 303);
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 110) || "aliprompt-prompt";
}
