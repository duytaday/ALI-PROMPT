import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import AuthForm from "../_components/AuthForm";
import { safeReturnTo } from "../../lib/safe-return-to";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const { return_to } = await searchParams;
  return <MarketplaceShell><main className="auth-page"><p className="route-kicker">BẮT ĐẦU</p><h1>Tạo không gian riêng cho các prompt bạn đã kiểm chứng.</h1><AuthForm mode="register" returnTo={safeReturnTo(return_to)} /><p>Đã có tài khoản? <Link href={`/login?return_to=${encodeURIComponent(safeReturnTo(return_to))}`}>Đăng nhập</Link></p></main></MarketplaceShell>;
}
