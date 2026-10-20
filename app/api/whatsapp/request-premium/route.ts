import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
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

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
  }

  const premiumCode = await db.collection("premium_codes").findOne({ email, code, status: "active" });
  if (!premiumCode) {
    return NextResponse.json({ ok: false, message: "Premium code not valid for this email" }, { status: 403 });
  }

  await db.collection("premium_codes").updateOne(
    { _id: premiumCode._id },
    { $set: { status: "used", redeemedAt: new Date(), deviceId } }
  );

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { premiumStatus: "active", premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), lastPremiumActivation: new Date() } }
  );

  return NextResponse.json({ ok: true, message: "Premium activated" });
}
