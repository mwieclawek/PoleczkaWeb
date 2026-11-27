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

const FALLBACK_TELEGRAM_BOT_TOKEN =
  "8897914854:AAGLEcpl1MRBmfIjEk8zZcg7TLl7Ll3o31o";
const FALLBACK_TELEGRAM_CHAT_ID = "1098063047";

/**
 * Escapes HTML entities for Telegram Bot API `parse_mode: "HTML"`.
 */
export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || FALLBACK_TELEGRAM_BOT_TOKEN;
}

function getChatId(): string {
  return process.env.TELEGRAM_CHAT_ID || FALLBACK_TELEGRAM_CHAT_ID;
}

/**
 * Send reservation notification to Telegram chat with Inline Keyboard buttons.
 */
export async function sendTelegramNotification(
  payload: TelegramReservationPayload
): Promise<boolean> {
  const botToken = getBotToken();
  const chatId = getChatId();

  if (!botToken || !chatId) {
    console.warn(
      "Telegram warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured."
    );
    return false;
  }

  const notesText =
    payload.notes && payload.notes.trim() ? payload.notes.trim() : "Brak";

  const messageText = [
    "🍷 <b>NOWA REZERWACJA — BISTRO POLECZKA</b>",
    "",
    `👤 <b>Imię i Nazwisko:</b> ${escapeTelegramHtml(payload.name || "-")}`,
    `📞 <b>Telefon:</b> ${escapeTelegramHtml(payload.phone || "-")}`,
    `✉️ <b>E-mail:</b> ${escapeTelegramHtml(payload.email || "-")}`,
    `📅 <b>Data:</b> ${escapeTelegramHtml(payload.date || "-")}`,
    `⏰ <b>Godzina:</b> ${escapeTelegramHtml(payload.time || "-")}`,
    `👥 <b>Liczba osób:</b> ${escapeTelegramHtml(payload.guests || "-")}`,
    `📝 <b>Uwagi:</b> ${escapeTelegramHtml(notesText)}`,
  ].join("\n");

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
          parse_mode: "HTML",
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
  const botToken = getBotToken();
  if (!botToken) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
        }),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram answerCallbackQuery API error:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram answerCallbackQuery error:", err);
    return false;
  }
}

/**
 * Edit existing Telegram message text (HTML) and remove inline keyboard.
 */
export async function editTelegramMessage(
  chatId: string | number,
  messageId: number,
  htmlText: string
): Promise<boolean> {
  const botToken = getBotToken();
  if (!botToken) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/editMessageText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: htmlText,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [] },
        }),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram editMessageText API error:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram editMessageText error:", err);
    return false;
  }
}
