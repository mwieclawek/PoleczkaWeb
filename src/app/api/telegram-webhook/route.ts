import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  answerTelegramCallbackQuery,
  editTelegramMessage,
} from "@/lib/telegram";
import { sendReservationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a Telegram callback query (button click)
    const callbackQuery = body.callback_query;
    if (!callbackQuery) {
      return NextResponse.json({ ok: true, message: "Not a callback query" });
    }

    const callbackData: string = callbackQuery.data || "";
    const callbackQueryId = callbackQuery.id;
    const message = callbackQuery.message;
    const chatId = message?.chat?.id;
    const messageId = message?.message_id;
    const originalText = message?.text || "";

    if (!callbackData.startsWith("accept_") && !callbackData.startsWith("reject_")) {
      return NextResponse.json({ ok: true, message: "Ignored callback data" });
    }

    const isAccept = callbackData.startsWith("accept_");
    const reservationId = callbackData.replace(isAccept ? "accept_" : "reject_", "");
    const newStatus = isAccept ? "confirmed" : "rejected";

    // 1. Fetch reservation details from Firestore
    const reservationRef = doc(db, "reservations", reservationId);
    const reservationSnap = await getDoc(reservationRef);

    if (reservationSnap.exists()) {
      const data = reservationSnap.data();

      // 2. Update status in Firestore
      await updateDoc(reservationRef, { status: newStatus });

      // 3. Send email to client
      if (data.email) {
        await sendReservationEmail({
          to: data.email,
          name: data.name || "Szanowny Kliencie",
          date: data.date || "",
          time: data.time || "",
          guests: data.guests || "",
          status: newStatus,
        });
      }
    }

    // 4. Answer Telegram callback query
    const alertMessage = isAccept
      ? "✅ Rezerwacja została zaakceptowana!"
      : "❌ Rezerwacja została odrzucona.";

    await answerTelegramCallbackQuery(callbackQueryId, alertMessage);

    // 5. Edit Telegram message to show final status and remove buttons
    if (chatId && messageId) {
      const statusBadge = isAccept
        ? "\n\n✅ *STATUS: ZAAKCEPTOWANO PRZEZ OPERATORA*"
        : "\n\n❌ *STATUS: ODRZUCONO PRZEZ OPERATORA*";

      const updatedText = originalText + statusBadge;
      await editTelegramMessage(chatId, messageId, updatedText);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal Error" },
      { status: 500 }
    );
  }
}
