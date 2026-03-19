import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(request: NextRequest) {
  console.log(`[Middleware] Running for: ${request.nextUrl.pathname}`);
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // 1. Protected routes: If no cookie at all, redirect to join
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/onboarding") || 
                           pathname.startsWith("/admin");
  
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  // 2. Auth routes: If they HAVE a cookie, let them through
  // Note: We don't redirect to dashboard here anymore to avoid a DB hit in middleware.
  // The pages (login/join) will handle their own "already logged in" check server-side.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/onboarding/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/admin/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
