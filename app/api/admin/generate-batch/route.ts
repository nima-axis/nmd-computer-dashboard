import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  const users = await db.collection("users").find({}).limit(50).toArray();
  return NextResponse.json({ ok: true, users });
}
