import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "../../../db";
import { orders, products, users } from "../../../db/schema";
import { requireAdminUser } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await requireAdminUser("/admin/orders");
  if (!admin) notFound();
  const rows = await getDb().select({ id: orders.id, status: orders.status, amount: orders.amount, currency: orders.currency, providerReference: orders.providerReference, createdAt: orders.createdAt, userName: users.displayName, productTitle: products.title }).from(orders).innerJoin(users, eq(orders.userId, users.id)).innerJoin(products, eq(orders.productId, products.id)).orderBy(desc(orders.createdAt)).limit(250);
  return <main className="admin-submissions"><Link className="back-link" href="/admin">← Quản trị</Link><p className="route-kicker">ĐƠN HÀNG</p><h1>Nhật ký đơn ALIPROMPT</h1><p>Trang này chỉ đọc. Trạng thái “paid”, refund hoặc cancel không được sửa trong UI; chúng phải đến từ sự kiện provider đã xác thực và audit tương ứng.</p>{rows.length ? <div className="admin-orders-wrap"><table className="admin-orders"><thead><tr><th>Thời điểm</th><th>Sản phẩm</th><th>Thành viên</th><th>Giá</th><th>Trạng thái</th><th>Provider ref</th></tr></thead><tbody>{rows.map((order) => <tr key={order.id}><td>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.createdAt))}</td><td>{order.productTitle}</td><td>{order.userName}</td><td>{new Intl.NumberFormat("vi-VN").format(order.amount)} {order.currency}</td><td><span className={`order-status ${order.status}`}>{order.status}</span></td><td><code>{order.providerReference ?? "—"}</code></td></tr>)}</tbody></table></div> : <div className="catalog-empty"><p>Chưa có đơn hàng.</p></div>}</main>;
}
