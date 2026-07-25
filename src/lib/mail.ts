import nodemailer from "nodemailer";

interface SendReservationEmailOptions {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: string;
  status: "confirmed" | "rejected";
}

/**
 * Send reservation confirmation or rejection email to the client using Gmail SMTP.
 */
export async function sendReservationEmail({
  to,
  name,
  date,
  time,
  guests,
  status,
}: SendReservationEmailOptions): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn(
      "Nodemailer warning: GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email not sent."
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const isConfirmed = status === "confirmed";

  const subject = isConfirmed
    ? `Potwierdzenie rezerwacji — Bistro Poleczka`
    : `Informacja o rezerwacji — Bistro Poleczka`;

  const htmlContent = isConfirmed
    ? `
      <div style="font-family: 'Open Sans', Arial, sans-serif; background-color: #FFFDF6; padding: 30px; color: #960C3F; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(150, 12, 63, 0.2);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #960C3F; margin: 0; font-size: 26px;">Bistro Poleczka</h1>
          <p style="color: #D9A261; font-size: 14px; font-weight: 600; text-transform: uppercase; tracking-wider: 2px;">Polska Kuchnia · Wrocław</p>
        </div>

        <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border-left: 4px solid #CA5254; margin-bottom: 24px;">
          <h2 style="color: #CA5254; margin-top: 0; font-size: 20px;">Rezerwacja została potwierdzona! 🎉</h2>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">Dzień dobry <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">Z radością potwierdzamy Twoją rezerwację stolika w Bistro Poleczka. Czekamy na Ciebie!</p>
        </div>

        <div style="background-color: #fcf8f0; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="color: #960C3F; margin-top: 0; font-size: 16px; border-bottom: 1px solid rgba(150, 12, 63, 0.1); padding-bottom: 8px;">Szczegóły rezerwacji:</h3>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; color: #444; line-height: 1.8;">
            <li>📅 <strong>Data:</strong> ${date}</li>
            <li>⏰ <strong>Godzina:</strong> ${time}</li>
            <li>👥 <strong>Liczba osób:</strong> ${guests}</li>
            <li>📍 <strong>Adres:</strong> ul. Stefana Jaracza 77B, 50-305 Wrocław</li>
          </ul>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
          Jeśli chcesz zmienić lub odwołać rezerwację, skontaktuj się z nami pod adresem <a href="mailto:kontakt@bistropoleczka.pl" style="color: #CA5254;">kontakt@bistropoleczka.pl</a>.
        </p>

        <div style="text-align: center; border-top: 1px solid rgba(150, 12, 63, 0.1); padding-top: 16px; margin-top: 24px; font-size: 12px; color: #888;">
          &copy; ${new Date().getFullYear()} Bistro Poleczka · Wszelkie prawa zastrzeżone
        </div>
      </div>
    `
    : `
      <div style="font-family: 'Open Sans', Arial, sans-serif; background-color: #FFFDF6; padding: 30px; color: #960C3F; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(150, 12, 63, 0.2);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #960C3F; margin: 0; font-size: 26px;">Bistro Poleczka</h1>
          <p style="color: #D9A261; font-size: 14px; font-weight: 600; text-transform: uppercase; tracking-wider: 2px;">Polska Kuchnia · Wrocław</p>
        </div>

        <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border-left: 4px solid #960C3F; margin-bottom: 24px;">
          <h2 style="color: #960C3F; margin-top: 0; font-size: 20px;">Informacja o rezerwacji</h2>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">Dzień dobry <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            Dziękujemy za zainteresowanie Bistro Poleczka. Niestety w wybranym terminie (<strong>${date}</strong> o godz. <strong>${time}</strong>) nie dysponujemy wolnym stolikiem dla <strong>${guests}</strong>.
          </p>
          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            Przepraszamy za niedogodności i serdecznie zachęcamy do wyboru innego terminu lub kontaktu bezpośredniego.
          </p>
        </div>

        <div style="text-align: center; border-top: 1px solid rgba(150, 12, 63, 0.1); padding-top: 16px; margin-top: 24px; font-size: 12px; color: #888;">
          &copy; ${new Date().getFullYear()} Bistro Poleczka · Wszelkie prawa zastrzeżone
        </div>
      </div>
    `;

  try {
    await transporter.sendMail({
      from: `"Bistro Poleczka" <${gmailUser}>`,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Nodemailer sendMail error:", error);
    return false;
  }
}
