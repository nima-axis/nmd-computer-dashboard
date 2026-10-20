import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const count = Number(form.get("count") || 10);
  const db = await getDb();

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let code = "NMD-";
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let j = 0; j < 8; j++) code += chars[Math.floor(Math.random() * chars.length)];
    codes.push(code);
  }

  const inserted = await Promise.all(
    codes.map(async (code) => {
      const exists = await db.collection("premium_codes").findOne({ code });
      if (exists) return null;
      await db.collection("premium_codes").insertOne({
        code,
        email: null,
        userId: null,
        status: "unused",
        createdAt: new Date(),
      });
      return code;
    })
  );

  return NextResponse.json({ ok: true, generated: inserted.filter(Boolean) });
}
