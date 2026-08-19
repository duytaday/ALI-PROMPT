import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { auditEvents, categories } from "../../../../db/schema";
import { getAdminUser } from "../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({ name: z.string().trim().min(2).max(120), description: z.string().trim().max(280).optional(), sortOrder: z.coerce.number().int().min(0).max(10_000), isActive: z.boolean() });

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ name: form?.get("name"), description: form?.get("description") || undefined, sortOrder: form?.get("sortOrder"), isActive: form?.get("isActive") === "on" });
  if (!parsed.success) return noStoreJson({ error: "Provide a category name and order." }, 400);
  const slug = `${slugify(parsed.data.name)}-${crypto.randomUUID().slice(0, 6)}`;
  const db = getDb();
  await db.transaction(async (tx) => {
    const [category] = await tx.insert(categories).values({ slug, name: parsed.data.name, description: parsed.data.description, sortOrder: parsed.data.sortOrder, isActive: parsed.data.isActive }).returning({ id: categories.id });
    await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "category", entityId: category.id, action: "category.created", after: { slug, sortOrder: parsed.data.sortOrder, isActive: parsed.data.isActive } });
  });
  return Response.redirect(new URL("/admin/categories", request.url), 303);
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 85) || "chu-de";
}
