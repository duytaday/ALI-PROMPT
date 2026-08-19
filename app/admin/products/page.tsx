import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { products, prompts } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await requireAdminUser("/admin/products");
  if (!admin) notFound();
  const [items, eligiblePrompts] = await Promise.all([
    getDb().select({ id: products.id, title: products.title, slug: products.slug, status: products.status, priceAmount: products.priceAmount, currency: products.currency, promptTitle: prompts.title }).from(products).leftJoin(prompts, eq(products.contentPromptId, prompts.id)).orderBy(desc(products.createdAt)).limit(200),
    getDb().select({ id: prompts.id, title: prompts.title }).from(prompts).where(and(eq(prompts.sourceKind, "aliprompt"), eq(prompts.moderationStatus, "approved"), eq(prompts.accessKind, "free"))).orderBy(desc(prompts.publishedAt)).limit(100),
  ]);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">SẢN PHẨM ALIPROMPT</p><h1>Tạo gói truy cập</h1><p>ALIPROMPT là người bán duy nhất. Việc gắn prompt sẽ chỉ chấp nhận nội dung ALIPROMPT đã duyệt; prompt cộng đồng không thể thành sản phẩm trả phí.</p><form className="product-form" action="/api/admin/products" method="post"><label>Tên sản phẩm<input name="title" minLength={8} maxLength={180} required /></label><label>Mô tả<input name="description" minLength={24} maxLength={1000} required /></label><label>Giá VND<input name="priceAmount" type="number" min="0" max="100000000" step="1000" required /></label><label>Prompt ALIPROMPT (tùy chọn)<select name="contentPromptId" defaultValue=""><option value="">Tài nguyên không phải prompt</option>{eligiblePrompts.map((prompt) => <option key={prompt.id} value={prompt.id}>{prompt.title}</option>)}</select></label><label>Trạng thái<select name="status" defaultValue="draft"><option value="draft">Nháp</option><option value="active">Bán trên site</option></select></label><input type="hidden" name="currency" value="VND" /><button type="submit">Tạo sản phẩm</button></form><section><h2>Sản phẩm gần đây</h2>{items.length ? <ul className="admin-product-list">{items.map((product) => <li key={product.id}><strong>{product.title}</strong><span>{product.status} · {new Intl.NumberFormat("vi-VN").format(product.priceAmount)} {product.currency}</span><small>{product.promptTitle ?? "Tài nguyên độc lập"} · /checkout/{product.slug}</small></li>)}</ul> : <div className="catalog-empty"><p>Chưa có sản phẩm.</p></div>}</section></main>;
}
