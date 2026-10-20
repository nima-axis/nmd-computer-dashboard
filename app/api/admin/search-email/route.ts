import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
  }

  const activeCode = await db.collection("premium_codes").findOne({
    email,
    status: "active",
  });

  return NextResponse.json({
    ok: true,
    user: {
      email: user.email,
      isVerified: Boolean(user.isVerified),
      verifiedAt: user.verifiedAt || null,
      lastLoginAt: user.lastLoginAt || null,
      premiumStatus: user.premiumStatus || "inactive",
    },
    premiumCode: activeCode ? activeCode.code : null,
    hasActivePremium: Boolean(activeCode),
  });
}
