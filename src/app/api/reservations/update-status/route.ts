import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendReservationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status || (status !== "confirmed" && status !== "rejected")) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 1. Fetch reservation from Firestore if not a local fallback ID
    if (!id.startsWith("local_")) {
      const reservationRef = doc(db, "reservations", id);
      const snap = await getDoc(reservationRef);

      if (snap.exists()) {
        const data = snap.data();
        await updateDoc(reservationRef, { status });

        // Send email to client
        if (data.email) {
          await sendReservationEmail({
            to: data.email,
            name: data.name || "Kliencie",
            date: data.date || "",
            time: data.time || "",
            guests: data.guests || "",
            status,
          });
        }
      }
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
