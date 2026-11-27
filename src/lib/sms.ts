import crypto from "node:crypto";

export const ZADARMA_API_BASE = "https://api.zadarma.com";
export const ZADARMA_SMS_ENDPOINT = "/v1/sms/send/";
export const DEFAULT_VENUE_PHONE = "+48 71 880 87 08";

export interface SmsSendResult {
  ok: boolean;
  sent: boolean;
  dryRun?: boolean;
  skipped?: boolean;
  to?: string;
  message?: string;
  error?: string;
}

export interface ReservationSmsOptions {
  phone: string;
  date: string;
  time: string;
  guests: string;
  status: "confirmed" | "rejected";
  venuePhone?: string;
}

const POLISH_CHAR_MAP: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ź: "Z",
  Ż: "Z",
};

const GSM7_EXTENDED_REPLACEMENTS: Record<string, string> = {
  "^": " ",
  "{": "(",
  "}": ")",
  "\\": "/",
  "[": "(",
  "~": "-",
  "]": ")",
  "|": "/",
  "€": "EUR",
};

/**
 * Encodes a string using RFC 1738 rules matching PHP's `urlencode` / `http_build_query(..., PHP_QUERY_RFC1738)`
 * so Zadarma's server-side signature verification receives the exact same payload string.
 */
export function encodeRfc1738(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Sorts request parameters alphabetically by key and serializes them into an RFC 1738 query string.
 */
export function buildRfc1738QueryString(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${encodeRfc1738(key)}=${encodeRfc1738(params[key])}`)
    .join("&");
}

/**
 * Computes the Zadarma API v1 authorization signature.
 * Note: Zadarma requires Base64 encoding of the lowercase HMAC-SHA1 hex string, not raw binary bytes.
 */
export function createZadarmaSignature(
  paramsStr: string,
  secret: string,
  endpointPath: string = ZADARMA_SMS_ENDPOINT
): { md5: string; signString: string; hmacHex: string; signature: string } {
  const md5 = crypto.createHash("md5").update(paramsStr).digest("hex");
  const signString = `${endpointPath}${paramsStr}${md5}`;
  const hmacHex = crypto.createHmac("sha1", secret).update(signString).digest("hex");
  const signature = Buffer.from(hmacHex, "utf8").toString("base64");
  return { md5, signString, hmacHex, signature };
}

/**
 * Normalizes a phone number to international digits without `+` (e.g. `48600111222`).
 * Prepends `48` for 9-digit Polish local numbers and returns `null` for invalid inputs.
 */
export function normalizePhoneNumber(rawPhone: string | undefined | null): string | null {
  if (!rawPhone) return null;
  const trimmed = rawPhone.trim();
  if (!trimmed) return null;

  let cleaned = trimmed.replace(/[\s\-–—().+/]/g, "");
  if (cleaned.startsWith("00") && cleaned.length >= 11) {
    cleaned = cleaned.slice(2);
  }

  if (!/^\d+$/.test(cleaned)) {
    return null;
  }

  if (cleaned.length === 9) {
    cleaned = `48${cleaned}`;
  }

  if (cleaned.length < 9 || cleaned.length > 15) {
    return null;
  }

  return cleaned;
}

/**
 * Transliterates Polish diacritics and typographic punctuation to plain ASCII characters.
 */
export function transliteratePolish(text: string): string {
  const mapped = text
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (ch) => POLISH_CHAR_MAP[ch] ?? ch)
    .replace(/[–—−]/g, "-")
    .replace(/[„”"«»]/g, '"')
    .replace(/[’‘‚]/g, "'")
    .replace(/…/g, "...")
    .replace(/\u00A0/g, " ");

  return mapped.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Converts text into a single-segment GSM-7 safe ASCII SMS (max 160 chars by default).
 */
export function toSingleSegmentSms(text: string, maxLength = 160): string {
  const transliterated = transliteratePolish(text);
  const withoutExtended = transliterated.replace(
    /[\^{}\\[~\]|€]/g,
    (ch) => GSM7_EXTENDED_REPLACEMENTS[ch] ?? " "
  );
  const asciiOnly = withoutExtended.replace(/[^\x20-\x7E]/g, " ");
  const collapsed = asciiOnly.replace(/\s+/g, " ").trim();

  if (collapsed.length <= maxLength) {
    return collapsed;
  }

  if (maxLength <= 3) {
    return collapsed.slice(0, Math.max(0, maxLength));
  }

  return `${collapsed.slice(0, maxLength - 3).trimEnd()}...`;
}

/**
 * Compacts guest count labels (e.g. "2 osoby" -> "2 os.", "10+ osób" -> "10+ os.").
 */
export function formatGuestsCompact(guests: string): string {
  const trimmed = guests.trim();
  const leadingMatch = trimmed.match(/^\s*(\d+\+?)/);
  if (leadingMatch) {
    return `${leadingMatch[1]} os.`;
  }

  const stripped = trimmed
    .replace(/\b(osoba|osoby|osob|osób|os\.?)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return stripped ? `${stripped} os.` : "grupa";
}

/**
 * Builds the single-segment GSM-7 SMS content for confirmed or rejected reservations.
 */
export function buildReservationSmsText({
  date,
  time,
  guests,
  status,
  venuePhone,
}: Omit<ReservationSmsOptions, "phone">): string {
  const phone = (venuePhone || process.env.VENUE_PHONE || DEFAULT_VENUE_PHONE).trim();
  const guestsCompact = formatGuestsCompact(guests);

  if (status === "confirmed") {
    return toSingleSegmentSms(
      `Rezerwacja w Bistro Poleczka (${date}, godz. ${time}, ${guestsCompact}) POTWIERDZONA. ul. Jaracza 77B. W razie zmian zadzwon: ${phone}`,
      160
    );
  }

  return toSingleSegmentSms(
    `Bistro Poleczka: Niestety nie mozemy przyjac rezerwacji na ${date} godz. ${time} (${guestsCompact}). Zapraszamy w innym terminie - tel. ${phone}`,
    160
  );
}

/**
 * Determines whether live SMS dispatch is enabled.
 * Defaults to `false` in development or when Zadarma credentials are missing.
 */
export function isSmsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const flag = env.SMS_ENABLED?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;

  return Boolean(
    env.NODE_ENV === "production" &&
      env.ZADARMA_API_KEY?.trim() &&
      env.ZADARMA_API_SECRET?.trim()
  );
}

/**
 * Sends a single-segment SMS through Zadarma API v1 (or logs dry-run when SMS_ENABLED is false).
 */
export async function sendSms(rawPhone: string, rawMessage: string): Promise<SmsSendResult> {
  const normalized = normalizePhoneNumber(rawPhone);
  if (!normalized) {
    console.warn("[SMS] Pomijam wysylke: nieprawidlowy lub pusty numer telefonu.");
    return {
      ok: false,
      sent: false,
      skipped: true,
      error: "Invalid or empty phone number",
    };
  }

  const safeMessage = toSingleSegmentSms(rawMessage, 160);
  if (!safeMessage) {
    return {
      ok: false,
      sent: false,
      skipped: true,
      to: normalized,
      error: "Empty SMS message",
    };
  }

  if (!isSmsEnabled()) {
    console.info(
      `[SMS][DRY-RUN] SMS_ENABLED=false | to=${normalized} (${safeMessage.length}/160 chars): ${safeMessage}`
    );
    return {
      ok: true,
      sent: false,
      dryRun: true,
      to: normalized,
      message: safeMessage,
    };
  }

  const apiKey = process.env.ZADARMA_API_KEY?.trim();
  const apiSecret = process.env.ZADARMA_API_SECRET?.trim();
  const senderId = process.env.ZADARMA_SMS_SENDER_ID?.trim();

  if (!apiKey || !apiSecret) {
    console.error("[SMS] SMS_ENABLED=true, ale brakuje ZADARMA_API_KEY lub ZADARMA_API_SECRET.");
    return {
      ok: false,
      sent: false,
      to: normalized,
      message: safeMessage,
      error: "Missing ZADARMA_API_KEY or ZADARMA_API_SECRET",
    };
  }

  const params: Record<string, string> = {
    message: safeMessage,
    number: normalized,
  };
  if (senderId) {
    params.caller_id = senderId;
  }

  const paramsStr = buildRfc1738QueryString(params);
  const { signature } = createZadarmaSignature(paramsStr, apiSecret, ZADARMA_SMS_ENDPOINT);

  try {
    const response = await fetch(`${ZADARMA_API_BASE}${ZADARMA_SMS_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `${apiKey}:${signature}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paramsStr,
      signal: AbortSignal.timeout(10000),
    });

    const rawBody = await response.text();
    let parsed: { status?: string; message?: string } | null = null;
    try {
      parsed = JSON.parse(rawBody) as { status?: string; message?: string };
    } catch {
      parsed = null;
    }

    if (!response.ok || parsed?.status !== "success") {
      const apiErr = parsed?.message || rawBody || `HTTP ${response.status}`;
      console.error("[SMS] Zadarma send error:", {
        status: response.status,
        to: normalized,
        body: rawBody,
      });
      return {
        ok: false,
        sent: false,
        to: normalized,
        message: safeMessage,
        error: `Zadarma API error: ${apiErr}`,
      };
    }

    return {
      ok: true,
      sent: true,
      to: normalized,
      message: safeMessage,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[SMS] Zadarma request exception:", error);
    return {
      ok: false,
      sent: false,
      to: normalized,
      message: safeMessage,
      error: errMsg,
    };
  }
}

/**
 * Formats and sends a reservation status SMS (confirmed or rejected) via Zadarma.
 */
export async function sendReservationSms(
  options: ReservationSmsOptions
): Promise<SmsSendResult> {
  const text = buildReservationSmsText({
    date: options.date,
    time: options.time,
    guests: options.guests,
    status: options.status,
    venuePhone: options.venuePhone,
  });
  return sendSms(options.phone, text);
}
