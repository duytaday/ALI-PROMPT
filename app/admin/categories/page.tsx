import Link from "next/link";
import { asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { categories } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const admin = await requireAdminUser("/admin/categories");
  if (!admin) notFound();
  const items = await getDb().select({ id: categories.id, name: categories.name, slug: categories.slug, description: categories.description, sortOrder: categories.sortOrder, isActive: categories.isActive }).from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)).limit(200);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">CHỦ ĐỀ CATALOG</p><h1>Tạo chủ đề ALIPROMPT</h1><p>Chủ đề active xuất hiện trong search/filter và chỉ áp dụng cho nội dung ALIPROMPT. Dùng mô tả gốc, không sao chép taxonomy hoặc copy của trang tham chiếu.</p><form className="product-form" action="/api/admin/categories" method="post"><label>Tên chủ đề<input name="name" minLength={2} maxLength={120} required /></label><label>Mô tả (không bắt buộc)<textarea name="description" maxLength={280} /></label><label>Thứ tự<input name="sortOrder" type="number" min="0" max="10000" defaultValue="100" required /></label><label><input name="isActive" type="checkbox" defaultChecked /> Hiển thị ngay trong catalog</label><button type="submit">Tạo chủ đề</button></form><section><h2>Chủ đề hiện có</h2><ul className="admin-product-list">{items.map((item) => <li key={item.id}><strong>{item.name}</strong><span>{item.isActive ? "active" : "draft"} · thứ tự {item.sortOrder}</span><small>{item.slug}{item.description ? ` · ${item.description}` : ""}</small></li>)}</ul></section></main>;
}
