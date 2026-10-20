import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";
import jwt from "jsonwebtoken";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  deviceId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const { code, deviceId } = parsed.data;
  const db = await getDb();

  const otp = await db.collection("otps").findOne({
    email,
    code,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    return NextResponse.json({ ok: false, message: "Invalid or expired OTP" }, { status: 401 });
  }

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
  }

  await db.collection("otps").updateOne({ _id: otp._id }, { $set: { usedAt: new Date() } });

  await db.collection("devices").updateMany(
    { userId: user._id, isActive: true, deviceId: { $ne: deviceId } },
    { $set: { isActive: false, lastSeenAt: new Date() } }
  );

  await db.collection("devices").updateOne(
    { userId: user._id, deviceId },
    { $set: { isActive: true, lastSeenAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
  );

  const sessionToken = jwt.sign(
    { userId: user._id.toString(), email, deviceId },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  await db.collection("users").updateOne({ _id: user._id }, { $set: { isVerified: true, lastLoginAt: new Date() } });

  return NextResponse.json({ ok: true, token: sessionToken, user: { email, premium: !!user.premiumStatus } });
}
