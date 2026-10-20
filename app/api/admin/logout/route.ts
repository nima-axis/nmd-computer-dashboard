import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const expected = process.env.DASHBOARD_PASSWORD || "Nimesha00@@";

  if (password !== expected) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("admin_auth", "verified", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
