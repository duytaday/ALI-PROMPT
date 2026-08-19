import Link from "next/link";
import { and, desc, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { entitlements, products, users } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminEntitlementsPage() {
  const admin = await requireAdminUser("/admin/entitlements");
  if (!admin) notFound();
  const [activeGrants, activeProducts] = await Promise.all([
    getDb().select({ id: entitlements.id, grantedAt: entitlements.createdAt, source: entitlements.grantSource, userName: users.displayName, productTitle: products.title }).from(entitlements).innerJoin(users, eq(entitlements.userId, users.id)).innerJoin(products, eq(entitlements.productId, products.id)).where(isNull(entitlements.revokedAt)).orderBy(desc(entitlements.createdAt)).limit(200),
    getDb().select({ id: products.id, title: products.title }).from(products).where(and(eq(products.status, "active"), eq(products.sellerKind, "aliprompt"))).orderBy(desc(products.createdAt)).limit(100),
  ]);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">QUYỀN TRUY CẬP</p><h1>Cấp quyền thủ công có kiểm soát</h1><p>Chỉ cấp quyền khi có lý do vận hành hợp lệ. Việc này không thay thế hay thay đổi lịch sử thanh toán; mọi grant/revoke đều được audit.</p><form className="product-form" action="/api/admin/entitlements" method="post"><label>Email thành viên<input name="email" type="email" maxLength={254} required /></label><label>Sản phẩm<select name="productId" required defaultValue=""><option value="" disabled>Chọn sản phẩm active</option>{activeProducts.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}</select></label><label>Lý do<textarea name="reason" required minLength={4} maxLength={1000} /></label><input name="action" type="hidden" value="grant" /><button type="submit">Cấp quyền</button></form><section><h2>Quyền đang hoạt động</h2>{activeGrants.length ? <ul className="admin-product-list">{activeGrants.map((grant) => <li key={grant.id}><strong>{grant.productTitle}</strong><span>{grant.userName} · {grant.source} · {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(grant.grantedAt))}</span><form className="inline-admin-form" action="/api/admin/entitlements" method="post"><label>Lý do revoke<input name="reason" minLength={4} maxLength={1000} required /></label><input name="action" type="hidden" value="revoke" /><input name="entitlementId" type="hidden" value={grant.id} /><button type="submit">Thu hồi</button></form></li>)}</ul> : <div className="catalog-empty"><p>Chưa có entitlement active.</p></div>}</section></main>;
}
