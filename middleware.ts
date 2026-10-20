import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/dashboard"];
  const loginPath = "/login";
  const token = req.cookies.get("admin_auth")?.value;

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }

  if (req.nextUrl.pathname === loginPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
