import { NextResponse, type NextRequest } from "next/server";
import { isLocale, type Locale } from "./lib/i18n";

const localeCookie = "aliprompt-locale";

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(localeCookie)?.value;
  if (isLocale(saved)) return saved;
  const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return accepted.startsWith("en") || accepted.includes(",en") ? "en" : "vi";
}

export function proxy(request: NextRequest) {
  if (request.headers.get("x-aliprompt-locale-internal") === "1") return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  if (!isLocale(firstSegment)) {
    const locale = preferredLocale(request);
    const target = request.nextUrl.clone();
    target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(target);
  }

  const locale = firstSegment;
  const internalPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = internalPath;
  internalUrl.search = search;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-aliprompt-locale-internal", "1");
  requestHeaders.set("x-aliprompt-locale", locale);
  requestHeaders.set("x-aliprompt-public-path", internalPath);
  const response = NextResponse.rewrite(internalUrl, { request: { headers: requestHeaders } });
  response.cookies.set(localeCookie, locale, { path: "/", sameSite: "lax", maxAge: 31_536_000 });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
