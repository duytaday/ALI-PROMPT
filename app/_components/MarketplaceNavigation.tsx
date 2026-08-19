"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../lib/i18n";
import { getMessages } from "../../lib/i18n";
import ThemeToggle from "./ThemeToggle";

export default function MarketplaceNavigation({ locale, currentPath, signedIn, accountLabel }: { locale: Locale; currentPath: string; signedIn: boolean; accountLabel?: string }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const copy = getMessages(locale).navigation;
  const primaryLinks = [
    { href: "/", label: copy.explore },
    { href: "/#catalog-search", label: copy.topics },
    { href: "/submit", label: copy.submit },
    { href: "/leaderboard", label: copy.leaderboard },
    { href: "/blog", label: copy.blog },
  ];

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => toggleRef.current?.focus(), 0);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const accountLinks = signedIn
    ? [{ href: "/library/favorites", label: locale === "en" ? "Saved prompts" : "Prompt đã lưu" }, { href: "/library", label: accountLabel ?? copy.library }]
    : [{ href: "/login", label: copy.signIn }, { href: "/register", label: copy.signUp }];

  return <>
    <nav className="marketplace-nav" aria-label={copy.primaryNavigation}>
      {primaryLinks.map((link) => <Link key={link.href} href={link.href} aria-current={link.href === "/" ? currentPath === "/" ? "page" : undefined : currentPath === link.href ? "page" : undefined}>{link.label}</Link>)}
    </nav>
    <button ref={toggleRef} className="mobile-menu-toggle" type="button" aria-label={open ? copy.closeMenu : copy.openMenu} aria-expanded={open} aria-controls="marketplace-mobile-menu" onClick={() => setOpen((value) => !value)}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
    {open ? <div className="mobile-menu-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <aside ref={drawerRef} id="marketplace-mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="marketplace-mobile-menu-title">
        <div className="mobile-menu-heading"><span id="marketplace-mobile-menu-title">ALIPROMPT</span><button type="button" onClick={() => setOpen(false)}>{copy.close}</button></div>
        <nav aria-label={copy.primaryNavigation} className="mobile-menu-links">
          {primaryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </nav>
        <div className="mobile-menu-account">
          <span>{copy.account}</span>
          {accountLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/library" onClick={() => setOpen(false)}>{copy.library}</Link>
        </div>
        <div className="mobile-menu-theme"><ThemeToggle locale={locale} /></div>
      </aside>
    </div> : null}
  </>;
}
