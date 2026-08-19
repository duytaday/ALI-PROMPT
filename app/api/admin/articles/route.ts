import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { articles, auditEvents } from "../../../../db/schema";
import { getAdminUser } from "../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({
  title: z.string().trim().min(8).max(180), excerpt: z.string().trim().min(24).max(500), body: z.string().trim().min(80).max(30_000), status: z.enum(["draft", "published"]),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ title: form?.get("title"), excerpt: form?.get("excerpt"), body: form?.get("body"), status: form?.get("status") });
  if (!parsed.success) return noStoreJson({ error: "Complete every article field before saving." }, 400);
  const slug = `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`;
  const publishedAt = parsed.data.status === "published" ? new Date().toISOString() : null;
  await getDb().transaction(async (tx) => {
    const [article] = await tx.insert(articles).values({ slug, title: parsed.data.title, excerpt: parsed.data.excerpt, body: parsed.data.body, status: parsed.data.status, publishedAt }).returning({ id: articles.id });
    await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "article", entityId: article.id, action: `article.${parsed.data.status === "published" ? "published" : "created"}`, after: { slug, status: parsed.data.status } });
  });
  return Response.redirect(new URL("/admin/articles", request.url), 303);
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 110) || "aliprompt-article";
}
