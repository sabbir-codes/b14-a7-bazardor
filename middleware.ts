import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Protected routes: product details + profile pages.
 * Optimistic cookie check (fast, edge-safe); pages also guard on the client.
 */
export function middleware(req: NextRequest) {
  const session = getSessionCookie(req);
  if (!session) {
    const url = req.nextUrl.clone();
    const next = req.nextUrl.pathname + req.nextUrl.search;
    url.pathname = "/signin";
    url.search = `?redirect=${encodeURIComponent(next)}&reason=protected`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
