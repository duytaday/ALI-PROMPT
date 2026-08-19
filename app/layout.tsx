import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { isLocale, type Locale } from "../lib/i18n";
import "./globals.css";

function copyFor(locale: Locale) {
  return locale === "en"
    ? { title: "ALIPROMPT — Make AI work with context", description: "Prompt resources, practical learning, and a responsible AI workflow for real work." }
    : { title: "ALIPROMPT — Prompt cho công việc thật", description: "Khám phá prompt, tài nguyên và lộ trình dùng AI có kiểm soát." };
}

async function requestLocale() {
  const value = (await headers()).get("x-aliprompt-locale");
  return isLocale(value) ? value : "vi";
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const locale = await requestLocale();
  const path = requestHeaders.get("x-aliprompt-public-path") ?? "/";
  const suffix = path === "/" ? "" : path;
  const copy = copyFor(locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: { vi: `/vi${suffix}`, en: `/en${suffix}`, "x-default": `/vi${suffix}` },
    },
    openGraph: { title: copy.title, description: copy.description, locale: locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaff" },
    { media: "(prefers-color-scheme: dark)", color: "#15101f" },
  ],
  colorScheme: "light dark",
};

const themeBootstrap = `(()=>{try{const d=document.documentElement;const p=localStorage.getItem('aliprompt-theme-preference');const pref=p==='light'||p==='dark'||p==='system'?p:'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;const theme=pref==='system'?(dark?'dark':'light'):pref;d.dataset.theme=theme;d.dataset.themePreference=pref;d.style.colorScheme=theme}catch{}})()`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await requestLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>{children}</body>
    </html>
  );
}
