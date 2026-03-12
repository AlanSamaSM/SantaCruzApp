import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/server";

/**
 * POST /api/activate-booking
 * Body: { code: "SCX-XXXXXX", user_id: "uuid" }
 *
 * Links a lodgify_booking to a guest account (sets guest_id).
 * Uses server-side anon key which has UPDATE permission via RLS.
 * Also upserts the guest profile with booking data.
 */
export async function POST(request: NextRequest) {
  let body: { code?: string; user_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  const userId = body.user_id?.trim();

  if (!code || !userId) {
    return NextResponse.json({ error: "code and user_id required" }, { status: 400 });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }

  const supabase = getServerSupabase();

  // Verify the booking exists and is linkable
  const { data: booking, error: fetchErr } = await supabase
    .from("lodgify_bookings")
    .select("id, guest_name, guest_email, guest_phone, suite_type, check_in, check_out, status, guest_id")
    .eq("access_code", code)
    .single();

  if (fetchErr || !booking) {
    return NextResponse.json({ error: "Código no válido" }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Reserva cancelada" }, { status: 410 });
  }

  // Link booking to user (anon has UPDATE permission)
  const { error: updateErr } = await supabase
    .from("lodgify_bookings")
    .update({ guest_id: userId })
    .eq("id", booking.id);

  if (updateErr) {
    return NextResponse.json({ error: "No se pudo vincular la reserva" }, { status: 500 });
  }

  // Upsert guest profile (anon may not have INSERT on guests — best effort)
  // The client should also try this with authenticated role
  await supabase
    .from("guests")
    .upsert({
      id: userId,
      full_name: booking.guest_name,
      email: booking.guest_email,
      phone: booking.guest_phone,
      suite_type: booking.suite_type,
      check_in: booking.check_in,
      check_out: booking.check_out,
    }, { onConflict: "id" })
    .select()
    .single();

  return NextResponse.json({
    ok: true,
    booking: {
      guest_name: booking.guest_name,
      check_in: booking.check_in,
      check_out: booking.check_out,
    },
  });
}
