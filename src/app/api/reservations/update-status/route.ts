import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendReservationEmail } from "@/lib/mail";
import { updateReservationStatusInStore } from "@/lib/reservations-store";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status || (status !== "confirmed" && status !== "rejected")) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 1. Update in-memory server store immediately
    updateReservationStatusInStore(id, status);

    // 2. Update status in Firestore & send email
    try {
      const reservationRef = doc(db, "reservations", id);
      const snap = await getDoc(reservationRef);

      if (snap.exists()) {
        const data = snap.data();
        await setDoc(reservationRef, { status }, { merge: true });

        if (data.email) {
          await sendReservationEmail({
            to: data.email,
            name: data.name || "Kliencie",
            date: data.date || "",
            time: data.time || "",
            guests: data.guests || "",
            status,
          }).catch((e) => console.warn("Email send error:", e));
        }
      } else {
        await setDoc(reservationRef, { status }, { merge: true });
      }
    } catch (fsErr) {
      console.warn("Firestore status update warning:", fsErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Failed to update reservation status API:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Server Error" },
      { status: 500 }
    );
  }
}
