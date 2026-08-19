import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import { getDb } from "../../../db";
import { categories, prompts, users } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const admin = await requireAdminUser("/admin/submissions");
  if (!admin) notFound();
  const pending = await getDb().select({ id: prompts.id, title: prompts.title, summary: prompts.summary, createdAt: prompts.createdAt, category: categories.name, contributor: users.displayName, guestAuthorName: prompts.guestAuthorName })
    .from(prompts).leftJoin(categories, eq(prompts.categoryId, categories.id)).leftJoin(users, eq(prompts.contributorId, users.id))
    .where(and(eq(prompts.sourceKind, "community"), eq(prompts.moderationStatus, "pending"))).orderBy(asc(prompts.createdAt)).limit(100);
  return <MarketplaceShell><main className="admin-submissions"><p className="route-kicker">MODERATION</p><h1>Prompt chờ kiểm duyệt</h1><p>Mọi quyết định xuất bản đều được lưu với người thực hiện, lý do và thời điểm.</p><Link href="/admin">← Quay lại vận hành</Link>
    {pending.length ? <ul>{pending.map((item) => <li key={item.id}><div><strong>{item.title}</strong><span>{item.category ?? "Chưa phân loại"} · {item.contributor ?? item.guestAuthorName ?? "Không rõ người gửi"}</span><p>{item.summary}</p></div><ModerationControls promptId={item.id} /></li>)}</ul> : <div className="catalog-empty"><h2>Không có prompt chờ duyệt</h2><p>Submission mới sẽ xuất hiện ở đây.</p></div>}
  </main></MarketplaceShell>;
}

function ModerationControls({ promptId }: { promptId: string }) {
  return <form action={`/api/admin/submissions/${promptId}`} method="post" className="moderation-controls"><label>Lý do<textarea name="reason" maxLength={1000} required /></label><button name="action" value="approve" type="submit">Duyệt</button><button name="action" value="reject" type="submit">Từ chối</button></form>;
}
