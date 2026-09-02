/**
 * Telegram Bot API helper for sending reservation notifications and handling inline keyboard callbacks.
 */

export interface TelegramReservationPayload {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
}

/**
 * Send reservation notification to Telegram chat with Inline Keyboard buttons.
 */
export async function sendTelegramNotification(
  payload: TelegramReservationPayload
): Promise<boolean> {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    "8897914854:AAGLEcpl1MRBmfIjEk8zZcg7TLl7Ll3o31o";
  const chatId = process.env.TELEGRAM_CHAT_ID || "1098063047";

  if (!botToken || !chatId) {
    console.warn(
      "Telegram warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured."
    );
    return false;
  }

  const messageText = `
🍷 *NOWA REZERWACJA — BISTRO POLECZKA*

👤 *Imię i Nazwisko:* ${payload.name}
📞 *Telefon:* ${payload.phone}
✉️ *E-mail:* ${payload.email}
📅 *Data:* ${payload.date}
⏰ *Godzina:* ${payload.time}
👥 *Liczba osób:* ${payload.guests}
📝 *Uwagi:* ${payload.notes && payload.notes.trim() ? payload.notes : "Brak"}
  `.trim();

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Akceptuj",
          callback_data: `accept_${payload.id}`,
        },
        {
          text: "❌ Odrzuć",
          callback_data: `reject_${payload.id}`,
        },
      ],
    ],
  };

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "Markdown",
          reply_markup: inlineKeyboard,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram sendMessage API error:", errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}

/**
 * Answer callback query from Telegram inline button.
 */
export async function answerTelegramCallbackQuery(
  callbackQueryId: string,
  text: string
): Promise<boolean> {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    "8897914854:AAGLEcpl1MRBmfIjEk8zZcg7TLl7Ll3o31o";
  if (!botToken) return false;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    });
    return true;
  } catch (err) {
    console.error("Telegram answerCallbackQuery error:", err);
    return false;
  }
}

/**
 * Edit existing Telegram message text and remove inline keyboard.
 */
export async function editTelegramMessage(
  chatId: string | number,
  messageId: number,
  text: string
): Promise<boolean> {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    "8897914854:AAGLEcpl1MRBmfIjEk8zZcg7TLl7Ll3o31o";
  if (!botToken) return false;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "Markdown",
      }),
    });
    return true;
  } catch (err) {
    console.error("Telegram editMessageText error:", err);
    return false;
  }
}
