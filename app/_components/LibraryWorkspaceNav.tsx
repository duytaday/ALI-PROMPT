import Link from "next/link";
import type { Locale } from "../../lib/i18n";

export default function LibraryWorkspaceNav({ locale, active }: { locale: Locale; active: "overview" | "saved" | "collections" | "recent" }) {
  const labels = locale === "en"
    ? { overview: "Overview", saved: "Saved", collections: "Collections", recent: "Recently used" }
    : { overview: "Tổng quan", saved: "Đã lưu", collections: "Bộ sưu tập", recent: "Dùng gần đây" };
  const items = [
    ["overview", "/library"], ["saved", "/library/favorites"], ["collections", "/library/collections"], ["recent", "/library/recent"],
  ] as const;
  return <nav className="library-workspace-nav" aria-label={locale === "en" ? "Library sections" : "Khu vực thư viện"}>{items.map(([key, href]) => <Link key={key} href={href} aria-current={active === key ? "page" : undefined}>{labels[key]}</Link>)}</nav>;
}
