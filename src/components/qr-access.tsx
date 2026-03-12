"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabase";
import { QR_ACCESS_VALUE, PROPERTY_NAME } from "@/lib/constants";
import { KeyRound, Lock } from "lucide-react";

export function QRAccess() {
  const [status, setStatus] = useState<"loading" | "active" | "no-booking">("loading");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setStatus("no-booking");
      return;
    }

    // Check if guest has a linked active booking with valid dates
    const today = new Date().toISOString().slice(0, 10);
    const { data: booking } = await supabase
      .from("lodgify_bookings")
      .select("id, guest_name, check_in, check_out, status")
      .eq("guest_id", session.user.id)
      .in("status", ["active", "checked_in"])
      .lte("check_in", today)
      .gte("check_out", today)
      .limit(1)
      .single();

    if (booking) {
      setGuestName(booking.guest_name);
      setStatus("active");
    } else {
      setStatus("no-booking");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-[310px] w-[310px] items-center justify-center rounded-2xl bg-white shadow-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  if (status === "no-booking") {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-[310px] w-[310px] flex-col items-center justify-center rounded-2xl bg-white shadow-lg">
          <Lock className="mb-3 h-12 w-12 text-gray-300" />
          <p className="px-6 text-center text-sm font-medium text-gray-400">
            Acceso bloqueado
          </p>
          <p className="mt-1 px-6 text-center text-xs text-gray-400">
            Ingresa tu código de reserva para desbloquear
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            Acceso al Estacionamiento
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Activa tu acceso con el código de tu reserva
          </p>
        </div>

        <a
          href="/huespedes"
          className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <KeyRound className="h-4 w-4" />
          Ingresar código
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-2xl bg-white p-5 shadow-lg">
        <QRCode
          value={QR_ACCESS_VALUE}
          size={260}
          level="H"
          bgColor="#ffffff"
          fgColor="#1a1a2e"
        />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Acceso al Estacionamiento
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Muestra este código QR a la cámara de la reja para ingresar
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-success" />
        <span className="text-xs font-medium text-success">
          {guestName ? `${guestName} — ` : ""}{PROPERTY_NAME} — Acceso activo
        </span>
      </div>
    </div>
  );
}
