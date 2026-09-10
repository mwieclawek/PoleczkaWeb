import { doc, setDoc, getDocs, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import fs from "fs";
import path from "path";

export interface ReservationStoreItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "reservations.json");
const TMP_FILE_PATH = "/tmp/poleczka_reservations.json";

function loadDiskReservations(): ReservationStoreItem[] {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // Ignore read error
  }
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = fs.readFileSync(TMP_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
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
  } catch (err) {
    try {
      fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    } catch (e) {
      // Ignore write errors in restricted environments
    }
  }
}

// In-memory server cache backed by disk file
const globalStore = globalThis as unknown as {
  __poleczka_reservations__?: ReservationStoreItem[];
};

function getOrInitStore(): ReservationStoreItem[] {
  if (!globalStore.__poleczka_reservations__ || globalStore.__poleczka_reservations__.length === 0) {
    globalStore.__poleczka_reservations__ = loadDiskReservations();
  }
  return globalStore.__poleczka_reservations__;
}

export function saveReservationToStore(item: ReservationStoreItem): ReservationStoreItem {
  const store = getOrInitStore();
  const existingIndex = store.findIndex(
    (r) =>
      r.id === item.id ||
      (r.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
        r.phone.trim() === item.phone.trim() &&
        r.date === item.date &&
        r.time === item.time)
  );

  const updatedItem: ReservationStoreItem = {
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    store[existingIndex] = {
      ...store[existingIndex],
      ...updatedItem,
      // Retain confirmed or rejected status if previously set
      status: store[existingIndex].status !== "pending" ? store[existingIndex].status : updatedItem.status,
    };
  } else {
    store.unshift(updatedItem);
  }

  // Cap at 500 items
  if (store.length > 500) {
    store.pop();
  }

  saveDiskReservations(store);

  // Attempt async write to Firestore
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
    ).catch((err) => console.warn("Firestore async server write warning:", err?.message));
  } catch (err) {
    console.warn("Firestore sync server write warning:", err);
  }

  return updatedItem;
}

export async function getAllReservationsFromStore(): Promise<ReservationStoreItem[]> {
  const store = getOrInitStore();

  try {
    const snap = await getDocs(collection(db, "reservations"));
    const firestoreItems: ReservationStoreItem[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ReservationStoreItem, "id">),
    }));

    // Merge Firestore items into in-memory store
    for (const item of firestoreItems) {
      const idx = store.findIndex(
        (r) =>
          r.id === item.id ||
          (r.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
            r.phone.trim() === item.phone.trim() &&
            r.date === item.date &&
            r.time === item.time)
      );

      if (idx >= 0) {
        // Update status if Firestore has updated status
        if (item.status && item.status !== store[idx].status) {
          store[idx].status = item.status;
        }
      } else {
        store.push(item);
      }
    }
  } catch (err) {
    console.warn("Firestore fetch error, returning in-memory store:", err);
  }

  saveDiskReservations(store);

  // Sort descending by date/createdAt
  return [...store].sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));
}

export function updateReservationStatusInStore(id: string, status: "confirmed" | "rejected") {
  const store = getOrInitStore();
  const item = store.find((r) => r.id === id);
  if (item) {
    item.status = status;
  }

  saveDiskReservations(store);

  try {
    updateDoc(doc(db, "reservations", id), { status }).catch(() => {
      setDoc(doc(db, "reservations", id), { status }, { merge: true }).catch(() => {});
    });
  } catch {}
}

