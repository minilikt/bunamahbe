import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_MAP_SIZE = 10000;

function checkIpRateLimit(ip: string, maxRequests: number, windowMs: number): boolean {
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.clear();
  }
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // Allowed
  }
  if (record.count >= maxRequests) {
    return false; // Rate limited
  }
  record.count++;
  return true; // Allowed
}

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // 1. Skip middleware for internal Next.js assets and auth endpoints to avoid loops
  if (
    url.pathname.startsWith("/_next") || 
    url.pathname.startsWith("/api/auth") ||
    url.pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // 2. Skip for Server Actions or Prefetches
  // Prefetching (x-middleware-prefetch: 1) is used by Next.js to pre-cache pages.
  // Skipping session checks here saves a huge number of Edge invocations,
  // as the actual navigation will still run full middleware.
  if ((request.method === "POST" && request.headers.get("Next-Action")) || request.headers.get("x-middleware-prefetch")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  // --- IP-based Rate Limiting (Phase 6) ---
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
  
  // Apply strict rate limiting (10 requests per minute) for POST/WRITE actions and API routes.
  // Note: We apply this BEFORE session checks to prevent DB-hammering via credential stuffing.
  if (request.method === "POST" || request.method === "PUT" || request.method === "DELETE" || request.nextUrl.pathname.startsWith("/api")) {
    const isAllowed = checkIpRateLimit(ip, 10, 60 * 1000);
    if (!isAllowed) {
      console.warn(`[MIDDLEWARE] Rate limit exceeded by IP: ${ip}`);
      return new NextResponse("Too Many Requests. Slow down.", { status: 429 });
    }
  }

  // --- Authentication & Session Checks ---
  // Only fetch the session if the user has a cookie AND is trying to access a protected route
  // or a route that depends on auth state (like root/join).
  const isProtectedRoute = url.pathname.startsWith("/dashboard") || 
                           url.pathname.startsWith("/onboarding") ||
                           url.pathname.startsWith("/admin");
  const isAuthRoute = url.pathname === "/login" || url.pathname === "/join" || url.pathname === "/";

  if (!sessionCookie) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/join", request.url));
    }
    return NextResponse.next();
  }

  // If we have a cookie but it's not a protected or auth route, just continue (saves a fetch)
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  let session = null;
  try {
    // Add a strict timeout (1500ms) to prevent MIDDLEWARE_INVOCATION_TIMEOUT
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (sessionResponse.ok) {
      session = await sessionResponse.json();
    }
  } catch (error) {
    console.error("[MIDDLEWARE] Session fetch failed or timed out:", error);
    // If it's a protected route and fetch failed, redirect to join as a safety measure
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/join", request.url));
    }
  }

  // If session is invalid despite cookie
  if (!session || !session.user) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/join", request.url));
    }
    return NextResponse.next();
  }

  const user = session.user;
  const isOnboarded = !!user.city && !!user.favoriteType;

  // 1. Logged in user trying to access login/join pages -> redirect to dashboard/onboarding
  if (isAuthRoute) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (handled by better-auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
