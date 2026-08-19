"use client";

import { useState, type FormEvent } from "react";

export default function AuthForm({ mode, returnTo }: { mode: "login" | "register"; returnTo: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true); setMessage("");
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: form.get("displayName"), email: form.get("email"), password: form.get("password") }),
    }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) as { error?: string } : {};
    if (!response?.ok) { setMessage(body.error ?? "Không thể hoàn tất yêu cầu. Vui lòng thử lại."); setPending(false); return; }
    window.location.assign(returnTo);
  }

  return <form className="auth-form" onSubmit={submit} noValidate>
    {isRegister ? <label>Họ tên<input name="displayName" autoComplete="name" minLength={2} maxLength={120} required /></label> : null}
    <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <label>Mật khẩu<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 12 : 1} maxLength={128} required /><span>{isRegister ? "Tối thiểu 12 ký tự." : ""}</span></label>
    <button type="submit" disabled={pending}>{pending ? "Đang xử lý…" : isRegister ? "Tạo tài khoản" : "Đăng nhập"}</button>
    <p className="auth-message" aria-live="polite">{message}</p>
  </form>;
}
