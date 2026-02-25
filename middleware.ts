import { NextRequest, NextResponse } from "next/server";

// Next.js middleware runs in the Edge runtime, which is incompatible with
// the Node.js-only Prisma adapter used in lib/auth.ts. We do a lightweight
// cookie-presence check here to guard navigation; full session validation
// is enforced inside each protected API route and server component.
const SESSION_COOKIE = "better-auth.session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
