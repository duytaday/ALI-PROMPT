"use client";

import { useState, type FormEvent } from "react";

export default function SubmitPromptForm({ categories, captcha, defaultAuthorName }: { categories: Array<{ id: string; name: string }>; captcha: { question: string; token: string }; defaultAuthorName?: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage("");
    const response = await fetch("/api/submissions", { method: "POST", body: new FormData(event.currentTarget) }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) as { error?: string } : {};
    setPending(false);
    if (!response?.ok) { setMessage(body.error ?? "Không thể gửi prompt. Hãy thử lại."); return; }
    event.currentTarget.reset(); setMessage("Đã gửi để kiểm duyệt. Prompt sẽ không công khai cho đến khi được duyệt.");
  }

  return <form className="submission-form" onSubmit={submit}>
    <label>Tên tác giả<input name="authorName" autoComplete="name" defaultValue={defaultAuthorName} minLength={2} maxLength={120} required placeholder="Khách hoặc tên của bạn" /><span>{defaultAuthorName ? "Bạn đang đăng nhập; contribution sẽ gắn với tài khoản này." : "Không cần tài khoản — tên này sẽ hiển thị nếu prompt được duyệt."}</span></label>
    <label>Danh mục<select name="categoryId" required defaultValue=""><option value="" disabled>Chọn danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <label>Tiêu đề<input name="title" minLength={8} maxLength={180} required placeholder="Ví dụ: Banner bán căn hộ cao cấp phong cách sang trọng" /></label>
    <label>Nội dung prompt<textarea name="body" minLength={80} maxLength={12_000} required placeholder="Dán prompt gốc của bạn vào đây…" /></label>
    <label>Ảnh đã thực hiện (không bắt buộc)<input name="media" type="file" accept="image/jpeg,image/png,image/webp" /><span>JPG, PNG hoặc WebP; tối đa 3MB. Ảnh được kiểm tra trước khi công khai.</span></label>
    <input name="captchaToken" type="hidden" value={captcha.token} readOnly />
    <label className="submission-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <fieldset className="submission-captcha"><legend>Xác nhận chống spam</legend><span>Bạn tạm tính: {captcha.question}</span><input name="captchaAnswer" inputMode="numeric" autoComplete="off" required placeholder="Nhập kết quả" /></fieldset>
    <p className="submission-notice">Bằng việc gửi, bạn xác nhận có quyền chia sẻ nội dung và ảnh này. Prompt cộng đồng luôn miễn phí và phải qua kiểm duyệt.</p>
    <button type="submit" disabled={pending}>{pending ? "Đang gửi…" : "Đăng chia sẻ"}</button><p aria-live="polite">{message}</p>
  </form>;
}
