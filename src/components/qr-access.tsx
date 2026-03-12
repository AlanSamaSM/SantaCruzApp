"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabase";
import { QR_ACCESS_VALUE, PROPERTY_NAME } from "@/lib/constants";
import { KeyRound, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";

export function QRAccess() {
  const [status, setStatus] = useState<"loading" | "active" | "no-booking">("loading");
  const [guestName, setGuestName] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setStatus("no-booking");
      return;
    }

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
        <div className="flex h-[280px] w-[280px] items-center justify-center rounded-2xl bg-white shadow-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  if (status === "no-booking") {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-[240px] w-full max-w-[320px] flex-col items-center justify-center rounded-2xl bg-white shadow-lg">
          <Lock className="mb-3 h-14 w-14 text-gray-300" />
          <p className="px-6 text-center text-base font-medium text-gray-400">
            {t("home.locked")}
          </p>
          <p className="mt-1 px-6 text-center text-sm text-gray-400">
            {t("home.lockedHint")}
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            {t("home.parking")}
          </h2>
          <p className="mt-1 text-base text-text-secondary">
            {t("home.unlockAccess")}
          </p>
        </div>

        <a
          href="/huespedes"
          className="flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <KeyRound className="h-5 w-5" />
          {t("home.enterCode")}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {guestName && (
        <p className="text-lg font-medium text-text-primary">
          {t("home.hello", { name: guestName.split(" ")[0] })}
        </p>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-lg">
        <QRCode
          value={QR_ACCESS_VALUE}
          size={280}
          level="H"
          bgColor="#ffffff"
          fgColor="#1a1a2e"
        />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">
          {t("home.parking")}
        </h2>
        <p className="mt-1 text-base text-text-secondary">
          {t("home.showQR")}
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-success/10 px-5 py-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        <span className="text-sm font-medium text-success">
          {PROPERTY_NAME} — {t("home.accessActive")}
        </span>
      </div>
    </div>
  );
}
