import Link from "next/link";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { hasDatabaseUrl } from "../../db";
import { getMessages, isLocale } from "../../lib/i18n";
import { getCurrentUser } from "../../lib/auth";
import FloatingUtilities from "./FloatingUtilities";
import LocaleSwitcher from "./LocaleSwitcher";
import MarketplaceNavigation from "./MarketplaceNavigation";
import ThemeToggle from "./ThemeToggle";

export default async function MarketplaceShell({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-aliprompt-locale");
  const locale = isLocale(headerLocale) ? headerLocale : "vi";
  const copy = getMessages(locale);
  const currentPath = requestHeaders.get("x-aliprompt-public-path") ?? "/";
  const user = process.env.NODE_ENV === "development" && !hasDatabaseUrl() ? null : await getCurrentUser();
  return (
    <div className="marketplace-page">
      <a className="skip-link" href="#main-content">{copy.navigation.skipToContent}</a>
      <header className="marketplace-header">
        <Link className="marketplace-brand" href="/" aria-label="ALIPROMPT home">
          <span aria-hidden="true">A</span><strong>ALIPROMPT</strong>
        </Link>
        <MarketplaceNavigation locale={locale} currentPath={currentPath} signedIn={Boolean(user)} accountLabel={user?.displayName} />
        <div className="marketplace-account"><LocaleSwitcher locale={locale} /><ThemeToggle locale={locale} />{user ? <><Link href="/library/favorites">{locale === "en" ? "Saved prompts" : "Prompt đã lưu"}</Link><Link href="/library" aria-label={copy.navigation.library}>{user.displayName}</Link><form action="/api/auth/logout" method="post"><button type="submit">{copy.navigation.signOut}</button></form></> : <><Link href="/login">{copy.navigation.signIn}</Link><Link className="marketplace-signup" href="/register">{copy.navigation.signUp}</Link></>}</div>
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <FloatingUtilities locale={locale} />
      <footer className="marketplace-footer">
        <strong>ALIPROMPT</strong>
        <p>{copy.footer.description}</p>
        <div><Link href="/blog">{copy.footer.articles}</Link><Link href="/library">{copy.footer.library}</Link><Link href="/submit">{copy.footer.submit}</Link></div>
      </footer>
    </div>
  );
}
