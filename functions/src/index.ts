import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { Resend } from "resend";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 1. Trigger Firestore onCreate na kolekcji /reservations
 * Wysyła wiadomość do grupy Telegram z przyciskami interaktywnymi Inline Keyboard.
 */
export const onReservationCreated = onDocumentCreated(
  {
    document: "reservations/{reservationId}",
    region: "europe-central2",
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.error("Brak danych w evencie Firestore");
      return;
    }

    const data = snapshot.data();
    const reservationId = event.params.reservationId;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      logger.warn("Brak TELEGRAM_BOT_TOKEN lub TELEGRAM_CHAT_ID w środowisku.");
      return;
    }

    const text = `🍽 **NOWA REZERWACJA - Bistro Poleczka** 🍽\n\n` +
      `👤 **Imię i Nazwisko:** ${data.name || "Brak"}\n` +
      `📞 **Telefon:** ${data.phone || "Brak"}\n` +
      `📧 **Email:** ${data.email || "Brak"}\n` +
      `📅 **Data:** ${data.date || "Brak"}\n` +
      `⏰ **Godzina:** ${data.time || "Brak"}\n` +
      `👥 **Liczba osób:** ${data.guests || "Brak"}\n` +
      `📝 **Uwagi:** ${data.notes || "Brak"}\n\n` +
      `Status: ⏳ *Oczekuje na akceptację*`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "✅ Potwierdź", callback_data: `confirm_${reservationId}` },
          { text: "❌ Odrzuć", callback_data: `reject_${reservationId}` },
        ],
      ],
    };

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
          reply_markup: inlineKeyboard,
        }),
      });

      const resData = await response.json();
      logger.info("Wiadomość na Telegram wysłana pomyślnie:", resData);
    } catch (error) {
      logger.error("Błąd wysyłania powiadomienia Telegram:", error);
    }
  }
);

/**
 * 2. HTTP Endpoint dla Webhooka Telegrama (telegramWebhook)
 * Aktualizuje status w Firestore na 'confirmed' / 'rejected' oraz wysyła e-mail do klienta.
 */
export const telegramWebhook = onRequest(
  { region: "europe-central2", cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const update = req.body;
    logger.info("Otrzymano webhook z Telegrama:", update);

    if (!update || !update.callback_query) {
      res.status(200).send("OK - Brak callback_query");
      return;
    }

    const callbackQuery = update.callback_query;
    const callbackData: string = callbackQuery.data;
    const callbackId: string = callbackQuery.id;
    const message = callbackQuery.message;

    if (!callbackData) {
      res.status(200).send("OK - Brak callbackData");
      return;
    }

    const [action, reservationId] = callbackData.split("_");

    if (!reservationId || (action !== "confirm" && action !== "reject")) {
      res.status(200).send("OK - Nieprawidłowa akcja");
      return;
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const resendApiKey = process.env.RESEND_API_KEY;

    try {
      const reservationRef = db.collection("reservations").doc(reservationId);
      const doc = await reservationRef.get();

      if (!doc.exists) {
        logger.error(`Rezerwacja ${reservationId} nie została znaleziona.`);
        res.status(404).send("Reservation not found");
        return;
      }

      const reservationData = doc.data()!;
      const newStatus = action === "confirm" ? "confirmed" : "rejected";

      // 1. Zmiana statusu w Firestore
      await reservationRef.update({
        status: newStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2. Odpowiedź na Telegram callbackQuery
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callbackId,
            text: newStatus === "confirmed" ? "Rezerwacja POTWIERDZONA! ✅" : "Rezerwacja ODRZUCONA ❌",
          }),
        });

        // 3. Aktualizacja treści wiadomości w Telegramie
        const statusText = newStatus === "confirmed" ? "✅ **POTWIERDZONA**" : "❌ **ODRZUCONA**";
        const origText = message?.text || "";
        const updatedText = origText.replace("Status: ⏳ *Oczekuje na akceptację*", `Status: ${statusText}`) +
          `\n\n_Zaktualizowano przez: ${callbackQuery.from?.first_name || "Obsługę"}_`;

        await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: updatedText,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [] },
          }),
        });
      }

      // 4. Wysyłanie wiadomości e-mail do klienta przez Resend
      if (resendApiKey && reservationData.email) {
        const resend = new Resend(resendApiKey);
        const isConfirmed = newStatus === "confirmed";
        const subject = isConfirmed
          ? "Potwierdzenie Rezerwacji - Bistro Poleczka"
          : "Informacja o Rezerwacji - Bistro Poleczka";

        const html = isConfirmed
          ? `
            <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #e5e7eb; rounded: 12px;">
              <h2 style="color: #2b5329; margin-top: 0;">Dzień dobry ${reservationData.name}!</h2>
              <p style="font-size: 16px; line-height: 1.5;">Miło nam poinformować, że Twoja rezerwacja w <strong>Bistro Poleczka</strong> została <strong>POTWIERDZONA</strong>! 🎉</p>
              <div style="background: #f4f6f3; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2b5329;">
                <p style="margin: 4px 0;">📅 <strong>Data:</strong> ${reservationData.date}</p>
                <p style="margin: 4px 0;">⏰ <strong>Godzina:</strong> ${reservationData.time}</p>
                <p style="margin: 4px 0;">👥 <strong>Liczba osób:</strong> ${reservationData.guests}</p>
              </div>
              <p style="font-size: 14px; color: #4b5563;">Czekamy na Ciebie w Bistro Poleczka. Do zobaczenia!</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af;">Pozdrawiamy,<br>Zespół Bistro Poleczka</p>
            </div>
          `
          : `
            <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; border: 1px solid #e5e7eb; rounded: 12px;">
              <h2 style="color: #dc2626; margin-top: 0;">Dzień dobry ${reservationData.name},</h2>
              <p style="font-size: 16px; line-height: 1.5;">Przykro nam, ale nie możemy przyjąć Twojej rezerwacji na dzień <strong>${reservationData.date}</strong> o godz. <strong>${reservationData.time}</strong> z powodu braku wolnych stolików w wybranym terminie.</p>
              <p style="font-size: 14px; color: #4b5563;">Zachęcamy do wyboru innego terminu lub kontaktu telefonicznego.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af;">Pozdrawiamy,<br>Zespół Bistro Poleczka</p>
            </div>
          `;

        await resend.emails.send({
          from: "Bistro Poleczka <rezerwacje@bistropoleczka.pl>",
          to: reservationData.email,
          subject: subject,
          html: html,
        });

        logger.info(`Email z powiadomieniem wysłany do ${reservationData.email}`);
      }

      res.status(200).send("OK");
    } catch (error) {
      logger.error("Błąd przetwarzania telegramWebhook:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
