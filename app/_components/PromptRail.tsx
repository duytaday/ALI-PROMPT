"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

export default function PromptRail({ children, label }: { children: ReactNode; label: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  const updatePosition = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setPosition({ start: rail.scrollLeft <= 2, end: rail.scrollLeft >= max - 2 });
  }, []);
  useEffect(() => { updatePosition(); window.addEventListener("resize", updatePosition); return () => window.removeEventListener("resize", updatePosition); }, [updatePosition]);
  function move(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(240, Math.floor(rail.clientWidth * 0.85)), behavior: "smooth" });
  }
  return <div className="prompt-rail-wrap"><div className="prompt-rail-controls" aria-label={`Điều hướng ${label}`}><button type="button" onClick={() => move(-1)} disabled={position.start} aria-label={`Xem prompt trước trong ${label}`}>←</button><button type="button" onClick={() => move(1)} disabled={position.end} aria-label={`Xem prompt tiếp theo trong ${label}`}>→</button></div><div ref={railRef} className="prompt-rail" aria-label={label} onScroll={updatePosition}>{children}</div></div>;
}
