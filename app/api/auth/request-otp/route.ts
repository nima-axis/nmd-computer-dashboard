import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "NMD-";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

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

  if (!user.isVerified) {
    return NextResponse.json({ ok: false, message: "User email is not verified" }, { status: 403 });
  }

  const existing = await db.collection("premium_codes").findOne({ email: email.toLowerCase(), status: "active" });
  if (existing) {
    return NextResponse.json({ ok: true, code: existing.code, message: "Existing active premium code returned" });
  }

  let code = generateCode();
  let exists = await db.collection("premium_codes").findOne({ code });
  while (exists) {
    code = generateCode();
    exists = await db.collection("premium_codes").findOne({ code });
  }

  const result = await db.collection("premium_codes").insertOne({
    code,
    email: email.toLowerCase(),
    userId: user._id,
    status: "active",
    createdAt: new Date(),
    redeemedAt: null,
    deviceId: null,
  });

  return NextResponse.json({ ok: true, code, createdId: result.insertedId });
}
