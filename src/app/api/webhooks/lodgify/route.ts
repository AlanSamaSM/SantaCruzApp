import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, generateAccessCode } from "@/lib/server";

/**
 * POST /api/webhooks/lodgify?secret=LODGIFY_WEBHOOK_SECRET
 *
 * Receives booking_new / booking_change events from Lodgify.
 * Stores the booking + generates an access code.
 * Does NOT send any emails — admin shares the code manually.
 */
export async function POST(request: NextRequest) {
  // 1. Verify webhook secret (Lodgify doesn't sign payloads)
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.LODGIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse payload
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action as string | undefined;
  if (!action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  // Only handle booking-related events
  const bookingActions = [
    "booking_new",
    "booking_change",
    "booking_booked",
    "booking_tentative",
    "booking_declined",
    "booking_cancelled",
  ];

  if (!bookingActions.includes(action)) {
    return NextResponse.json({ ok: true, skipped: action });
  }

  // 3. Extract booking + guest data
  const booking = body.booking as Record<string, unknown> | undefined;
  const guest = body.guest as Record<string, unknown> | undefined;

  if (!booking || !booking.id) {
    return NextResponse.json({ error: "Missing booking data" }, { status: 400 });
  }

  const lodgifyBookingId = booking.id as number;
  const dateArrival = (booking.date_arrival as string)?.slice(0, 10) ?? "";
  const dateDeparture = (booking.date_departure as string)?.slice(0, 10) ?? "";
  const bookingStatus = booking.status as string ?? "";
  const source = (booking.source_text as string) ?? (booking.source as string) ?? "";

  // Room type name (first room type if available)
  const roomTypes = booking.room_types as Array<{ name?: string }> | undefined;
  const suiteType = roomTypes?.[0]?.name ?? "";

  const guestName = (guest?.name as string) ?? "";
  const guestEmail = (guest?.email as string) ?? "";
  const guestPhone = (guest?.phone_number as string) ?? "";

  // 4. Map Lodgify status to our status
  let status = "active";
  if (action === "booking_declined" || action === "booking_cancelled" || bookingStatus === "Declined") {
    status = "cancelled";
  }

  // 5. Upsert into lodgify_bookings
  const supabase = getServerSupabase();

  // Check if booking already exists
  const { data: existing } = await supabase
    .from("lodgify_bookings")
    .select("id, access_code")
    .eq("lodgify_booking_id", lodgifyBookingId)
    .single();

  if (existing) {
    // Update existing booking
    await supabase
      .from("lodgify_bookings")
      .update({
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        suite_type: suiteType,
        check_in: dateArrival,
        check_out: dateDeparture,
        status,
        lodgify_source: source,
      })
      .eq("id", existing.id);

    return NextResponse.json({
      ok: true,
      action,
      booking_id: lodgifyBookingId,
      access_code: existing.access_code,
      updated: true,
    });
  }

  // New booking — generate access code
  const accessCode = generateAccessCode();

  const { error } = await supabase.from("lodgify_bookings").insert({
    lodgify_booking_id: lodgifyBookingId,
    access_code: accessCode,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    suite_type: suiteType,
    check_in: dateArrival,
    check_out: dateDeparture,
    status,
    lodgify_source: source,
  });

  if (error) {
    console.error("Lodgify webhook insert error:", error);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    action,
    booking_id: lodgifyBookingId,
    access_code: accessCode,
    created: true,
  });
}
