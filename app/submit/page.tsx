import MarketplaceShell from "../_components/MarketplaceShell";
import SubmitPromptForm from "../_components/SubmitPromptForm";
import { hasDatabaseUrl } from "../../db";
import { getCurrentUser } from "../../lib/auth";
import { getActiveCategories } from "../../lib/catalog";
import { createSubmissionCaptcha } from "../../lib/submission-captcha";

export const dynamic = "force-dynamic";

const localCategories = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Làm rõ brief" },
  { id: "00000000-0000-4000-8000-000000000002", name: "Nội dung & chiến dịch" },
  { id: "00000000-0000-4000-8000-000000000003", name: "Vận hành & SOP" },
  { id: "00000000-0000-4000-8000-000000000004", name: "Học & nghiên cứu" },
];

export default async function SubmitPage() {
  const user = await getCurrentUser();
  const categories = process.env.NODE_ENV === "development" && !hasDatabaseUrl()
    ? localCategories
    : await getActiveCategories();
  return <MarketplaceShell><main className="submit-page"><p className="route-kicker">ĐÓNG GÓP CỘNG ĐỒNG</p><h1>Chia sẻ prompt và ảnh mẫu.</h1><p>Không cần tạo tài khoản. Mọi prompt đều vào hàng chờ kiểm duyệt, chưa được công khai hay bán trước khi được duyệt.</p><SubmitPromptForm categories={categories} captcha={createSubmissionCaptcha()} defaultAuthorName={user?.displayName} /></main></MarketplaceShell>;
}
