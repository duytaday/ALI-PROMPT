import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { count, desc } from "drizzle-orm";
import { getDb } from "../../db";
import { leads } from "../../db/schema";
import { requireAdminUser } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vận hành lead",
  robots: { index: false, follow: false },
};

const stageLabels = {
  workshop: "Lớp 2 giờ",
  agent_waitlist: "AI Agent",
  prompt_pack: "Ngành mới",
} as const;

function isKnownStage(value: string): value is keyof typeof stageLabels {
  return value in stageLabels;
}

function formatDate(value: string) {
  const parsed = new Date(`${value.replace(" ", "T")}Z`);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(parsed);
}

export default async function AdminPage() {
  const admin = await requireAdminUser("/admin");
  if (!admin) notFound();

  const db = getDb();
  const [rows, groupedCounts] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.lastSubmittedAt)).limit(250),
    db
      .select({ stage: leads.stage, value: count() })
      .from(leads)
      .groupBy(leads.stage),
  ]);

  const counts = groupedCounts.reduce(
    (current, group) => {
      current.total += group.value;
      if (isKnownStage(group.stage)) current[group.stage] = group.value;
      return current;
    },
    { total: 0, workshop: 0, agent_waitlist: 0, prompt_pack: 0 },
  );

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/" aria-label="Về trang AliPrompt">
          <span className="brand-mark">A</span>
          <span>AliPrompt</span>
        </Link>
        <div>
          <span className="admin-identity">{admin.displayName}</span>
          <form action="/api/auth/logout" method="post"><button type="submit">Đăng xuất</button></form>
        </div>
      </header>

      <section className="admin-title">
        <div>
          <p className="eyebrow">BÀN VẬN HÀNH · CHỈ CHỦ SỞ HỮU</p>
          <h1>Lead mới của AliPrompt</h1>
          <p>Xem 250 đăng ký gần nhất. Không chia sẻ hoặc tải danh sách xuống thiết bị dùng chung.</p>
        </div>
        <a className="button button-primary" href="/api/admin/leads.csv">
          Xuất CSV <span aria-hidden="true">↓</span>
        </a>
        <Link className="button" href="/admin/submissions">Kiểm duyệt prompt</Link>
        <Link className="button" href="/admin/reports">Xử lý báo cáo</Link>
        <Link className="button" href="/admin/products">Sản phẩm</Link>
        <Link className="button" href="/admin/articles">Bài viết</Link>
        <Link className="button" href="/admin/entitlements">Quyền truy cập</Link>
        <Link className="button" href="/admin/orders">Đơn hàng</Link>
        <Link className="button" href="/admin/prompts">Prompt ALIPROMPT</Link>
        <Link className="button" href="/admin/categories">Chủ đề</Link>
      </section>

      <section className="admin-stats" aria-label="Tổng hợp đăng ký">
        <div><span>TỔNG LEAD</span><strong>{counts.total}</strong></div>
        <div><span>LỚP 2 GIỜ</span><strong>{counts.workshop}</strong></div>
        <div><span>AI AGENT</span><strong>{counts.agent_waitlist}</strong></div>
        <div><span>NGÀNH MỚI</span><strong>{counts.prompt_pack}</strong></div>
      </section>

      <section className="admin-table-wrap" aria-label="Danh sách đăng ký">
        {rows.length === 0 ? (
          <div className="admin-empty">
            <span>CHƯA CÓ LEAD</span>
            <p>Khi có người gửi form trên trang chủ, đăng ký sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Gửi gần nhất</th>
                <th>Số lần</th>
                <th>Tên</th>
                <th>Liên hệ</th>
                <th>Công việc</th>
                <th>Nhu cầu</th>
                <th>Nguồn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id}>
                  <td>{formatDate(lead.lastSubmittedAt)}</td>
                  <td>{lead.submissionCount}</td>
                  <td><strong>{lead.name}</strong></td>
                  <td><a href={lead.contact.includes("@") ? `mailto:${lead.contact}` : `tel:${lead.contact}`}>{lead.contact}</a></td>
                  <td>{lead.role}</td>
                  <td><span className={`admin-stage ${lead.stage}`}>{isKnownStage(lead.stage) ? stageLabels[lead.stage] : lead.stage}</span></td>
                  <td>{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <aside className="admin-privacy-note">
        <strong>Nguyên tắc xử lý</strong>
        <p>Chỉ dùng thông tin để phản hồi đúng nhu cầu đã đăng ký. Không đưa danh sách lead vào prompt AI, analytics hoặc tài liệu đào tạo.</p>
      </aside>
    </main>
  );
}
