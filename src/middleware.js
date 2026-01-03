import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createRouteMatcher } from '@clerk/nextjs/server';

const SignRouteMatcher = createRouteMatcher(['/wishlist(.*)', '/cart(.*)']);
const adminRouteMatcher = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 🔒 Защищённые пользовательские маршруты
  if (SignRouteMatcher(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 🔒 Админ-панель
  if (adminRouteMatcher(req)) {
    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/api/(.*)',
  ],
};

