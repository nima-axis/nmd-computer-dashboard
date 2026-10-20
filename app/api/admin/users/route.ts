import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();

  const message = `Hello, I want a premium code for NMD COMPUTER. My email is ${email || "[your email]"}. Please guide me after payment.`;

  return NextResponse.json({ ok: true, message, target: process.env.ADMIN_WHATSAPP_NUMBER || "+94726800969" });
}
