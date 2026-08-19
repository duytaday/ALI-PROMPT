import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MarketplaceShell from "../../_components/MarketplaceShell";
import CheckoutStartButton from "../../_components/CheckoutStartButton";
import { getCurrentUser } from "../../../lib/auth";
import { getActiveProductBySlug, getOrderForUser, hasActiveEntitlement } from "../../../lib/commerce";
import { paymentProviderIsConfigured } from "../../../lib/payment";

export const dynamic = "force-dynamic";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ productSlug: string }>; searchParams: Promise<{ order_id?: string }> }) {
  const user = await getCurrentUser();
  const { productSlug } = await params;
  if (!user) redirect(`/login?return_to=${encodeURIComponent(`/checkout/${productSlug}`)}`);
  const product = await getActiveProductBySlug(productSlug);
  if (!product) notFound();
  const [{ order_id: orderId }, entitled] = await Promise.all([searchParams, hasActiveEntitlement(user.id, product.id)]);
  const order = await getOrderForUser(orderId, user.id);
  const checkoutAvailable = paymentProviderIsConfigured();
  return <MarketplaceShell><main className="checkout-page"><Link className="back-link" href="/">← Quay lại thư viện</Link><p className="route-kicker">THANH TOÁN AN TOÀN</p><h1>{product.title}</h1><p>{product.description}</p><section className="checkout-summary"><dl><div><dt>Người bán</dt><dd>ALIPROMPT</dd></div><div><dt>Giá</dt><dd>{product.currency === "VND" ? money.format(product.priceAmount) : `${product.priceAmount} ${product.currency}`}</dd></div><div><dt>Quyền nhận được</dt><dd>Truy cập trong thư viện cá nhân sau khi thanh toán được xác thực.</dd></div></dl>
    {entitled ? <div className="checkout-success"><h2>Bạn đã có quyền truy cập</h2>{product.contentPromptSlug ? <Link href={`/prompts/${product.contentPromptSlug}`}>Mở tài nguyên</Link> : <Link href="/library">Mở thư viện</Link>}</div> : order ? <div className="checkout-pending"><h2>Đơn đang chờ xác thực</h2><p>Mã đơn: <code>{order.id}</code></p><p>Quyền truy cập chỉ được cấp sau khi máy chủ nhận được sự kiện thanh toán đã xác thực. Không có trạng thái URL hoặc trình duyệt nào tự cấp quyền.</p></div> : checkoutAvailable ? <><p className="checkout-test-notice">Môi trường này đang dùng adapter kiểm thử có chữ ký HMAC. Đây không phải cổng thu tiền Production.</p><CheckoutStartButton productSlug={product.slug} /></> : <div className="checkout-unavailable"><h2>Thanh toán chưa khả dụng</h2><p>Cổng thanh toán Production chưa được cấu hình cho môi trường này. ALIPROMPT không tạo đơn hoặc cấp quyền dựa trên xác nhận từ trình duyệt.</p></div>}</section></main></MarketplaceShell>;
}
