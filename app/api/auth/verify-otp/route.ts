import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendOtpEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  deviceId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const db = await getDb();

  await db.collection("users").updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        isVerified: false,
        createdAt: new Date(),
      },
      $set: { lastLoginAt: new Date() },
    },
    { upsert: true }
  );

  await db.collection("otps").insertOne({
    email,
    code: otp,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    usedAt: null,
  });

  await sendOtpEmail(email, otp);

  return NextResponse.json({ ok: true, message: "OTP sent to email" });
}
