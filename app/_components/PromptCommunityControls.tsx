"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { promptId: string; promptSlug: string; signedIn: boolean; initialReaction?: -1 | 1 | null; initialLikes: number; initialDislikes: number };

export default function PromptCommunityControls({ promptId, promptSlug, signedIn, initialReaction = null, initialLikes, initialDislikes }: Props) {
  const [reaction, setReaction] = useState<-1 | 1 | null>(initialReaction);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [reportOpen, setReportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const returnTo = encodeURIComponent(`/prompts/${promptSlug}`);
  async function react(value: -1 | 1) {
    if (!signedIn) { setMessage("Đăng nhập để đánh giá prompt."); return; }
    const response = await fetch(`/api/prompts/${promptId}/reaction`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ value }) }).catch(() => null);
    const data = await response?.json().catch(() => null);
    if (!response?.ok || !data) { setMessage(data?.error ?? "Không thể cập nhật đánh giá. Hãy thử lại."); return; }
    setReaction(value); setLikes(data.likeCount); setDislikes(data.dislikeCount); setMessage("Đã ghi nhận đánh giá của bạn.");
  }
  async function report(form: FormData) {
    const response = await fetch(`/api/prompts/${promptId}/report`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason: form.get("reason"), details: form.get("details") }) }).catch(() => null);
    const data = await response?.json().catch(() => null);
    if (!response?.ok) { setMessage(data?.error ?? "Không thể gửi báo cáo. Hãy thử lại."); return; }
    setReportOpen(false); setMessage("Cảm ơn bạn. Báo cáo đã được gửi để đội ngũ xem xét.");
  }
  if (!signedIn) return <div className="prompt-community"><p><Link href={`/login?return_to=${returnTo}`}>Đăng nhập</Link> để đánh giá hoặc báo cáo prompt.</p></div>;
  return <section className="prompt-community" aria-label="Đánh giá và báo cáo"><div className="reaction-buttons"><button type="button" aria-pressed={reaction === 1} onClick={() => react(1)}>Hữu ích ({likes})</button><button type="button" aria-pressed={reaction === -1} onClick={() => react(-1)}>Chưa hữu ích ({dislikes})</button><button type="button" onClick={() => setReportOpen(!reportOpen)}>Báo cáo</button></div>
    {reportOpen ? <form className="report-form" action={report}><label>Lý do<select name="reason" defaultValue=""><option value="" disabled>Chọn lý do</option><option value="copyright">Quyền tác giả</option><option value="unsafe">Không an toàn</option><option value="spam">Spam</option><option value="misleading">Gây hiểu lầm</option><option value="other">Khác</option></select></label><label>Ghi chú (không bắt buộc)<textarea name="details" maxLength={1000} /></label><div><button type="submit">Gửi báo cáo</button><button type="button" onClick={() => setReportOpen(false)}>Hủy</button></div></form> : null}<p className="sr-only" aria-live="polite">{message}</p></section>;
}
