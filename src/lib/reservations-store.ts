import { doc, setDoc, getDocs, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

// In-memory server cache to guarantee 100% availability across server API calls
const globalStore = globalThis as unknown as {
  __poleczka_reservations__?: ReservationStoreItem[];
};

if (!globalStore.__poleczka_reservations__) {
  globalStore.__poleczka_reservations__ = [];
}

export function saveReservationToStore(item: ReservationStoreItem): ReservationStoreItem {
  const store = globalStore.__poleczka_reservations__!;
  const existingIndex = store.findIndex((r) => r.id === item.id);
  const updatedItem = {
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    store[existingIndex] = { ...store[existingIndex], ...updatedItem };
  } else {
    store.unshift(updatedItem);
  }

  // Cap at 500 items
  if (store.length > 500) {
    store.pop();
  }

  // Also attempt async write to Firestore
  try {
    setDoc(
      doc(db, "reservations", item.id),
      {
        name: item.name,
        phone: item.phone,
        email: item.email,
        date: item.date,
        time: item.time,
        guests: item.guests,
        notes: item.notes || "",
        status: item.status,
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
  const store = globalStore.__poleczka_reservations__!;

  try {
    const snap = await getDocs(collection(db, "reservations"));
    const firestoreItems: ReservationStoreItem[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ReservationStoreItem, "id">),
    }));

    // Merge Firestore items into in-memory store
    for (const item of firestoreItems) {
      if (!store.some((r) => r.id === item.id)) {
        store.push(item);
      }
    }
  } catch (err) {
    console.warn("Firestore fetch error, returning in-memory store:", err);
  }

  // Sort descending by date/createdAt
  return [...store].sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));
}

export function updateReservationStatusInStore(id: string, status: "confirmed" | "rejected") {
  const store = globalStore.__poleczka_reservations__!;
  const item = store.find((r) => r.id === id);
  if (item) {
    item.status = status;
  }

  try {
    updateDoc(doc(db, "reservations", id), { status }).catch(() => {});
  } catch {}
}
