import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  if (!email) {
    return NextResponse.json({ ok: false, message: "Email required" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("users").updateOne(
    { email: email.toLowerCase() },
    { $set: { isVerified: true, verifiedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, message: "Email marked verified" });
}
