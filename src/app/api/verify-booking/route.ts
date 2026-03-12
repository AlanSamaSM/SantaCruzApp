import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/server";

/**
 * POST /api/verify-booking
 * Body: { code: "SCX-XXXXXX" }
 *
 * Verifies an access code, returns booking data if valid + active.
 * Used by the guest login flow to validate before creating their account.
 */
export async function POST(request: NextRequest) {
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  const supabase = getServerSupabase();

  const { data: booking, error } = await supabase
    .from("lodgify_bookings")
    .select("id, guest_name, guest_email, guest_phone, suite_type, check_in, check_out, status, guest_id")
    .eq("access_code", code)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Código no válido" }, { status: 404 });
  }

  // Check booking is active
  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Esta reserva fue cancelada" }, { status: 410 });
  }

  // Check dates: allow access from 1 day before check-in to 1 day after check-out
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(booking.check_in + "T00:00:00");
  const checkOut = new Date(booking.check_out + "T00:00:00");
  checkIn.setDate(checkIn.getDate() - 1);
  checkOut.setDate(checkOut.getDate() + 1);

  if (today < checkIn || today > checkOut) {
    return NextResponse.json({
      error: "Tu reserva no está activa en estas fechas",
      check_in: booking.check_in,
      check_out: booking.check_out,
    }, { status: 403 });
  }

  // Already linked to a guest account?
  const alreadyLinked = !!booking.guest_id;

  return NextResponse.json({
    ok: true,
    booking: {
      id: booking.id,
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      guest_phone: booking.guest_phone,
      suite_type: booking.suite_type,
      check_in: booking.check_in,
      check_out: booking.check_out,
      already_linked: alreadyLinked,
    },
  });
}
