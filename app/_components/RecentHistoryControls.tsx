"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "../../lib/i18n";

export default function RecentHistoryControls({ locale, eventId }: { locale: Locale; eventId?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const isEnglish = locale === "en";
  async function remove() {
    const target = eventId ? `/api/library/recent/${eventId}` : "/api/library/recent";
    const prompt = eventId ? (isEnglish ? "Remove this history entry?" : "Xóa mục lịch sử này?") : (isEnglish ? "Clear all recent history?" : "Xóa toàn bộ lịch sử dùng gần đây?");
    if (!window.confirm(prompt)) return;
    const response = await fetch(target, { method: "DELETE" });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setStatus(result?.error ?? (isEnglish ? "Could not update history." : "Không thể cập nhật lịch sử."));
    setStatus(isEnglish ? "History updated." : "Đã cập nhật lịch sử."); router.refresh();
  }
  return <span className="recent-history-control"><button type="button" onClick={remove}>{eventId ? (isEnglish ? "Remove" : "Xóa") : (isEnglish ? "Clear history" : "Xóa lịch sử")}</button><span role="status">{status}</span></span>;
}
