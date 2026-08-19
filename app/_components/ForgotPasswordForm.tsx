"use client";

import { useState, type FormEvent } from "react";

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setMessage("");
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) }).catch(() => null);
    const body = await response?.json().catch(() => null);
    setPending(false); setMessage(body?.message ?? body?.error ?? "Không thể gửi yêu cầu. Hãy thử lại.");
  }
  return <form className="auth-form" onSubmit={submit} noValidate><label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><button type="submit" disabled={pending}>{pending ? "Đang xử lý…" : "Gửi yêu cầu khôi phục"}</button><p className="auth-message auth-message-neutral" aria-live="polite">{message}</p></form>;
}
