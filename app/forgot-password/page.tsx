import Link from "next/link";
import MarketplaceShell from "../_components/MarketplaceShell";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";
import { isPasswordResetDeliveryConfigured } from "../../lib/email";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const deliveryConfigured = isPasswordResetDeliveryConfigured();
  return <MarketplaceShell><main className="auth-page"><p className="route-kicker">KHÔI PHỤC TÀI KHOẢN</p><h1>Khôi phục mật khẩu an toàn.</h1>{deliveryConfigured ? <><p>Nhập email. Nếu tài khoản đủ điều kiện, ALIPROMPT sẽ gửi liên kết dùng một lần và hết hạn sau 30 phút.</p><ForgotPasswordForm /></> : <p>Khôi phục qua email đang tạm thời chưa được cấu hình cho môi trường này. Không có liên kết hay mật khẩu nào được gửi khi delivery chưa sẵn sàng.</p>}<Link className="hero-link" href="/login">Quay lại đăng nhập</Link></main></MarketplaceShell>;
}
