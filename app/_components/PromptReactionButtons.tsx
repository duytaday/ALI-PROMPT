"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Reaction = -1 | 1 | null;

export default function PromptReactionButtons({ promptId, promptSlug, promptTitle, signedIn, initialLikes, initialDislikes, initialReaction = null }: {
  promptId: string;
  promptSlug: string;
  promptTitle: string;
  signedIn: boolean;
  initialLikes: number;
  initialDislikes: number;
  initialReaction?: Reaction;
}) {
  const [reaction, setReaction] = useState<Reaction>(initialReaction);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const returnTo = encodeURIComponent(`/prompts/${promptSlug}`);

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    fetch(`/api/prompts/${promptId}/reaction`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ value: Reaction; likeCount: number; dislikeCount: number }> : null)
      .then((data) => {
        if (!active || !data) return;
        setReaction(data.value); setLikes(data.likeCount); setDislikes(data.dislikeCount);
      }).catch(() => undefined);
    return () => { active = false; };
  }, [promptId, signedIn]);

  async function react(value: Exclude<Reaction, null>) {
    if (!signedIn || pending) return;
    setPending(true); setMessage("");
    const next = reaction === value ? null : value;
    const response = await fetch(`/api/prompts/${promptId}/reaction`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ value: next }) }).catch(() => null);
    const data = response ? await response.json().catch(() => null) as { error?: string; value?: Reaction; likeCount?: number; dislikeCount?: number } | null : null;
    setPending(false);
    if (!response?.ok || !data || typeof data.likeCount !== "number" || typeof data.dislikeCount !== "number") { setMessage(data?.error ?? "Không thể cập nhật đánh giá. Hãy thử lại."); return; }
    setReaction(data.value ?? null); setLikes(data.likeCount); setDislikes(data.dislikeCount);
    setMessage(next === null ? "Đã bỏ đánh giá của bạn." : "Đã ghi nhận đánh giá của bạn.");
  }

  if (!signedIn) return <div className="prompt-card-reactions" aria-label={`Đánh giá ${promptTitle}`}><Link href={`/login?return_to=${returnTo}`} aria-label={`Đăng nhập để đánh giá hữu ích: ${likes}`}><ThumbUp /> <span>{likes}</span></Link><Link href={`/login?return_to=${returnTo}`} aria-label={`Đăng nhập để đánh giá chưa hữu ích: ${dislikes}`}><ThumbDown /> <span>{dislikes}</span></Link></div>;

  return <div className="prompt-card-reaction-wrap"><div className="prompt-card-reactions" aria-label={`Đánh giá ${promptTitle}`}><button type="button" aria-pressed={reaction === 1} aria-label={`Hữu ích: ${likes}`} title="Hữu ích" disabled={pending} onClick={() => react(1)}><ThumbUp /> <span>{likes}</span></button><button type="button" aria-pressed={reaction === -1} aria-label={`Chưa hữu ích: ${dislikes}`} title="Chưa hữu ích" disabled={pending} onClick={() => react(-1)}><ThumbDown /> <span>{dislikes}</span></button></div><p className="sr-only" aria-live="polite">{message}</p></div>;
}

function ThumbUp() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5 10.5v9H5a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 5 10.5h2.5ZM7.5 19.5h9.2a2 2 0 0 0 1.9-1.4l1.7-5.5A2 2 0 0 0 18.4 10h-4.9l.8-3.5A2.2 2.2 0 0 0 12.1 4L7.5 10.5Z" /></svg>;
}

function ThumbDown() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5 13.5v-9H5A1.5 1.5 0 0 0 3.5 6v6A1.5 1.5 0 0 0 5 13.5h2.5ZM7.5 4.5h9.2a2 2 0 0 1 1.9 1.4l1.7 5.5a2 2 0 0 1-1.9 2.6h-4.9l.8 3.5a2.2 2.2 0 0 1-2.2 2.5l-4.6-6.5Z" /></svg>;
}
