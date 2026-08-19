import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../db";
import { auditEvents, products, prompts } from "../../../../db/schema";
import { getAdminUser } from "../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../lib/request-security";

const bodySchema = z.object({
  title: z.string().trim().min(8).max(180), description: z.string().trim().min(24).max(1000),
  priceAmount: z.coerce.number().int().nonnegative().max(100_000_000), currency: z.literal("VND"),
  contentPromptId: z.union([z.string().uuid(), z.literal("")]).transform((value) => value || null), status: z.enum(["draft", "active"]),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ title: form?.get("title"), description: form?.get("description"), priceAmount: form?.get("priceAmount"), currency: form?.get("currency"), contentPromptId: form?.get("contentPromptId"), status: form?.get("status") });
  if (!parsed.success) return noStoreJson({ error: "Complete the product fields with a valid VND price." }, 400);
  const db = getDb();
  const slug = `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`;
  try {
    await db.transaction(async (tx) => {
      if (parsed.data.contentPromptId) {
        const [prompt] = await tx.select({ id: prompts.id, accessKind: prompts.accessKind }).from(prompts).where(and(eq(prompts.id, parsed.data.contentPromptId), eq(prompts.sourceKind, "aliprompt"), eq(prompts.moderationStatus, "approved"))).limit(1);
        if (!prompt) throw new Error("INVALID_PRODUCT_PROMPT");
        await tx.update(prompts).set({ accessKind: "paid", updatedAt: new Date().toISOString() }).where(eq(prompts.id, prompt.id));
      }
      const [product] = await tx.insert(products).values({ slug, title: parsed.data.title, description: parsed.data.description, contentPromptId: parsed.data.contentPromptId, sellerKind: "aliprompt", status: parsed.data.status, priceAmount: parsed.data.priceAmount, currency: parsed.data.currency }).returning({ id: products.id });
      await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "product", entityId: product.id, action: "product.created", after: { status: parsed.data.status, priceAmount: parsed.data.priceAmount, currency: parsed.data.currency, contentPromptId: parsed.data.contentPromptId } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_PRODUCT_PROMPT") return noStoreJson({ error: "Paid prompt products must use an approved ALIPROMPT prompt." }, 400);
    if (typeof error === "object" && error && "code" in error && error.code === "23505") return noStoreJson({ error: "That prompt already belongs to a product." }, 409);
    throw error;
  }
  return Response.redirect(new URL("/admin/products", request.url), 303);
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 110) || "aliprompt-product";
}
