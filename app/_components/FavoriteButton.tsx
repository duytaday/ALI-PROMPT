"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMessages, type Locale } from "../../lib/i18n";

export default function FavoriteButton({ promptId, promptSlug, signedIn, initialSaved = false, locale = "vi" }: { promptId: string; promptSlug: string; signedIn: boolean; initialSaved?: boolean; locale?: Locale }) {
  const copy = getMessages(locale).catalog;
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState("");
  const [showGate, setShowGate] = useState(false);
  const savedRef = useRef(initialSaved);
  const requestRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showGate) return;
    gateRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setShowGate(false); requestAnimationFrame(() => triggerRef.current?.focus()); return; }
      if (event.key !== "Tab" || !gateRef.current) return;
      const focusable = Array.from(gateRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showGate]);

  function closeGate() { setShowGate(false); requestAnimationFrame(() => triggerRef.current?.focus()); }
  async function toggle() {
    if (!signedIn) { setShowGate(true); return; }
    const desired = !savedRef.current;
    const requestId = ++requestRef.current;
    savedRef.current = desired;
    setSaved(desired);
    setMessage("");
    const response = await fetch(`/api/favorites/${promptId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ favorited: desired }),
    }).catch(() => null);
    if (!response?.ok) {
      if (requestId === requestRef.current) { savedRef.current = !desired; setSaved(!desired); setMessage(copy.favoriteError); }
      return;
    }
    const result = await response.json().catch(() => ({ saved: desired }));
    if (requestId !== requestRef.current) return;
    const persisted = typeof result.saved === "boolean" ? result.saved : desired;
    savedRef.current = persisted;
    setSaved(persisted);
    setMessage(persisted ? copy.favoriteSaved : copy.favoriteRemoved);
  }

  return <div className="favorite-control"><button ref={triggerRef} type="button" aria-pressed={saved} aria-haspopup={signedIn ? undefined : "dialog"} aria-expanded={signedIn ? undefined : showGate} onClick={toggle}>{saved ? copy.saved : copy.save}</button><p className="favorite-feedback" role="status" aria-live="polite">{message}</p>
    {showGate ? <div ref={gateRef} className="auth-gate" role="dialog" aria-modal="true" aria-label={copy.signInToSave}><strong>{copy.signInToSave}</strong><p>{copy.signInToSaveBody}</p><div><Link href={`/login?return_to=${encodeURIComponent(`/prompts/${promptSlug}`)}`}>{locale === "en" ? "Sign in" : "Đăng nhập"}</Link><Link href={`/register?return_to=${encodeURIComponent(`/prompts/${promptSlug}`)}`}>{locale === "en" ? "Create account" : "Tạo tài khoản"}</Link><button type="button" onClick={closeGate}>{locale === "en" ? "Close" : "Đóng"}</button></div></div> : null}
  </div>;
}
