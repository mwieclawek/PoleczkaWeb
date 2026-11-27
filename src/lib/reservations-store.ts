import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import fs from "fs";
import path from "path";

export type ReservationStatus = "pending" | "confirmed" | "rejected";

export interface ReservationNotifications {
  telegramSentAt?: string | null;
  receivedEmailSentAt?: string | null;
  decisionStatus?: "confirmed" | "rejected" | null;
  decisionEmailSentAt?: string | null;
  decisionSmsSentAt?: string | null;
  lastError?: string | null;
  updatedAt?: string;
}

export interface ReservationStoreItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  rejectionReason?: string;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
  notifications?: ReservationNotifications;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "reservations.json");
const TMP_FILE_PATH = "/tmp/poleczka_reservations.json";

function normalizeTimestampValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function loadDiskReservations(): ReservationStoreItem[] {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed: unknown = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed as ReservationStoreItem[];
    }
  } catch {
    // Ignore read error
  }
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = fs.readFileSync(TMP_FILE_PATH, "utf-8");
      const parsed: unknown = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed as ReservationStoreItem[];
    }
  } catch {
    // Ignore read error
  }
  return [];
}

function saveDiskReservations(items: ReservationStoreItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    } catch {
      // Ignore write errors in restricted environments
    }
  }
}

// In-memory server cache backed by disk file
const globalStore = globalThis as unknown as {
  __poleczka_reservations__?: ReservationStoreItem[];
};

function getOrInitStore(): ReservationStoreItem[] {
  if (
    !globalStore.__poleczka_reservations__ ||
    globalStore.__poleczka_reservations__.length === 0
  ) {
    globalStore.__poleczka_reservations__ = loadDiskReservations();
  }
  return globalStore.__poleczka_reservations__;
}

function findReservationIndex(
  store: ReservationStoreItem[],
  item: Pick<ReservationStoreItem, "id" | "name" | "phone" | "date" | "time">
): number {
  const normName = item.name.trim().toLowerCase();
  const normPhone = item.phone.trim();

  return store.findIndex(
    (r) =>
      r.id === item.id ||
      (Boolean(normName) &&
        Boolean(normPhone) &&
        r.name.trim().toLowerCase() === normName &&
        r.phone.trim() === normPhone &&
        r.date === item.date &&
        r.time === item.time)
  );
}

/**
 * Returns a reservation from the in-memory/disk store by ID.
 */
export function getReservationFromStoreById(
  id: string
): ReservationStoreItem | undefined {
  const store = getOrInitStore();
  return store.find((r) => r.id === id);
}

/**
 * Synchronously upserts a reservation in memory and on disk without triggering Firestore writes.
 */
export function upsertReservationInMemoryAndDisk(
  item: ReservationStoreItem
): ReservationStoreItem {
  const store = getOrInitStore();
  const existingIndex = findReservationIndex(store, item);

  const normalizedCreatedAt = item.createdAt || new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = store[existingIndex];
    const merged: ReservationStoreItem = {
      ...existing,
      ...item,
      createdAt: existing.createdAt || normalizedCreatedAt,
      status: existing.status !== "pending" ? existing.status : item.status,
      notifications:
        existing.notifications || item.notifications
          ? { ...existing.notifications, ...item.notifications }
          : undefined,
    };
    store[existingIndex] = merged;
    saveDiskReservations(store);
    return merged;
  }

  const createdItem: ReservationStoreItem = {
    ...item,
    createdAt: normalizedCreatedAt,
  };
  store.unshift(createdItem);

  if (store.length > 500) {
    store.pop();
  }

  saveDiskReservations(store);
  return createdItem;
}

/**
 * Synchronously patches an existing reservation in memory and on disk without touching Firestore.
 */
export function patchReservationInMemoryAndDisk(
  id: string,
  patch: Partial<ReservationStoreItem>
): ReservationStoreItem | undefined {
  const store = getOrInitStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx < 0) return undefined;

  const existing = store[idx];
  const updated: ReservationStoreItem = {
    ...existing,
    ...patch,
    id: existing.id,
    notifications:
      existing.notifications || patch.notifications
        ? { ...existing.notifications, ...patch.notifications }
        : undefined,
  };
  store[idx] = updated;
  saveDiskReservations(store);
  return updated;
}

export function saveReservationToStore(
  item: ReservationStoreItem
): ReservationStoreItem {
  const updatedItem = upsertReservationInMemoryAndDisk(item);

  // Attempt async write to Firestore for backwards compatibility
  try {
    setDoc(
      doc(db, "reservations", updatedItem.id),
      {
        name: updatedItem.name,
        phone: updatedItem.phone,
        email: updatedItem.email,
        date: updatedItem.date,
        time: updatedItem.time,
        guests: updatedItem.guests,
        notes: updatedItem.notes || "",
        status: updatedItem.status,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    ).catch((err: unknown) =>
      console.warn(
        "Firestore async server write warning:",
        err instanceof Error ? err.message : err
      )
    );
  } catch (err) {
    console.warn("Firestore sync server write warning:", err);
  }

  return updatedItem;
}

export async function getAllReservationsFromStore(): Promise<ReservationStoreItem[]> {
  const store = getOrInitStore();

  try {
    const snap = await getDocs(collection(db, "reservations"));
    const firestoreItems: ReservationStoreItem[] = snap.docs.map((d) => {
      const raw = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        name: typeof raw.name === "string" ? raw.name : "",
        phone: typeof raw.phone === "string" ? raw.phone : "",
        email: typeof raw.email === "string" ? raw.email : "",
        date: typeof raw.date === "string" ? raw.date : "",
        time: typeof raw.time === "string" ? raw.time : "",
        guests: typeof raw.guests === "string" ? raw.guests : "",
        notes: typeof raw.notes === "string" ? raw.notes : undefined,
        rejectionReason:
          typeof raw.rejectionReason === "string"
            ? raw.rejectionReason
            : undefined,
        status:
          raw.status === "confirmed" || raw.status === "rejected"
            ? raw.status
            : "pending",
        createdAt: normalizeTimestampValue(raw.createdAt),
        updatedAt: normalizeTimestampValue(raw.updatedAt),
        notifications:
          raw.notifications && typeof raw.notifications === "object"
            ? (raw.notifications as ReservationNotifications)
            : undefined,
      };
    });

    // Merge Firestore items into in-memory store
    for (const item of firestoreItems) {
      const idx = findReservationIndex(store, item);

      if (idx >= 0) {
        if (item.status && item.status !== store[idx].status) {
          store[idx].status = item.status;
        }
        if (item.notifications) {
          store[idx].notifications = {
            ...store[idx].notifications,
            ...item.notifications,
          };
        }
        if (item.rejectionReason) {
          store[idx].rejectionReason = item.rejectionReason;
        }
        if (item.updatedAt) {
          store[idx].updatedAt = item.updatedAt;
        }
      } else {
        store.push(item);
      }
    }
  } catch (err) {
    console.warn("Firestore fetch error, returning in-memory store:", err);
  }

  saveDiskReservations(store);

  // Sort descending by createdAt/date
  return [...store].sort((a, b) =>
    String(b.createdAt || b.date || "").localeCompare(
      String(a.createdAt || a.date || "")
    )
  );
}

export function updateReservationStatusInStore(
  id: string,
  status: "confirmed" | "rejected"
) {
  patchReservationInMemoryAndDisk(id, {
    status,
    updatedAt: new Date().toISOString(),
  });

  try {
    updateDoc(doc(db, "reservations", id), { status }).catch(() => {
      setDoc(doc(db, "reservations", id), { status }, { merge: true }).catch(
        () => {}
      );
    });
  } catch {
    // Ignore sync errors
  }
}
