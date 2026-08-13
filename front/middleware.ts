import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "tac_admin_session";
const SESSION_VALUE = "tac-admin-authenticated";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const cookie = request.cookies.get(SESSION_COOKIE)?.value;
    if (cookie !== SESSION_VALUE) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
