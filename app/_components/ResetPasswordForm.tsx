"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setMessage("");
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, password: form.get("password") }) }).catch(() => null);
    const body = await response?.json().catch(() => null); setPending(false);
    if (!response?.ok) { setMessage(body?.error ?? "Không thể đổi mật khẩu. Hãy thử lại."); return; }
    setComplete(true); setMessage("Mật khẩu đã được đổi. Các phiên đăng nhập cũ đã bị kết thúc.");
  }
  if (complete) return <p className="auth-message auth-message-neutral">{message} <Link href="/login">Đăng nhập</Link></p>;
  return <form className="auth-form" onSubmit={submit} noValidate><label>Mật khẩu mới<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><span>Tối thiểu 12 ký tự.</span></label><button type="submit" disabled={pending}>{pending ? "Đang đổi mật khẩu…" : "Đổi mật khẩu"}</button><p className="auth-message" aria-live="polite">{message}</p></form>;
}
