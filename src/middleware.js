import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getAuthSecret } from "@/shared/lib/auth";

const locales = ["en", "ru", "fa"];
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

const ADMIN_BASE_SEGMENT = "admin";
const MOBILE_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function extractLocale(pathname) {
  const match = pathname.match(/^\/(en|ru|fa)(?=\/|$)/);
  return match ? match[1] : defaultLocale;
}

function stripLocale(pathname) {
  const locale = extractLocale(pathname);
  const localizedPrefix = `/${locale}`;
  if (!pathname.startsWith(localizedPrefix)) return pathname;
  const stripped = pathname.slice(localizedPrefix.length);
  return stripped || "/";
}

function localizePath(locale, path) {
  const normalizedPath = path === "/" ? "" : path;
  return `/${locale}${normalizedPath}`;
}

function isProtectedPath(pathname) {
  const protectedPaths = ["/orders", "/cart", "/wishlist"];
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isAdminPath(pathname) {
  return pathname === `/${ADMIN_BASE_SEGMENT}` || pathname.startsWith(`/${ADMIN_BASE_SEGMENT}/`);
}

function isDesktopOnlyBypass(pathname) {
  return pathname === "/admin/desktop-only";
}

export default async function middleware(req) {
  const locale = extractLocale(req.nextUrl.pathname);
  const pathname = stripLocale(req.nextUrl.pathname);
  const isAdminRoute = isAdminPath(pathname);
  const isMobileDevice = MOBILE_PATTERN.test(req.headers.get("user-agent") || "");
  const secret = getAuthSecret();
  const token = secret
    ? await getToken({ req, secret })
    : null;

  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL(localizePath(locale, "/auth"), req.url);
      loginUrl.searchParams.set("redirectTo", localizePath(locale, pathname));
      return NextResponse.redirect(loginUrl);
    }

    if (token.deletedAt || token.isBlocked || token.role !== "admin") {
      return NextResponse.redirect(new URL(localizePath(locale, "/"), req.url));
    }

    if (isMobileDevice && !isDesktopOnlyBypass(pathname)) {
      return NextResponse.redirect(new URL(localizePath(locale, "/admin/desktop-only"), req.url));
    }
  }

  if (!isAdminRoute && isProtectedPath(pathname) && !token) {
    const loginUrl = new URL(localizePath(locale, "/auth"), req.url);
    loginUrl.searchParams.set("redirectTo", localizePath(locale, pathname));
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|ru|fa)/:path*"],
};
