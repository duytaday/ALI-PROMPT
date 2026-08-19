"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutStartButton({ productSlug }: { productSlug: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function start() {
    setPending(true); setMessage("");
    const response = await fetch(`/api/checkout/${productSlug}`, { method: "POST" }).catch(() => null);
    const data = await response?.json().catch(() => null);
    setPending(false);
    if (!response?.ok || !data) { setMessage(data?.error ?? "Không thể bắt đầu thanh toán. Hãy thử lại."); return; }
    if (data.alreadyEntitled) { router.replace(data.libraryUrl); return; }
    router.replace(`/checkout/${productSlug}?order_id=${encodeURIComponent(data.orderId)}`);
  }
  return <div className="checkout-start"><button type="button" onClick={start} disabled={pending}>{pending ? "Đang tạo đơn…" : "Tạo đơn thanh toán"}</button><p role="status" aria-live="polite">{message}</p></div>;
}
