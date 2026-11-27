import { Resend } from "resend";

export const DEFAULT_MAIL_FROM = "Bistro Poleczka <rezerwacje@bistropoleczka.pl>";
export const DEFAULT_MAIL_REPLY_TO = "kontakt@bistropoleczka.pl";
export const DEFAULT_VENUE_PHONE = "+48 71 880 87 08";
export const VENUE_ADDRESS = "ul. Stefana Jaracza 77B, Wrocław";
export const VENUE_POSTAL_ADDRESS = "ul. Stefana Jaracza 77B, 50-305 Wrocław";

export type ReservationEmailStatus = "pending" | "confirmed" | "rejected";

export interface SendReservationEmailOptions {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  reason?: string;
  status: ReservationEmailStatus;
}

export interface EmailSendResult {
  ok: boolean;
  sent: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

export interface BuiltEmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Escapes HTML special characters to prevent broken markup or injection in email templates.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validates basic e-mail address syntax after trimming whitespace.
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatTelHref(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function renderEmailShell({
  badge,
  heading,
  accentColor,
  bodyHtml,
  venuePhone,
  replyTo,
}: {
  badge: string;
  heading: string;
  accentColor: string;
  bodyHtml: string;
  venuePhone: string;
  replyTo: string;
}): string {
  const safeBadge = escapeHtml(badge);
  const safeHeading = escapeHtml(heading);
  const safePhone = escapeHtml(venuePhone);
  const safeReplyTo = escapeHtml(replyTo);
  const telHref = formatTelHref(venuePhone);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeHeading}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFDF6;font-family:'Open Sans',Arial,Helvetica,sans-serif;color:#2D1A22;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFDF6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid rgba(150,12,63,0.18);border-radius:16px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:28px 24px 20px;background-color:#FFFDF6;border-bottom:1px solid rgba(150,12,63,0.12);">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D9A261;">
                Kuchnia Polska &middot; Wrocław
              </p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:700;color:#960C3F;">
                Bistro Poleczka
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 20px;">
              <div style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:#FFFDF6;border:1px solid ${accentColor};color:${accentColor};font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:14px;">
                ${safeBadge}
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#960C3F;">
                ${safeHeading}
              </h2>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 26px;background-color:#FFFDF6;border-top:1px solid rgba(150,12,63,0.12);text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#5A444D;">
                <strong>Bistro Poleczka</strong> &middot; ${escapeHtml(VENUE_POSTAL_ADDRESS)}
              </p>
              <p style="margin:0 0 10px;font-size:13px;color:#5A444D;">
                Tel.: <a href="tel:${escapeHtml(telHref)}" style="color:#960C3F;text-decoration:none;font-weight:600;">${safePhone}</a>
                &nbsp;&middot;&nbsp;
                E-mail: <a href="mailto:${safeReplyTo}" style="color:#CA5254;text-decoration:none;font-weight:600;">${safeReplyTo}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#8E7E84;">
                &copy; ${new Date().getFullYear()} Bistro Poleczka. Wszelkie prawa zastrzeżone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderSummaryRows(rows: Array<{ label: string; value: string }>): string {
  const items = rows
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#7A666E;border-bottom:1px solid rgba(150,12,63,0.1);width:42%;vertical-align:top;">
          ${escapeHtml(label)}
        </td>
        <td style="padding:8px 0;font-size:14px;color:#2D1A22;font-weight:600;border-bottom:1px solid rgba(150,12,63,0.1);text-align:right;vertical-align:top;">
          ${escapeHtml(value)}
        </td>
      </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFDF6;border:1px solid rgba(150,12,63,0.14);border-radius:12px;padding:12px 16px;margin:20px 0;">
      ${items}
    </table>`;
}

/**
 * Builds the subject, responsive HTML template, and plain-text version for reservation emails.
 */
export function buildReservationEmailContent(
  options: Omit<SendReservationEmailOptions, "to">,
  config?: { venuePhone?: string; replyTo?: string }
): BuiltEmailContent {
  const venuePhone = (
    config?.venuePhone ||
    process.env.VENUE_PHONE ||
    DEFAULT_VENUE_PHONE
  ).trim();
  const replyTo = (
    config?.replyTo ||
    process.env.MAIL_REPLY_TO ||
    DEFAULT_MAIL_REPLY_TO
  ).trim();

  const name = options.name.trim() || "Gościu";
  const date = options.date.trim() || "-";
  const time = options.time.trim() || "-";
  const guests = options.guests.trim() || "-";
  const notes = options.notes?.trim() || "";
  const reason = options.reason?.trim() || "";

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(venuePhone);
  const telHref = escapeHtml(formatTelHref(venuePhone));
  const safeReplyTo = escapeHtml(replyTo);

  if (options.status === "pending") {
    const subject = "Otrzymaliśmy prośbę o rezerwację – Bistro Poleczka";
    const summaryNotes = notes || "Brak";
    const summaryHtml = renderSummaryRows([
      { label: "Imię i nazwisko", value: name },
      { label: "Data", value: date },
      { label: "Godzina", value: time },
      { label: "Liczba osób", value: guests },
      { label: "Uwagi", value: summaryNotes },
    ]);

    const bodyHtml = `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
        Dzień dobry <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
        dziękujemy za złożenie prośby o rezerwację stolika w <strong>Bistro Poleczka</strong>.
      </p>
      ${summaryHtml}
      <div style="background-color:#FFFDF6;border-left:4px solid #D9A261;padding:14px 16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:#2D1A22;">
          Twoja rezerwacja <strong>oczekuje na potwierdzenie przez obsługę</strong> restauracji.
          Gdy tylko ją zatwierdzimy, <strong>wkrótce wyślemy potwierdzenie mailem i SMS-em</strong>.
        </p>
      </div>
      <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#5A444D;">
        W pilnych sprawach prosimy o kontakt telefoniczny:
        <a href="tel:${telHref}" style="color:#960C3F;font-weight:600;text-decoration:none;">${safePhone}</a>.
      </p>`;

    const html = renderEmailShell({
      badge: "Oczekuje na potwierdzenie",
      heading: "Otrzymaliśmy Twoją prośbę o rezerwację",
      accentColor: "#D9A261",
      bodyHtml,
      venuePhone,
      replyTo,
    });

    const text = [
      `Dzień dobry ${name},`,
      "",
      "Dziękujemy za złożenie prośby o rezerwację stolika w Bistro Poleczka.",
      "",
      "Podsumowanie zgłoszenia:",
      `- Imię i nazwisko: ${name}`,
      `- Data: ${date}`,
      `- Godzina: ${time}`,
      `- Liczba osób: ${guests}`,
      `- Uwagi: ${summaryNotes}`,
      "",
      "Twoja rezerwacja oczekuje na potwierdzenie przez obsługę restauracji.",
      "Wkrótce wyślemy potwierdzenie mailem i SMS-em.",
      "",
      `Adres lokalu: ${VENUE_ADDRESS}`,
      `Telefon kontaktowy: ${venuePhone}`,
      `E-mail: ${replyTo}`,
    ].join("\n");

    return { subject, html, text };
  }

  if (options.status === "confirmed") {
    const subject = "Potwierdzenie rezerwacji – Bistro Poleczka";
    const summaryRows: Array<{ label: string; value: string }> = [
      { label: "Data", value: date },
      { label: "Godzina", value: time },
      { label: "Liczba osób", value: guests },
      { label: "Adres lokalu", value: VENUE_ADDRESS },
      { label: "Telefon do lokalu", value: venuePhone },
    ];
    if (notes) {
      summaryRows.push({ label: "Uwagi", value: notes });
    }
    const summaryHtml = renderSummaryRows(summaryRows);

    const bodyHtml = `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
        Dzień dobry <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
        z przyjemnością potwierdzamy Twoją rezerwację stolika w <strong>Bistro Poleczka</strong>.
        Czekamy na Ciebie!
      </p>
      ${summaryHtml}
      <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#5A444D;">
        W razie chęci zmiany godziny, liczby gości lub odwołania rezerwacji prosimy o kontakt telefoniczny pod numerem
        <a href="tel:${telHref}" style="color:#960C3F;font-weight:600;text-decoration:none;">${safePhone}</a>
        lub mailowo: <a href="mailto:${safeReplyTo}" style="color:#CA5254;font-weight:600;text-decoration:none;">${safeReplyTo}</a>.
      </p>`;

    const html = renderEmailShell({
      badge: "Rezerwacja potwierdzona",
      heading: "Twoja rezerwacja została potwierdzona",
      accentColor: "#2E7D4F",
      bodyHtml,
      venuePhone,
      replyTo,
    });

    const textLines = [
      `Dzień dobry ${name},`,
      "",
      "Z przyjemnością potwierdzamy Twoją rezerwację stolika w Bistro Poleczka. Czekamy na Ciebie!",
      "",
      "Szczegóły rezerwacji:",
      `- Data: ${date}`,
      `- Godzina: ${time}`,
      `- Liczba osób: ${guests}`,
      ...(notes ? [`- Uwagi: ${notes}`] : []),
      `- Adres: ${VENUE_ADDRESS}`,
      `- Telefon kontaktowy: ${venuePhone}`,
      "",
      `W razie zmian lub pytań zadzwoń pod numer ${venuePhone} lub napisz na ${replyTo}.`,
    ];

    return { subject, html, text: textLines.join("\n") };
  }

  // status === "rejected"
  const subject = "Informacja o rezerwacji – Bistro Poleczka";
  const summaryHtml = renderSummaryRows([
    { label: "Wnioskowana data", value: date },
    { label: "Godzina", value: time },
    { label: "Liczba osób", value: guests },
  ]);

  const reasonBlockHtml = reason
    ? `<div style="background-color:#FFFDF6;border-left:4px solid #CA5254;padding:12px 16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;color:#960C3F;">Informacja od obsługi</p>
        <p style="margin:0;font-size:14px;line-height:1.55;color:#2D1A22;">${escapeHtml(reason)}</p>
      </div>`
    : "";

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
      Dzień dobry <strong>${safeName}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2D1A22;">
      dziękujemy za zainteresowanie wizytą w <strong>Bistro Poleczka</strong>.
      Niestety w wybranym terminie nie mamy możliwości przyjęcia rezerwacji.
    </p>
    ${summaryHtml}
    ${reasonBlockHtml}
    <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#2D1A22;">
      Przepraszamy za niedogodności i serdecznie zapraszamy do wybrania innego terminu.
      Aby wspólnie ustalić dogodną godzinę, zadzwoń do nas:
      <a href="tel:${telHref}" style="color:#960C3F;font-weight:700;text-decoration:none;">${safePhone}</a>
      lub odpisz na <a href="mailto:${safeReplyTo}" style="color:#CA5254;font-weight:600;text-decoration:none;">${safeReplyTo}</a>.
    </p>`;

  const html = renderEmailShell({
    badge: "Brak wolnych stolików",
    heading: "Nie możemy przyjąć rezerwacji w wybranym terminie",
    accentColor: "#960C3F",
    bodyHtml,
    venuePhone,
    replyTo,
  });

  const textLines = [
    `Dzień dobry ${name},`,
    "",
    `Dziękujemy za zainteresowanie Bistro Poleczka. Niestety nie możemy przyjąć rezerwacji w terminie ${date} o godz. ${time} (${guests}).`,
    ...(reason ? ["", `Informacja od obsługi: ${reason}`] : []),
    "",
    `Przepraszamy za niedogodności. Aby ustalić inny termin, skontaktuj się z nami telefonicznie: ${venuePhone} lub mailowo: ${replyTo}.`,
    `Adres: ${VENUE_ADDRESS}`,
  ];

  return { subject, html, text: textLines.join("\n") };
}

/**
 * Sends a transactional reservation email via the official Resend SDK.
 */
export async function sendReservationEmail(
  options: SendReservationEmailOptions
): Promise<EmailSendResult> {
  const to = options.to?.trim() || "";
  if (!isValidEmail(to)) {
    console.warn("[MAIL] Pomijam wysyłkę e-mail: nieprawidłowy lub pusty adres odbiorcy.");
    return {
      ok: false,
      sent: false,
      skipped: true,
      error: "Invalid or empty recipient email",
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim() || DEFAULT_MAIL_FROM;
  const replyTo = process.env.MAIL_REPLY_TO?.trim() || DEFAULT_MAIL_REPLY_TO;
  const { subject, html, text } = buildReservationEmailContent(options, { replyTo });

  if (!apiKey) {
    console.error(
      `[MAIL] RESEND_API_KEY is not set — skipping email (${options.status}) to ${to} | Subject: ${subject}`
    );
    return {
      ok: false,
      sent: false,
      error: "RESEND_API_KEY is not configured",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject,
      html,
      text,
    });

    if (error) {
      const errMsg = `${error.name || "ResendError"}: ${error.message}`;
      console.error("[MAIL] Resend API error:", error);
      return {
        ok: false,
        sent: false,
        error: errMsg,
      };
    }

    return {
      ok: true,
      sent: true,
      id: data?.id,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[MAIL] Unexpected Resend exception:", err);
    return {
      ok: false,
      sent: false,
      error: errMsg,
    };
  }
}
