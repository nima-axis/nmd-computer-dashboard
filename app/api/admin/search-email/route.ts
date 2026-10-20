import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.cookies.set("admin_auth", "", { maxAge: 0, path: "/" });
  return response;
}
