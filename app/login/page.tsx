import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import AuthForm from "../_components/AuthForm";
import { safeReturnTo } from "../../lib/safe-return-to";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const { return_to } = await searchParams;
  return <MarketplaceShell><main className="auth-page"><p className="route-kicker">TÀI KHOẢN ALIPROMPT</p><h1>Đăng nhập để lưu tiến trình làm việc với AI.</h1><AuthForm mode="login" returnTo={safeReturnTo(return_to)} /><p>Chưa có tài khoản? <Link href={`/register?return_to=${encodeURIComponent(safeReturnTo(return_to))}`}>Tạo tài khoản</Link></p><p><Link href="/forgot-password">Quên mật khẩu?</Link></p></main></MarketplaceShell>;
}
