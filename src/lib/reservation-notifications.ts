import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendReservationEmail, type EmailSendResult } from "@/lib/mail";
import { sendReservationSms, type SmsSendResult } from "@/lib/sms";
import {
  getReservationFromStoreById,
  patchReservationInMemoryAndDisk,
  upsertReservationInMemoryAndDisk,
  type ReservationNotifications,
  type ReservationStatus,
  type ReservationStoreItem,
} from "@/lib/reservations-store";
import { sendTelegramNotification } from "@/lib/telegram";

export interface NewReservationInput {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
}

export interface NewReservationResult {
  ok: boolean;
  id: string;
  persistedToFirestore: boolean;
  telegramSent: boolean;
  emailSent: boolean;
  skippedDuplicateEmail: boolean;
  notifications: ReservationNotifications;
}

export interface StatusChangeInput {
  id: string;
  status: "confirmed" | "rejected";
  reason?: string;
  source: "admin_panel" | "telegram_webhook" | "script";
  fallbackReservation?: Partial<ReservationStoreItem>;
}

export interface StatusChangeResult {
  ok: boolean;
  id: string;
  status: "confirmed" | "rejected";
  skippedDuplicate: boolean;
  emailSent: boolean;
  smsSent: boolean;
  smsDryRun?: boolean;
  notifications: ReservationNotifications;
}

const FIRESTORE_TIMEOUT_MS = 4000;
const FIRESTORE_TX_TIMEOUT_MS = 5000;

const globalLocks = globalThis as unknown as {
  __poleczka_reservation_locks__?: Map<string, Promise<unknown>>;
};

function getLockMap(): Map<string, Promise<unknown>> {
  if (!globalLocks.__poleczka_reservation_locks__) {
    globalLocks.__poleczka_reservation_locks__ = new Map();
  }
  return globalLocks.__poleczka_reservation_locks__;
}

/**
 * Serializes operations per reservation ID on the current server instance
 * to prevent concurrent double-clicks or parallel webhooks from sending duplicates.
 */
async function withReservationLock<T>(
  id: string,
  fn: () => Promise<T>
): Promise<T> {
  const locks = getLockMap();
  const previous = locks.get(id) ?? Promise.resolve();
  const run = previous.catch(() => undefined).then(fn);
  const tracked = run.catch(() => undefined);
  locks.set(id, tracked);
  try {
    return await run;
  } finally {
    if (locks.get(id) === tracked) {
      locks.delete(id);
    }
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function sanitizeNotifications(
  input?: Partial<ReservationNotifications> | null
): ReservationNotifications {
  const out: ReservationNotifications = {};
  if (!input) return out;
  if (input.telegramSentAt !== undefined) out.telegramSentAt = input.telegramSentAt;
  if (input.receivedEmailSentAt !== undefined) {
    out.receivedEmailSentAt = input.receivedEmailSentAt;
  }
  if (input.decisionStatus !== undefined) out.decisionStatus = input.decisionStatus;
  if (input.decisionEmailSentAt !== undefined) {
    out.decisionEmailSentAt = input.decisionEmailSentAt;
  }
  if (input.decisionSmsSentAt !== undefined) {
    out.decisionSmsSentAt = input.decisionSmsSentAt;
  }
  if (input.lastError !== undefined) out.lastError = input.lastError;
  if (input.updatedAt !== undefined) out.updatedAt = input.updatedAt;
  return out;
}

function extractNotificationsFromFirestore(
  raw: Record<string, unknown> | null | undefined
): ReservationNotifications {
  if (!raw || typeof raw.notifications !== "object" || raw.notifications === null) {
    return {};
  }
  return sanitizeNotifications(raw.notifications as Partial<ReservationNotifications>);
}

function parseReservationStatus(value: unknown): ReservationStatus | undefined {
  if (value === "pending" || value === "confirmed" || value === "rejected") {
    return value;
  }
  return undefined;
}

function mergeReservationData(
  id: string,
  fsData: Record<string, unknown> | null | undefined,
  storeItem: ReservationStoreItem | undefined,
  fallback?: Partial<ReservationStoreItem>
): ReservationStoreItem {
  const pickStr = (
    fsVal: unknown,
    storeVal: string | undefined,
    fbVal: string | undefined
  ): string => {
    if (typeof fsVal === "string" && fsVal.trim()) return fsVal;
    if (storeVal && storeVal.trim()) return storeVal;
    if (fbVal && fbVal.trim()) return fbVal;
    return "";
  };

  const fsStatus = parseReservationStatus(fsData?.status);
  const status: ReservationStatus =
    fsStatus || storeItem?.status || fallback?.status || "pending";

  const notes =
    typeof fsData?.notes === "string"
      ? fsData.notes
      : storeItem?.notes ?? fallback?.notes ?? "";

  const rejectionReason =
    typeof fsData?.rejectionReason === "string"
      ? fsData.rejectionReason
      : storeItem?.rejectionReason ?? fallback?.rejectionReason;

  return {
    id,
    name: pickStr(fsData?.name, storeItem?.name, fallback?.name),
    phone: pickStr(fsData?.phone, storeItem?.phone, fallback?.phone),
    email: pickStr(fsData?.email, storeItem?.email, fallback?.email),
    date: pickStr(fsData?.date, storeItem?.date, fallback?.date),
    time: pickStr(fsData?.time, storeItem?.time, fallback?.time),
    guests: pickStr(fsData?.guests, storeItem?.guests, fallback?.guests),
    notes,
    ...(rejectionReason ? { rejectionReason } : {}),
    status,
    notifications: sanitizeNotifications({
      ...storeItem?.notifications,
      ...extractNotificationsFromFirestore(fsData),
    }),
  };
}

/**
 * Handles a newly submitted reservation:
 * 1. Persists reservation in server store and Firestore (`merge: true`).
 * 2. Sends Telegram notification to staff (idempotent per reservation ID).
 * 3. Sends ONLY an e-mail confirmation of receipt to the guest (no SMS on pending).
 */
export async function processNewReservation(
  input: NewReservationInput
): Promise<NewReservationResult> {
  const id = input.id.trim();

  return withReservationLock(id, async () => {
    const storeExisting = getReservationFromStoreById(id);
    let fsExisting: Record<string, unknown> | null = null;

    try {
      const snap = await withTimeout(
        getDoc(doc(db, "reservations", id)),
        FIRESTORE_TIMEOUT_MS,
        "Firestore getDoc (new reservation)"
      );
      if (snap.exists()) {
        fsExisting = snap.data() as Record<string, unknown>;
      }
    } catch (err) {
      console.error("[Notifications] Firestore getDoc failed on new reservation:", err);
    }

    const existingNotifications = sanitizeNotifications({
      ...storeExisting?.notifications,
      ...extractNotificationsFromFirestore(fsExisting),
    });

    const existingStatus =
      parseReservationStatus(fsExisting?.status) || storeExisting?.status;
    const status: ReservationStatus =
      existingStatus && existingStatus !== "pending" ? existingStatus : "pending";

    const currentNotifications: ReservationNotifications = {
      ...existingNotifications,
      updatedAt: new Date().toISOString(),
    };

    const itemToStore: ReservationStoreItem = {
      id,
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      date: input.date.trim(),
      time: input.time.trim(),
      guests: input.guests.trim(),
      notes: input.notes?.trim() || "",
      status,
      notifications: currentNotifications,
    };

    upsertReservationInMemoryAndDisk(itemToStore);

    let persistedToFirestore = false;
    try {
      const firestorePayload: Record<string, unknown> = {
        name: itemToStore.name,
        phone: itemToStore.phone,
        email: itemToStore.email,
        date: itemToStore.date,
        time: itemToStore.time,
        guests: itemToStore.guests,
        notes: itemToStore.notes || "",
        status: itemToStore.status,
        notifications: sanitizeNotifications(currentNotifications),
      };
      if (!fsExisting?.createdAt) {
        firestorePayload.createdAt = serverTimestamp();
      }

      await withTimeout(
        setDoc(doc(db, "reservations", id), firestorePayload, { merge: true }),
        FIRESTORE_TIMEOUT_MS,
        "Firestore setDoc (new reservation)"
      );
      persistedToFirestore = true;
    } catch (err) {
      console.error("[Notifications] Firestore setDoc failed on new reservation:", err);
    }

    const errors: string[] = [];

    // 1. Telegram notification to restaurant staff
    if (!currentNotifications.telegramSentAt) {
      try {
        const tgOk = await sendTelegramNotification({
          id: itemToStore.id,
          name: itemToStore.name,
          phone: itemToStore.phone,
          email: itemToStore.email,
          date: itemToStore.date,
          time: itemToStore.time,
          guests: itemToStore.guests,
          notes: itemToStore.notes,
        });
        if (tgOk) {
          currentNotifications.telegramSentAt = new Date().toISOString();
        } else {
          errors.push("telegram: send failed");
        }
      } catch (err) {
        console.error("[Notifications] Telegram error on new reservation:", err);
        errors.push(
          `telegram: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // 2. Guest pending receipt e-mail (ONLY email on pending; NO SMS)
    let skippedDuplicateEmail = false;
    if (currentNotifications.receivedEmailSentAt) {
      skippedDuplicateEmail = true;
    } else {
      try {
        const mailRes = await sendReservationEmail({
          to: itemToStore.email,
          name: itemToStore.name,
          date: itemToStore.date,
          time: itemToStore.time,
          guests: itemToStore.guests,
          notes: itemToStore.notes,
          status: "pending",
        });

        if (mailRes.sent) {
          currentNotifications.receivedEmailSentAt = new Date().toISOString();
        } else if (mailRes.error && !mailRes.skipped) {
          errors.push(`pending_email: ${mailRes.error}`);
        }
      } catch (err) {
        console.error("[Notifications] Pending email exception:", err);
        errors.push(
          `pending_email: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    currentNotifications.lastError =
      errors.length > 0 ? errors.join("; ") : null;
    currentNotifications.updatedAt = new Date().toISOString();

    patchReservationInMemoryAndDisk(id, {
      notifications: currentNotifications,
    });

    try {
      await withTimeout(
        setDoc(
          doc(db, "reservations", id),
          { notifications: sanitizeNotifications(currentNotifications) },
          { merge: true }
        ),
        FIRESTORE_TIMEOUT_MS,
        "Firestore setDoc (pending notifications)"
      );
    } catch (err) {
      console.error(
        "[Notifications] Firestore notifications update failed on new reservation:",
        err
      );
    }

    return {
      ok: true,
      id,
      persistedToFirestore,
      telegramSent: Boolean(currentNotifications.telegramSentAt),
      emailSent: Boolean(currentNotifications.receivedEmailSentAt),
      skippedDuplicateEmail,
      notifications: currentNotifications,
    };
  });
}

/**
 * Single source of truth for reservation status changes (admin panel & Telegram webhook):
 * - Atomically claims status transition & enforces idempotency (prevents duplicate emails/SMS).
 * - Sends confirmation/rejection e-mail (Resend) and SMS (Zadarma) with mandatory `await`.
 * - Isolates channel failures so status persistence never breaks.
 */
export async function processReservationStatusChange(
  input: StatusChangeInput
): Promise<StatusChangeResult> {
  const id = input.id.trim();
  const targetStatus = input.status;
  const cleanReason = input.reason?.trim() || undefined;

  return withReservationLock(id, async () => {
    const reservationRef = doc(db, "reservations", id);
    const claimTimeIso = new Date().toISOString();

    let alreadyProcessed = false;
    let reservation: ReservationStoreItem | null = null;
    let previousNotifications: ReservationNotifications = {};

    try {
      const txResult = await withTimeout(
        runTransaction(db, async (tx) => {
          const snap = await tx.get(reservationRef);
          const fsData = snap.exists()
            ? (snap.data() as Record<string, unknown>)
            : null;
          const storeItem = getReservationFromStoreById(id);

          const merged = mergeReservationData(
            id,
            fsData,
            storeItem,
            input.fallbackReservation
          );
          const existingStatus =
            parseReservationStatus(fsData?.status) || storeItem?.status;
          const existingNotifications = sanitizeNotifications({
            ...storeItem?.notifications,
            ...extractNotificationsFromFirestore(fsData),
          });

          if (
            existingStatus === targetStatus &&
            existingNotifications.decisionStatus === targetStatus
          ) {
            return {
              alreadyProcessed: true,
              reservation: merged,
              notifications: existingNotifications,
            };
          }

          const claimedNotifications = sanitizeNotifications({
            ...existingNotifications,
            decisionStatus: targetStatus,
            updatedAt: claimTimeIso,
          });

          const txWritePayload: Record<string, unknown> = {
            status: targetStatus,
            updatedAt: serverTimestamp(),
            notifications: claimedNotifications,
          };

          if (cleanReason) {
            txWritePayload.rejectionReason = cleanReason;
          }

          if (!snap.exists()) {
            if (merged.name) txWritePayload.name = merged.name;
            if (merged.phone) txWritePayload.phone = merged.phone;
            if (merged.email) txWritePayload.email = merged.email;
            if (merged.date) txWritePayload.date = merged.date;
            if (merged.time) txWritePayload.time = merged.time;
            if (merged.guests) txWritePayload.guests = merged.guests;
            if (merged.notes) txWritePayload.notes = merged.notes;
          }

          tx.set(reservationRef, txWritePayload, { merge: true });

          return {
            alreadyProcessed: false,
            reservation: merged,
            notifications: claimedNotifications,
          };
        }),
        FIRESTORE_TX_TIMEOUT_MS,
        "Firestore runTransaction (status change)"
      );

      alreadyProcessed = txResult.alreadyProcessed;
      reservation = txResult.reservation;
      previousNotifications = txResult.notifications;
    } catch (err) {
      console.error(
        "[Notifications] Firestore transaction warning, falling back to server store:",
        err
      );

      const storeItem = getReservationFromStoreById(id);
      const merged = mergeReservationData(
        id,
        null,
        storeItem,
        input.fallbackReservation
      );
      const existingNotifications = sanitizeNotifications(
        storeItem?.notifications
      );

      if (
        storeItem?.status === targetStatus &&
        existingNotifications.decisionStatus === targetStatus
      ) {
        alreadyProcessed = true;
        reservation = merged;
        previousNotifications = existingNotifications;
      } else {
        alreadyProcessed = false;
        reservation = merged;
        previousNotifications = sanitizeNotifications({
          ...existingNotifications,
          decisionStatus: targetStatus,
          updatedAt: claimTimeIso,
        });
      }
    }

    // Keep memory/disk store synchronized with claimed state
    if (getReservationFromStoreById(id)) {
      patchReservationInMemoryAndDisk(id, {
        status: targetStatus,
        ...(cleanReason ? { rejectionReason: cleanReason } : {}),
        updatedAt: claimTimeIso,
        notifications: previousNotifications,
      });
    } else if (reservation && (reservation.name || reservation.phone || reservation.email)) {
      upsertReservationInMemoryAndDisk({
        ...reservation,
        status: targetStatus,
        ...(cleanReason ? { rejectionReason: cleanReason } : {}),
        updatedAt: claimTimeIso,
        notifications: previousNotifications,
      });
    }

    if (alreadyProcessed) {
      console.info(
        `[Notifications] Skipping duplicate ${targetStatus} notifications for ${id} (source=${input.source})`
      );
      return {
        ok: true,
        id,
        status: targetStatus,
        skippedDuplicate: true,
        emailSent: false,
        smsSent: false,
        notifications: previousNotifications,
      };
    }

    if (!reservation || (!reservation.email && !reservation.phone)) {
      const missingErr = "Missing reservation contact data";
      console.error(`[Notifications] ${missingErr} for ${id} (source=${input.source})`);
      const missingNotifications = sanitizeNotifications({
        ...previousNotifications,
        decisionStatus: targetStatus,
        lastError: missingErr,
        updatedAt: new Date().toISOString(),
      });

      patchReservationInMemoryAndDisk(id, { notifications: missingNotifications });
      try {
        await withTimeout(
          setDoc(
            reservationRef,
            { status: targetStatus, notifications: missingNotifications },
            { merge: true }
          ),
          FIRESTORE_TIMEOUT_MS,
          "Firestore missing contact notifications"
        );
      } catch (fsErr) {
        console.error("[Notifications] Firestore update failed:", fsErr);
      }

      return {
        ok: true,
        id,
        status: targetStatus,
        skippedDuplicate: false,
        emailSent: false,
        smsSent: false,
        notifications: missingNotifications,
      };
    }

    // Dispatch Email (Resend) and SMS (Zadarma) concurrently with strict failure isolation
    const emailTask = async (): Promise<EmailSendResult> => {
      try {
        return await sendReservationEmail({
          to: reservation.email || "",
          name: reservation.name || "Gościu",
          date: reservation.date || "",
          time: reservation.time || "",
          guests: reservation.guests || "",
          notes: reservation.notes,
          reason: cleanReason || reservation.rejectionReason,
          status: targetStatus,
        });
      } catch (err) {
        console.error("[Notifications] Decision email exception:", err);
        return {
          ok: false,
          sent: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    };

    const smsTask = async (): Promise<SmsSendResult> => {
      try {
        return await sendReservationSms({
          phone: reservation.phone || "",
          date: reservation.date || "",
          time: reservation.time || "",
          guests: reservation.guests || "",
          status: targetStatus,
        });
      } catch (err) {
        console.error("[Notifications] Decision SMS exception:", err);
        return {
          ok: false,
          sent: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    };

    const [emailRes, smsRes] = await Promise.all([emailTask(), smsTask()]);

    const doneIso = new Date().toISOString();
    const errors: string[] = [];

    if (!emailRes.sent && !emailRes.skipped && emailRes.error) {
      errors.push(`email: ${emailRes.error}`);
    }
    if (!smsRes.sent && !smsRes.dryRun && !smsRes.skipped && smsRes.error) {
      errors.push(`sms: ${smsRes.error}`);
    }

    const finalNotifications = sanitizeNotifications({
      ...previousNotifications,
      decisionStatus: targetStatus,
      decisionEmailSentAt: emailRes.sent ? doneIso : null,
      decisionSmsSentAt: smsRes.sent ? doneIso : null,
      lastError: errors.length > 0 ? errors.join("; ") : null,
      updatedAt: doneIso,
    });

    patchReservationInMemoryAndDisk(id, {
      status: targetStatus,
      updatedAt: doneIso,
      notifications: finalNotifications,
    });

    try {
      await withTimeout(
        setDoc(
          reservationRef,
          {
            status: targetStatus,
            notifications: finalNotifications,
          },
          { merge: true }
        ),
        FIRESTORE_TIMEOUT_MS,
        "Firestore final notifications"
      );
    } catch (err) {
      console.error("[Notifications] Firestore final notifications setDoc failed:", err);
    }

    return {
      ok: true,
      id,
      status: targetStatus,
      skippedDuplicate: false,
      emailSent: emailRes.sent,
      smsSent: smsRes.sent,
      smsDryRun: Boolean(smsRes.dryRun),
      notifications: finalNotifications,
    };
  });
}
