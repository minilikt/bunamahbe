import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(request: NextRequest) {
  // Skip middleware logic for Next.js Server Actions (POST requests with Next-Action header).
  // After OTP verification creates a session, calling a server action on /join would otherwise
  // trigger a redirect (since the user is now "logged in"), causing "unexpected response" errors.
  if (request.headers.get("Next-Action")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  
  // If no session cookie, user is not logged in
  if (!sessionCookie) {
    if (request.nextUrl.pathname.startsWith("/dashboard") || 
        request.nextUrl.pathname.startsWith("/onboarding") ||
        request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/join", request.url));
    }
    return NextResponse.next();
  }

  let session = null;
  try {
    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (sessionResponse.ok) {
      session = await sessionResponse.json();
    }
  } catch (error) {
    console.error("[MIDDLEWARE] Session fetch failed:", error);
  }

  // If session is invalid despite cookie
  if (!session || !session.user) {
    if (request.nextUrl.pathname.startsWith("/dashboard") || 
        request.nextUrl.pathname.startsWith("/onboarding") ||
        request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/join", request.url));
    }
    return NextResponse.next();
  }

  const user = session.user;
  const isOnboarded = !!user.city && !!user.favoriteType;

  // 1. Logged in user trying to access login/join pages -> redirect to dashboard/onboarding
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/join" || request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(isOnboarded ? "/dashboard" : "/onboarding", request.url));
  }

  // 2. Logged in user but NOT onboarded trying to access dashboard -> redirect to onboarding
  if (request.nextUrl.pathname.startsWith("/dashboard") && !isOnboarded) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 3. Logged in user AND onboarded trying to access onboarding -> redirect to dashboard
  if (request.nextUrl.pathname.startsWith("/onboarding") && isOnboarded) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // 4. Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/login",
    "/join",
  ],
};
