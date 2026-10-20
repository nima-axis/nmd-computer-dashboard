import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email: email.toLowerCase() });

  if (!user) {
    return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user });
}
