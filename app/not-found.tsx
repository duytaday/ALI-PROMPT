import Link from "next/link";

export default function NotFound() {
  return <main className="system-state"><p className="route-kicker">404</p><h1>Không tìm thấy nội dung này.</h1><p>Prompt, bài viết hoặc trang bạn mở có thể đã được gỡ, chưa xuất bản hoặc địa chỉ không còn hợp lệ.</p><Link href="/">Khám phá thư viện ALIPROMPT</Link></main>;
}
