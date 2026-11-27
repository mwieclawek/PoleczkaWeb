import { NextRequest, NextResponse } from "next/server";
import { processReservationStatusChange } from "@/lib/reservation-notifications";
import type { ReservationStoreItem } from "@/lib/reservations-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      id?: unknown;
      status?: unknown;
      reason?: unknown;
      reservation?: unknown;
    } | null;

    const rawId = body?.id;
    const rawStatus = body?.status;

    const normalizedStatus =
      rawStatus === "cancelled"
        ? "rejected"
        : rawStatus === "confirmed" || rawStatus === "rejected"
        ? rawStatus
        : null;

    if (!rawId || !normalizedStatus) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const fallbackReservation =
      body?.reservation && typeof body.reservation === "object"
        ? (body.reservation as Partial<ReservationStoreItem>)
        : undefined;

    const result = await processReservationStatusChange({
      id: String(rawId),
      status: normalizedStatus,
      reason: typeof body?.reason === "string" ? body.reason : undefined,
      source: "admin_panel",
      fallbackReservation,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Failed to update reservation status API:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Server Error",
      },
      { status: 500 }
    );
  }
}
