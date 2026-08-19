"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-state">
      <p className="route-kicker">KHÔNG THỂ TẢI NỘI DUNG</p>
      <h1>Đã có sự cố tạm thời.</h1>
      <p>Dữ liệu và quyền truy cập của bạn không bị thay đổi. Hãy thử lại; nếu lỗi tiếp diễn, đội ngũ ALIPROMPT cần kiểm tra hệ thống.</p>
      <button type="button" onClick={reset}>Thử tải lại</button>
      <Link href="/">Về thư viện</Link>
    </main>
  );
}
