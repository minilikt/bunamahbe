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

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // 1. Skip proxy for internal Next.js assets and auth endpoints to avoid loops
  if (
    url.pathname.startsWith("/_next") || 
    url.pathname.startsWith("/api/auth") ||
    url.pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // 2. Skip for Server Actions or Prefetches
  if ((request.method === "POST" && request.headers.get("Next-Action")) || request.headers.get("x-middleware-prefetch")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  // --- IP-based Rate Limiting ---
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
  
  // Apply strict rate limiting (20 requests per minute) for POST/WRITE actions and API routes.
  if (request.method === "POST" || request.method === "PUT" || request.method === "DELETE" || request.nextUrl.pathname.startsWith("/api")) {
    const isAllowed = checkIpRateLimit(ip, 20, 60 * 1000);
    if (!isAllowed) {
      console.warn(`[PROXY] Rate limit exceeded by IP: ${ip}`);
      return new NextResponse("Too Many Requests. Slow down.", { status: 429 });
    }
  }

  // --- Lightweight Authentication & Session Checks ---
  const isProtectedRoute = url.pathname.startsWith("/dashboard") || 
                           url.pathname.startsWith("/onboarding") ||
                           url.pathname.startsWith("/admin");

  // Only redirect if we are SURE there is no session (missing cookie)
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/join", request.url));
  }

  // Verification of session validity and complex role/onboarding redirects
  // are now handled in server components to avoid blocking the network edge.

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
