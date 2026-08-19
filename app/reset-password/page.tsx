import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const validToken = typeof token === "string" && token.length >= 32 && token.length <= 128;
  return <MarketplaceShell><main className="auth-page"><p className="route-kicker">MẬT KHẨU MỚI</p><h1>Đặt lại mật khẩu.</h1>{validToken ? <ResetPasswordForm token={token} /> : <><p>Liên kết khôi phục không hợp lệ hoặc thiếu token.</p><Link className="hero-link" href="/forgot-password">Yêu cầu liên kết mới</Link></>}</main></MarketplaceShell>;
}
