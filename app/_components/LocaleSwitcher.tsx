"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "../../lib/i18n";
import { getMessages } from "../../lib/i18n";

const storageKey = "aliprompt-locale";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const copy = getMessages(locale).language;

  function switchLocale(next: Locale) {
    if (next === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "vi" || segments[0] === "en") segments.shift();
    const path = `/${next}${segments.length ? `/${segments.join("/")}` : ""}`;
    const query = searchParams.toString();
    window.localStorage.setItem(storageKey, next);
    window.location.assign(`${path}${query ? `?${query}` : ""}${window.location.hash}`);
  }

  const nextLocale = locale === "vi" ? "en" : "vi";
  const label = `${copy.label}: ${copy[locale]}. ${copy[nextLocale]}`;

  return <div className="locale-switcher">
    <button type="button" aria-label={label} title={label} onClick={() => switchLocale(nextLocale)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.1 2.2 3.2 4.9 3.2 8S14.1 17.8 12 20c-2.1-2.2-3.2-4.9-3.2-8S9.9 6.2 12 4Z" /></svg>
    </button>
  </div>;
}
