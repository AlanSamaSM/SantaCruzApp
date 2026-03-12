"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { PROPERTY_NAME } from "@/lib/constants";
import type { Session } from "@supabase/supabase-js";

interface BookingData {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  suite_type: string;
  check_in: string;
  check_out: string;
  already_linked: boolean;
}

export default function GuestLoginPage() {
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"code" | "confirm">("code");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingSession, setExistingSession] = useState<Session | null>(null);
  const router = useRouter();

  // If logged in AND has a linked booking, redirect to profile
  // If logged in but NO linked booking, stay here to enter code
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      setExistingSession(session);

      // Check if this user already has a linked booking
      const today = new Date().toISOString().slice(0, 10);
      const { data: linked } = await supabase
        .from("lodgify_bookings")
        .select("id")
        .eq("guest_id", session.user.id)
        .in("status", ["active", "checked_in"])
        .lte("check_in", today)
        .gte("check_out", today)
        .limit(1)
        .maybeSingle();

      if (linked) {
        router.push("/huespedes/perfil");
      }
    });
  }, [router]);

  // Step 1: Verify the access code
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código no válido");
        setLoading(false);
        return;
      }

      setBooking(data.booking);
      setStep("confirm");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  }

  // Step 2: Create guest account (or use existing) and link booking
  async function handleActivate() {
    if (!booking) return;
    setLoading(true);
    setError("");

    let session = existingSession;

    // Only sign up / sign in if not already logged in
    if (!session) {
      const email = booking.guest_email;
      const password = code.trim().toUpperCase();

      // Try sign up first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "guest" } },
      });

      if (signUpError) {
        // If user already exists, try sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError("No se pudo crear tu cuenta. Contacta a recepción.");
          setLoading(false);
          return;
        }
        session = signInData.session;
      } else {
        session = signUpData.session;
      }

      if (!session) {
        setError("No se pudo iniciar sesión. Contacta a recepción.");
        setLoading(false);
        return;
      }
    }

    // Create / update guest profile (authenticated INSERT/UPDATE works via RLS)
    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id")
      .eq("id", session.user.id)
      .single();

    if (existingGuest) {
      await supabase
        .from("guests")
        .update({
          full_name: booking.guest_name,
          email: booking.guest_email,
          phone: booking.guest_phone,
          suite_type: booking.suite_type,
          check_in: booking.check_in,
          check_out: booking.check_out,
        })
        .eq("id", session.user.id);
    } else {
      await supabase.from("guests").insert({
        id: session.user.id,
        full_name: booking.guest_name,
        email: booking.guest_email,
        phone: booking.guest_phone,
        suite_type: booking.suite_type,
        check_in: booking.check_in,
        check_out: booking.check_out,
      });
    }

    // Link booking to guest via server endpoint (anon key has UPDATE permission)
    const linkRes = await fetch("/api/activate-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim(), user_id: session.user.id }),
    });

    if (!linkRes.ok) {
      const linkData = await linkRes.json();
      setError(linkData.error || "No se pudo vincular la reserva.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/huespedes/perfil");
  }

  // Step 2: Confirmation screen
  if (step === "confirm" && booking) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">¡Reserva encontrada!</h1>
            <p className="mt-1 text-sm text-text-secondary">Confirma tus datos para activar tu acceso</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Huésped</span>
                <span className="font-medium text-text-primary">{booking.guest_name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Email</span>
                <span className="font-medium text-text-primary">{booking.guest_email}</span>
              </div>
              {booking.suite_type && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Suite</span>
                  <span className="font-medium text-text-primary">{booking.suite_type}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Check-in</span>
                <span className="font-medium text-text-primary">{booking.check_in}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Check-out</span>
                <span className="font-medium text-text-primary">{booking.check_out}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Activar mi acceso
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              onClick={() => { setStep("code"); setBooking(null); setError(""); }}
              className="mt-3 w-full text-center text-sm text-text-secondary hover:text-text-primary"
            >
              Usar otro código
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Step 1: Enter access code
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-text-primary">Acceso de Huésped</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Ingresa el código de acceso que recibiste de {PROPERTY_NAME}.
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="access-code" className="mb-1 block text-sm font-medium text-text-secondary">
              Código de acceso
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                id="access-code"
                type="text"
                required
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-10 pr-4 text-center text-sm font-mono tracking-widest text-text-primary outline-none transition-colors focus:border-brand-accent uppercase"
                placeholder="SCX-XXXXXX"
                maxLength={10}
              />
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.trim().length < 5}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Verificar código
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[11px] text-text-secondary">
            Recibirás tu código al confirmar tu reserva en {PROPERTY_NAME}.
          </p>
        </form>
      </div>
    </main>
  );
}
