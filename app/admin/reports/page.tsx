import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { prompts, reports } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const admin = await requireAdminUser("/admin/reports");
  if (!admin) notFound();
  const openReports = await getDb().select({ id: reports.id, reason: reports.reason, details: reports.details, createdAt: reports.createdAt, promptSlug: prompts.slug, promptTitle: prompts.title })
    .from(reports).innerJoin(prompts, eq(reports.promptId, prompts.id)).where(eq(reports.status, "open")).orderBy(asc(reports.createdAt)).limit(200);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">BÁO CÁO NỘI DUNG</p><h1>Prompt cần xem xét</h1><p>Chỉ xử lý trạng thái báo cáo tại đây. Nếu nội dung cần gỡ hoặc chỉnh sửa, thực hiện quyết định moderation tương ứng và giữ lại lý do trong audit log.</p>{openReports.length ? <ul>{openReports.map((report) => <li key={report.id}><div><strong>{report.promptTitle}</strong><span>Lý do: {report.reason} · {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(report.createdAt))}</span><p>{report.details || "Không có ghi chú thêm."}</p><Link href={`/prompts/${report.promptSlug}`}>Xem prompt công khai</Link></div><form className="moderation-controls" action={`/api/admin/reports/${report.id}`} method="post"><label>Ghi chú xử lý<textarea name="reason" required minLength={4} maxLength={1000} /></label><button name="action" value="resolve">Đã xử lý</button><button name="action" value="dismiss">Bỏ qua báo cáo</button></form></li>)}</ul> : <div className="catalog-empty"><h2>Không có báo cáo đang mở</h2><p>Các báo cáo mới từ thành viên sẽ xuất hiện ở đây.</p></div>}</main>;
}
