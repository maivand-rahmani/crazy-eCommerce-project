import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru", "fa"],
  defaultLocale: "en"
});

export default withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const protectedPaths = ['/orders', '/cart', '/wishlist'];
        const isProtectedPath = protectedPaths.some(p => path === p || path.startsWith(p + '/'));
        
        if (isProtectedPath) {
          return !!token;
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/", "/(en|ru)/:path*"]
};
