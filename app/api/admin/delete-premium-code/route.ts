import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Email required" }, { status: 400 });
  }

  const db = await getDb();

  const activeCode = await db.collection("premium_codes").findOne({
    email,
    status: "active",
  });

  if (!activeCode) {
    return NextResponse.json({ ok: false, message: "No active premium code found for this email" }, { status: 404 });
  }

  await db.collection("premium_codes").updateOne(
    { _id: activeCode._id },
    {
      $set: {
        status: "revoked",
        revokedAt: new Date(),
      },
    }
  );

  await db.collection("users").updateOne(
    { email },
    { $set: { premiumStatus: "inactive" } }
  );

  return NextResponse.json({
    ok: true,
    message: "Premium code revoked successfully",
    code: activeCode.code,
  });
}
