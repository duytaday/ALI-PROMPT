"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMessages, type Locale } from "../../lib/i18n";

export default function FloatingUtilities({ locale = "vi" }: { locale?: Locale }) {
  const [showTop, setShowTop] = useState(false);
  const copy = getMessages(locale).utilities;
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 420);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <aside className="floating-utilities" aria-label={copy.library}><Link href="/library">{copy.library}</Link><Link href="/submit">{copy.submit}</Link>{showTop ? <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{copy.toTop}</button> : null}</aside>;
}
