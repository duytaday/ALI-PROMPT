import Link from "next/link";
import { desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { articles } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const admin = await requireAdminUser("/admin/articles");
  if (!admin) notFound();
  const items = await getDb().select({ id: articles.id, title: articles.title, slug: articles.slug, status: articles.status, publishedAt: articles.publishedAt }).from(articles).orderBy(desc(articles.createdAt)).limit(200);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">BÀI VIẾT ALIPROMPT</p><h1>Soạn và xuất bản bài viết</h1><p>Bài viết nháp không xuất hiện ở public blog. Khi chọn xuất bản, thời điểm xuất bản và audit event được lưu ở server.</p><form className="article-form" action="/api/admin/articles" method="post"><label>Tiêu đề<input name="title" minLength={8} maxLength={180} required /></label><label>Tóm tắt<input name="excerpt" minLength={24} maxLength={500} required /></label><label>Nội dung<textarea name="body" minLength={80} maxLength={30000} required /></label><label>Trạng thái<select name="status" defaultValue="draft"><option value="draft">Nháp</option><option value="published">Xuất bản ngay</option></select></label><button type="submit">Lưu bài viết</button></form><section><h2>Bài viết gần đây</h2>{items.length ? <ul className="admin-product-list">{items.map((article) => <li key={article.id}><strong>{article.title}</strong><span>{article.status}{article.publishedAt ? ` · ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(article.publishedAt))}` : ""}</span><small>/blog/{article.slug}</small></li>)}</ul> : <div className="catalog-empty"><p>Chưa có bài viết.</p></div>}</section></main>;
}
