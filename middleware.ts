import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  
  // If no session cookie, user is not logged in
  if (!sessionCookie) {
    // If trying to access protected routes, redirect to join
    if (request.nextUrl.pathname.startsWith("/dashboard") || 
        request.nextUrl.pathname.startsWith("/onboarding")) {
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
        request.nextUrl.pathname.startsWith("/onboarding")) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/join",
    "/",
  ],
};
