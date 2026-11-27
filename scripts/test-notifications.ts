import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  ZADARMA_SMS_ENDPOINT,
  buildRfc1738QueryString,
  buildReservationSmsText,
  createZadarmaSignature,
  encodeRfc1738,
  formatGuestsCompact,
  isSmsEnabled,
  normalizePhoneNumber,
  sendSms,
  toSingleSegmentSms,
  transliteratePolish,
} from "../src/lib/sms";
import {
  buildReservationEmailContent,
  isValidEmail,
} from "../src/lib/mail";

function testRfc1738EncodingAndQuerySort() {
  assert.equal(
    encodeRfc1738("Hello (Bistro)! *~'"),
    "Hello+%28Bistro%29%21+%2A%7E%27"
  );

  const withoutSender = buildRfc1738QueryString({
    number: "48600111222",
    message: "Test (18:00)",
  });
  assert.equal(withoutSender, "message=Test+%2818%3A00%29&number=48600111222");

  const withSender = buildRfc1738QueryString({
    number: "48600111222",
    caller_id: "Poleczka",
    message: "OK",
  });
  assert.equal(
    withSender,
    "caller_id=Poleczka&message=OK&number=48600111222"
  );
  console.log("[PASS] RFC 1738 encoding and alphabetical query sorting");
}

function testZadarmaSignature() {
  const secret = "test_secret_key_123";
  const paramsStr = buildRfc1738QueryString({
    number: "48600111222",
    message: "Rezerwacja (18:00) POTWIERDZONA",
  });

  const { md5, signString, hmacHex, signature } = createZadarmaSignature(
    paramsStr,
    secret,
    ZADARMA_SMS_ENDPOINT
  );

  const expectedMd5 = crypto.createHash("md5").update(paramsStr).digest("hex");
  const expectedSignString = `/v1/sms/send/${paramsStr}${expectedMd5}`;
  const expectedHmacHex = crypto
    .createHmac("sha1", secret)
    .update(expectedSignString)
    .digest("hex");
  const expectedSignature = Buffer.from(expectedHmacHex, "utf8").toString(
    "base64"
  );
  const wrongBinarySignature = crypto
    .createHmac("sha1", secret)
    .update(expectedSignString)
    .digest("base64");

  assert.equal(md5, expectedMd5);
  assert.equal(signString, expectedSignString);
  assert.match(hmacHex, /^[0-9a-f]{40}$/);
  assert.equal(signature, expectedSignature);
  assert.notEqual(signature, wrongBinarySignature);
  console.log("[PASS] Zadarma API v1 HMAC-SHA1 hex -> Base64 signature");
}

function testPhoneNormalization() {
  assert.equal(normalizePhoneNumber("600 111 222"), "48600111222");
  assert.equal(normalizePhoneNumber("+48 (71) 880-87-08"), "48718808708");
  assert.equal(normalizePhoneNumber("0048 600-111-222"), "48600111222");
  assert.equal(normalizePhoneNumber("+49 151 23456789"), "4915123456789");
  assert.equal(normalizePhoneNumber(""), null);
  assert.equal(normalizePhoneNumber("   "), null);
  assert.equal(normalizePhoneNumber("12345"), null);
  assert.equal(normalizePhoneNumber("abc123456"), null);
  assert.equal(normalizePhoneNumber("1234567890123456"), null);
  console.log("[PASS] Phone number normalization");
}

function testPolishTransliterationAndSmsLength() {
  assert.equal(
    transliteratePolish("ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ – „test”…"),
    'acelnoszz ACELNOSZZ - "test"...'
  );

  assert.equal(formatGuestsCompact("2 osoby"), "2 os.");
  assert.equal(formatGuestsCompact("5 osób"), "5 os.");
  assert.equal(formatGuestsCompact("10+ osób"), "10+ os.");

  const confirmedSms = buildReservationSmsText({
    date: "2026-12-05",
    time: "19:30",
    guests: "4 osoby",
    status: "confirmed",
    venuePhone: "+48 71 880 87 08",
  });
  assert.ok(confirmedSms.length <= 160, `Confirmed SMS too long: ${confirmedSms.length}`);
  assert.match(confirmedSms, /^[\x20-\x7E]+$/);
  assert.ok(confirmedSms.includes("POTWIERDZONA"));
  assert.ok(confirmedSms.includes("4 os."));
  assert.ok(!confirmedSms.includes("osoby os."));
  assert.ok(confirmedSms.includes("ul. Jaracza 77B"));
  assert.ok(confirmedSms.includes("+48 71 880 87 08"));

  const rejectedSms = buildReservationSmsText({
    date: "2026-12-05",
    time: "19:30",
    guests: "10+ osób",
    status: "rejected",
    venuePhone: "+48 71 880 87 08",
  });
  assert.ok(rejectedSms.length <= 160, `Rejected SMS too long: ${rejectedSms.length}`);
  assert.match(rejectedSms, /^[\x20-\x7E]+$/);
  assert.ok(rejectedSms.includes("10+ os."));
  assert.ok(rejectedSms.includes("+48 71 880 87 08"));

  const longInput = "Zażółć gęślą jaźń ".repeat(15);
  const truncated = toSingleSegmentSms(longInput, 160);
  assert.ok(truncated.length <= 160);
  assert.ok(truncated.endsWith("..."));
  assert.match(truncated, /^[\x20-\x7E]+$/);
  console.log("[PASS] Polish transliteration, guest compaction & <=160 GSM-7 SMS");
}

function testEmailTemplatesAndValidation() {
  assert.equal(isValidEmail("jan.kowalski@example.com"), true);
  assert.equal(isValidEmail(" invalid@ "), false);
  assert.equal(isValidEmail(""), false);

  const pending = buildReservationEmailContent(
    {
      name: 'Anna <script>alert("xss")</script>',
      date: "2026-12-10",
      time: "18:00",
      guests: "2 osoby",
      notes: "Stolik przy oknie",
      status: "pending",
    },
    { venuePhone: "+48 71 880 87 08", replyTo: "kontakt@bistropoleczka.pl" }
  );
  assert.equal(
    pending.subject,
    "Otrzymaliśmy prośbę o rezerwację – Bistro Poleczka"
  );
  assert.ok(!pending.html.includes("<script>"));
  assert.ok(pending.html.includes("&lt;script&gt;"));
  assert.ok(pending.html.includes("oczekuje na potwierdzenie"));
  assert.ok(pending.text.includes("Stolik przy oknie"));
  assert.ok(pending.text.includes("mailem i SMS-em"));

  const confirmed = buildReservationEmailContent(
    {
      name: "Anna Kowalska",
      date: "2026-12-10",
      time: "18:00",
      guests: "2 osoby",
      status: "confirmed",
    },
    { venuePhone: "+48 71 880 87 08", replyTo: "kontakt@bistropoleczka.pl" }
  );
  assert.ok(confirmed.html.includes("ul. Stefana Jaracza 77B"));
  assert.ok(confirmed.html.includes("+48 71 880 87 08"));
  assert.ok(confirmed.text.includes("ul. Stefana Jaracza 77B, Wrocław"));

  const rejected = buildReservationEmailContent(
    {
      name: "Anna Kowalska",
      date: "2026-12-10",
      time: "18:00",
      guests: "6 osób",
      reason: "Pełne obłożenie sali w tym dniu.",
      status: "rejected",
    },
    { venuePhone: "+48 71 880 87 08", replyTo: "kontakt@bistropoleczka.pl" }
  );
  assert.ok(rejected.html.includes("Pełne obłożenie sali w tym dniu."));
  assert.ok(rejected.text.includes("Pełne obłożenie sali w tym dniu."));
  assert.ok(rejected.text.includes("+48 71 880 87 08"));
  console.log("[PASS] Resend email templates, HTML escaping & email validation");
}

async function testSmsDryRunAndFlag() {
  assert.equal(
    isSmsEnabled({ NODE_ENV: "development" } as NodeJS.ProcessEnv),
    false
  );
  assert.equal(
    isSmsEnabled({
      NODE_ENV: "production",
      SMS_ENABLED: "false",
      ZADARMA_API_KEY: "k",
      ZADARMA_API_SECRET: "s",
    } as NodeJS.ProcessEnv),
    false
  );
  assert.equal(
    isSmsEnabled({
      NODE_ENV: "development",
      SMS_ENABLED: "true",
    } as NodeJS.ProcessEnv),
    true
  );

  const prevFlag = process.env.SMS_ENABLED;
  process.env.SMS_ENABLED = "false";
  try {
    const dryRes = await sendSms("600 111 222", "Żółć test (18:00)");
    assert.equal(dryRes.ok, true);
    assert.equal(dryRes.sent, false);
    assert.equal(dryRes.dryRun, true);
    assert.equal(dryRes.to, "48600111222");
    assert.equal(dryRes.message, "Zolc test (18:00)");

    const invalidRes = await sendSms("123", "Test");
    assert.equal(invalidRes.ok, false);
    assert.equal(invalidRes.sent, false);
    assert.equal(invalidRes.skipped, true);
  } finally {
    if (prevFlag === undefined) {
      delete process.env.SMS_ENABLED;
    } else {
      process.env.SMS_ENABLED = prevFlag;
    }
  }
  console.log("[PASS] SMS_ENABLED flag and dry-run dispatch");
}

async function main() {
  testRfc1738EncodingAndQuerySort();
  testZadarmaSignature();
  testPhoneNormalization();
  testPolishTransliterationAndSmsLength();
  testEmailTemplatesAndValidation();
  await testSmsDryRunAndFlag();
  console.log("\nAll notification checks passed!");
}

main().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
