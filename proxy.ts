import { NextRequest, NextResponse } from "next/server";

// Next.js proxy runs in the Edge runtime, which is incompatible with
// the Node.js-only Prisma adapter used in lib/auth.ts. We do a lightweight
// cookie-presence check here to guard navigation; full session validation
// is enforced inside each protected API route and server component.
const SESSION_COOKIE_DEV = "better-auth.session_token";
const SESSION_COOKIE_PROD = "__Secure-better-auth.session_token";

const AUTH_PAGES = ["/", "/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (AUTH_PAGES.includes(pathname)) {
    const sessionCookie =
      request.cookies.get(SESSION_COOKIE_DEV) ??
      request.cookies.get(SESSION_COOKIE_PROD);

    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get(SESSION_COOKIE_DEV) ??
    request.cookies.get(SESSION_COOKIE_PROD);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};
