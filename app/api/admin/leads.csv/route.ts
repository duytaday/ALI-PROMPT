import { desc } from "drizzle-orm";
import { getAdminUser } from "../../../../lib/admin-auth";
import { ensureLeadStorage, getDb } from "../../../../db";
import { leads } from "../../../../db/schema";

export const dynamic = "force-dynamic";

function spreadsheetSafe(value: string) {
  const normalized = /^[=+\-@]/u.test(value) ? `'${value}` : value;
  return `"${normalized.replaceAll('"', '""')}"`;
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "Not authorized." }, { status: 403 });
  }

  await ensureLeadStorage();
  const rows = await getDb()
    .select()
    .from(leads)
    .orderBy(desc(leads.lastSubmittedAt))
    .limit(5000);

  const header = [
    "created_at",
    "last_submitted_at",
    "submission_count",
    "name",
    "contact",
    "role_or_industry",
    "intent",
    "source",
  ];
  const lines = rows.map((lead) =>
    [
      lead.createdAt,
      lead.lastSubmittedAt,
      String(lead.submissionCount),
      lead.name,
      lead.contact,
      lead.role,
      lead.stage,
      lead.source,
    ]
      .map(spreadsheetSafe)
      .join(","),
  );
  const csv = `\uFEFF${header.join(",")}\r\n${lines.join("\r\n")}`;

  return new Response(csv, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `attachment; filename="aliprompt-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
