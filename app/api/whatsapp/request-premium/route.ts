import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Email required" }, { status: 400 });
  }

  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || "+94726800969";
  const message = `Hello, I want a premium code for NMD COMPUTER. My email is ${email}. Please guide me after payment.`;

  return NextResponse.json({
    ok: true,
    message,
    target: adminNumber,
    note: "This is the manual WhatsApp flow. The admin receives the WhatsApp request and manually checks the dashboard by email before generating a premium code.",
  });
}
