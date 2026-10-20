import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  const userCount = await db.collection("users").countDocuments();
  const premiumCount = await db.collection("premium_codes").countDocuments({ status: "active" });

  return NextResponse.json({ ok: true, stats: { userCount, premiumCount } });
}
