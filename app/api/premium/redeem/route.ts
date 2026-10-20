import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ ok: false, message: "Missing token" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    const db = await getDb();

    await db.collection("devices").updateOne(
      { userId: payload.userId, deviceId: payload.deviceId },
      { $set: { lastSeenAt: new Date(), isActive: true } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, active: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid or expired token" }, { status: 401 });
  }
}
