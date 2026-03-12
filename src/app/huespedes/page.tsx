"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";
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
  const { t } = useTranslation();

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
        setError(data.error || t("guest.errorConnection"));
        setLoading(false);
        return;
      }

      setBooking(data.booking);
      setStep("confirm");
    } catch {
      setError(t("guest.errorConnection"));
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
          setError(t("guest.errorAccount"));
          setLoading(false);
          return;
        }
        session = signInData.session;
      } else {
        session = signUpData.session;
      }

      if (!session) {
        setError(t("guest.errorSession"));
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
      setError(linkData.error || t("guest.errorLink"));
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/huespedes/perfil");
  }

  // Step 2: Confirmation screen
  if (step === "confirm" && booking) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-24">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{t("guest.found")}</h1>
            <p className="mt-1 text-base text-text-secondary">{t("guest.confirmHint")}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-text-secondary">{t("guest.name")}</span>
                <span className="font-medium text-text-primary">{booking.guest_name || "—"}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-text-secondary">{t("guest.email")}</span>
                <span className="font-medium text-text-primary">{booking.guest_email}</span>
              </div>
              {booking.suite_type && (
                <div className="flex justify-between text-base">
                  <span className="text-text-secondary">{t("guest.suite")}</span>
                  <span className="font-medium text-text-primary">{booking.suite_type}</span>
                </div>
              )}
              <div className="flex justify-between text-base">
                <span className="text-text-secondary">{t("guest.checkin")}</span>
                <span className="font-medium text-text-primary">{booking.check_in}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-text-secondary">{t("guest.checkout")}</span>
                <span className="font-medium text-text-primary">{booking.check_out}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleActivate}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-success py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {t("guest.activate")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <button
              onClick={() => { setStep("code"); setBooking(null); setError(""); }}
              className="mt-4 w-full py-2 text-center text-base text-text-secondary hover:text-text-primary"
            >
              {t("guest.otherCode")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Step 1: Enter access code
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary">{t("guest.title")}</h1>
          <p className="mt-2 text-base text-text-secondary">
            {t("guest.subtitle")}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <label htmlFor="access-code" className="mb-2 block text-base font-medium text-text-secondary">
              {t("guest.codeLabel")}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                id="access-code"
                type="text"
                required
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-border bg-surface-secondary py-4 pl-12 pr-4 text-center text-2xl font-mono tracking-[0.2em] text-text-primary outline-none transition-colors focus:border-brand-accent uppercase"
                placeholder={t("guest.codePlaceholder")}
                maxLength={10}
              />
            </div>
            <p className="mt-2 text-center text-sm text-text-secondary">{t("guest.codeHint")}</p>
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.trim().length < 5}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                {t("guest.verify")}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-sm text-text-secondary">
            {t("guest.codeFooter")}
          </p>
        </form>
      </div>
    </main>
  );
}
