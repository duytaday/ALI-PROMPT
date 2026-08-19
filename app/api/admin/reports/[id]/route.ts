import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { auditEvents, reports } from "../../../../../db/schema";
import { getAdminUser } from "../../../../../lib/admin-auth";
import { isSameOrigin, noStoreJson } from "../../../../../lib/request-security";

const bodySchema = z.object({ action: z.enum(["resolve", "dismiss"]), reason: z.string().trim().min(4).max(1000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid request origin." }, 403);
  const admin = await getAdminUser();
  if (!admin) return noStoreJson({ error: "Not authorized." }, 403);
  const { id } = await params;
  const form = await request.formData().catch(() => null);
  const parsed = bodySchema.safeParse({ action: form?.get("action"), reason: form?.get("reason") });
  if (!parsed.success) return noStoreJson({ error: "Provide an action and a concise resolution note." }, 400);
  const status = parsed.data.action === "resolve" ? "resolved" : "dismissed";
  const db = getDb();
  try {
    await db.transaction(async (tx) => {
      const [before] = await tx.select({ id: reports.id, status: reports.status, promptId: reports.promptId, reason: reports.reason })
        .from(reports).where(and(eq(reports.id, id), eq(reports.status, "open"))).limit(1);
      if (!before) throw new Error("REPORT_NOT_OPEN");
      await tx.update(reports).set({ status, resolvedAt: new Date().toISOString() }).where(eq(reports.id, before.id));
      await tx.insert(auditEvents).values({ actorId: admin.id, entityType: "report", entityId: before.id, action: `report.${status}`, reason: parsed.data.reason, before: { status: before.status, promptId: before.promptId, reason: before.reason }, after: { status } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "REPORT_NOT_OPEN") return noStoreJson({ error: "This report is no longer open." }, 409);
    throw error;
  }
  return Response.redirect(new URL("/admin/reports", request.url), 303);
}
