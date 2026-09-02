import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

    // 2. Persist to Firestore from server to ensure all tablet panels receive real-time update
    try {
      const reservationId = String(payload.id);
      const cleanId = reservationId.startsWith("local_")
        ? reservationId
        : reservationId;

      await setDoc(
        doc(db, "reservations", cleanId),
        {
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          date: payload.date,
          time: payload.time,
          guests: payload.guests,
          notes: payload.notes || "",
          status: payload.status || "pending",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.warn("Server-side Firestore persistence warning:", fsErr);
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
