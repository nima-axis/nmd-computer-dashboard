import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const schema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid input" }, { status: 400 });
  }

  const password = process.env.DASHBOARD_PASSWORD || "Nimesha00@@";

  if (parsed.data.password !== password) {
    return NextResponse.json({ ok: false, message: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, message: "Logged in" });
  response.cookies.set("admin_auth", "verified", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
