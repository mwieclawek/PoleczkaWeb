import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";
import { saveReservationToStore } from "@/lib/reservations-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload || !payload.id || !payload.name) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 1. Send Telegram Notification (uses robust botToken & chatId with fallbacks)
    const telegramSuccess = await sendTelegramNotification(payload);

    // 2. Persist to server store and Firestore
    try {
      saveReservationToStore({
        id: String(payload.id),
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        date: payload.date,
        time: payload.time,
        guests: payload.guests,
        notes: payload.notes || "",
        status: payload.status || "pending",
      });
    } catch (fsErr) {
      console.warn("Server-side persistence warning:", fsErr);
    }

    return NextResponse.json({ ok: true, telegram: telegramSuccess });
  } catch (err: any) {
    console.error("Telegram notification API error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
