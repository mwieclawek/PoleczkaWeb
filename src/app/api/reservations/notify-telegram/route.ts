import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload || !payload.id || !payload.name) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const success = await sendTelegramNotification(payload);
    return NextResponse.json({ ok: success });
  } catch (err: any) {
    console.error("Telegram notification API error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
