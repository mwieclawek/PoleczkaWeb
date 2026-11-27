import { NextRequest, NextResponse } from "next/server";
import { processNewReservation } from "@/lib/reservation-notifications";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Record<string, unknown> | null;

    if (!payload || !payload.id || !payload.name) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const result = await processNewReservation({
      id: String(payload.id),
      name: String(payload.name),
      phone: String(payload.phone || ""),
      email: String(payload.email || ""),
      date: String(payload.date || ""),
      time: String(payload.time || ""),
      guests: String(payload.guests || ""),
      notes: typeof payload.notes === "string" ? payload.notes : "",
    });

    return NextResponse.json({
      ...result,
      telegram: result.telegramSent,
    });
  } catch (err: unknown) {
    console.error("Telegram & notification API error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
