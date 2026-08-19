import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../db";
import { categories, promptMedia, prompts } from "../../../db/schema";
import { getCurrentUser } from "../../../lib/auth";
import { consumeAuthRateLimit, requestIdentity } from "../../../lib/auth-rate-limit";
import { discardStagedPromptMedia, stagePromptMedia, verifyPromptMedia } from "../../../lib/blob";
import { isSameOrigin, noStoreJson } from "../../../lib/request-security";
import { verifySubmissionCaptcha } from "../../../lib/submission-captcha";

const formSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  title: z.string().trim().min(8).max(180),
  body: z.string().trim().min(80).max(12_000),
  categoryId: z.string().uuid(),
  captchaToken: z.string().min(1).max(512),
  captchaAnswer: z.string().trim().min(1).max(16),
  website: z.string().max(0),
});

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const user = await getCurrentUser();

  const form = await request.formData().catch(() => null);
  const parsed = formSchema.safeParse({
    authorName: form?.get("authorName"), title: form?.get("title"), body: form?.get("body"),
    categoryId: form?.get("categoryId"), captchaToken: form?.get("captchaToken"), captchaAnswer: form?.get("captchaAnswer"), website: form?.get("website"),
  });
  if (!parsed.success) return noStoreJson({ error: "Please complete every required field." }, 400);
  if (!verifySubmissionCaptcha(parsed.data.captchaToken, parsed.data.captchaAnswer)) return noStoreJson({ error: "Please complete the anti-spam check again." }, 400);
  const allowed = await consumeAuthRateLimit({ action: "submission", identity: requestIdentity(request), maximum: 3 });
  if (!allowed) return noStoreJson({ error: "Too many submissions. Please try again later." }, 429);

  const db = getDb();
  const [category] = await db.select({ id: categories.id }).from(categories)
    .where(and(eq(categories.id, parsed.data.categoryId), eq(categories.isActive, true))).limit(1);
  if (!category) return noStoreJson({ error: "Choose a valid active topic." }, 400);

  const slug = `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`;
  const [prompt] = await db.insert(prompts).values({
    slug, title: parsed.data.title, summary: summaryFrom(parsed.data.body), body: parsed.data.body,
    categoryId: category.id, contributorId: user?.id, guestAuthorName: user ? null : parsed.data.authorName, sourceKind: "community", moderationStatus: "pending", accessKind: "free",
  }).returning({ id: prompts.id });

  const media = form?.get("media");
  if (media instanceof File && media.size > 0) {
    let blobKey: string | undefined;
    try {
      const staged = await stagePromptMedia(`submissions/${prompt.id}/sample`, media);
      blobKey = staged.pathname;
      const verified = await verifyPromptMedia(staged.pathname);
      await db.insert(promptMedia).values({ promptId: prompt.id, blobKey: staged.pathname, altText: parsed.data.title, status: "validated", bytes: verified.size, mimeType: verified.contentType });
    } catch {
      if (blobKey) await discardStagedPromptMedia(blobKey).catch(() => undefined);
      await db.delete(prompts).where(eq(prompts.id, prompt.id));
      return noStoreJson({ error: "The media could not be validated. Nothing was submitted." }, 400);
    }
  }
  return noStoreJson({ ok: true, status: "pending" }, 201);
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 110) || "prompt";
}

function summaryFrom(body: string) {
  return body.replace(/\s+/g, " ").trim().slice(0, 500);
}
