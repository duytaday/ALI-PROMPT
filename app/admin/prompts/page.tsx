import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { categories, prompts } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPromptsPage() {
  const admin = await requireAdminUser("/admin/prompts");
  if (!admin) notFound();
  const [topics, recentPrompts] = await Promise.all([
    getDb().select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder).limit(100),
    getDb().select({ id: prompts.id, title: prompts.title, slug: prompts.slug, accessKind: prompts.accessKind, sourceKind: prompts.sourceKind, moderationStatus: prompts.moderationStatus }).from(prompts).orderBy(desc(prompts.createdAt)).limit(100),
  ]);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">THƯ VIỆN ALIPROMPT</p><h1>Tạo prompt gốc</h1><p>Prompt tạo ở đây thuộc ALIPROMPT, được xuất bản miễn phí trước. Muốn bán prompt, tạo Product trong workflow riêng; contributor submission không đi qua đường này.</p><form className="article-form" action="/api/admin/prompts" method="post"><label>Tiêu đề<input name="title" minLength={8} maxLength={180} required /></label><label>Tóm tắt<input name="summary" minLength={24} maxLength={500} required /></label><label>Chủ đề<select name="categoryId" required defaultValue=""><option value="" disabled>Chọn chủ đề</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label><label>Prompt<textarea name="body" minLength={80} maxLength={12000} required /></label><button type="submit">Xuất bản prompt miễn phí</button></form><section><h2>Prompt gần đây</h2>{recentPrompts.length ? <ul className="admin-product-list">{recentPrompts.map((prompt) => <li key={prompt.id}><strong>{prompt.title}</strong><span>{prompt.sourceKind} · {prompt.moderationStatus} · {prompt.accessKind}</span><small>/prompts/{prompt.slug}</small></li>)}</ul> : <div className="catalog-empty"><p>Chưa có prompt.</p></div>}</section></main>;
}
