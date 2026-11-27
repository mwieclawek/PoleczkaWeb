import { NextRequest, NextResponse } from "next/server";
import { processReservationStatusChange } from "@/lib/reservation-notifications";
import {
  answerTelegramCallbackQuery,
  editTelegramMessage,
  escapeTelegramHtml,
} from "@/lib/telegram";

interface TelegramWebhookBody {
  callback_query?: {
    id?: string;
    data?: string;
    message?: {
      message_id?: number;
      text?: string;
      chat?: {
        id?: string | number;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TelegramWebhookBody;

    const callbackQuery = body?.callback_query;
    if (!callbackQuery) {
      return NextResponse.json({ ok: true, message: "Not a callback query" });
    }

    const callbackData = callbackQuery.data || "";
    const callbackQueryId = callbackQuery.id || "";
    const message = callbackQuery.message;
    const chatId = message?.chat?.id;
    const messageId = message?.message_id;
    const originalText = message?.text || "";

    let newStatus: "confirmed" | "rejected" | null = null;
    let reservationId = "";

    if (callbackData.startsWith("accept_")) {
      newStatus = "confirmed";
      reservationId = callbackData.slice("accept_".length);
    } else if (callbackData.startsWith("confirm_")) {
      newStatus = "confirmed";
      reservationId = callbackData.slice("confirm_".length);
    } else if (callbackData.startsWith("reject_")) {
      newStatus = "rejected";
      reservationId = callbackData.slice("reject_".length);
    }

    if (!newStatus || !reservationId) {
      return NextResponse.json({ ok: true, message: "Ignored callback data" });
    }

    const result = await processReservationStatusChange({
      id: reservationId,
      status: newStatus,
      source: "telegram_webhook",
    });

    const alertMessage = result.skippedDuplicate
      ? "ℹ️ Status tej rezerwacji był już wcześniej zapisany."
      : newStatus === "confirmed"
      ? "✅ Rezerwacja została zaakceptowana!"
      : "❌ Rezerwacja została odrzucona.";

    if (callbackQueryId) {
      await answerTelegramCallbackQuery(callbackQueryId, alertMessage);
    }

    if (chatId && messageId) {
      const escapedOriginal = escapeTelegramHtml(originalText);
      const statusBadge =
        newStatus === "confirmed"
          ? "\n\n✅ <b>STATUS: ZAAKCEPTOWANO PRZEZ OPERATORA</b>"
          : "\n\n❌ <b>STATUS: ODRZUCONO PRZEZ OPERATORA</b>";

      const updatedHtml = originalText.includes("STATUS:")
        ? escapedOriginal
        : `${escapedOriginal}${statusBadge}`;

      await editTelegramMessage(chatId, messageId, updatedHtml);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal Error",
      },
      { status: 500 }
    );
  }
}
