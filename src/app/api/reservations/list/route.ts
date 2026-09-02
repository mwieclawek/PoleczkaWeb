import { NextResponse } from "next/server";
import { getAllReservationsFromStore } from "@/lib/reservations-store";

export async function GET() {
  try {
    const reservations = await getAllReservationsFromStore();
    return NextResponse.json({ ok: true, reservations });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
