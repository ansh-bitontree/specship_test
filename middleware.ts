import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

export function middleware(request: NextRequest) {
  const isSignedIn = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (isSignedIn) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/app/:path*"],
};
