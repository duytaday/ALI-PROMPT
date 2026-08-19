"use client";

import { useState } from "react";

export default function PromptCopyButton({ text }: { text: string }) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setMessage("Đã sao chép prompt vào clipboard.");
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
      setMessage("Không thể sao chép. Hãy chọn và sao chép thủ công.");
    }
  }
  return <div className="prompt-copy-control"><button className="prompt-copy" type="button" onClick={copy} aria-describedby="prompt-copy-feedback">{copied ? "Đã sao chép" : "Sao chép prompt"}</button><p id="prompt-copy-feedback" className="prompt-copy-feedback" role="status" aria-live="polite">{message}</p></div>;
}
