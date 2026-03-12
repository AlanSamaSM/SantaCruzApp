"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";

type ConsentLevel = "all" | "essential" | null;

function getStoredConsent(): ConsentLevel {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.consent) as ConsentLevel;
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentLevel>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  return consent;
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleConsent(level: "all" | "essential") {
    localStorage.setItem(STORAGE_KEYS.consent, level);
    localStorage.setItem(STORAGE_KEYS.consentDate, new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] mx-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-accent" />
            <h3 className="text-base font-semibold text-text-primary">
              {t("consent.title")}
            </h3>
          </div>
          <button
            onClick={() => handleConsent("essential")}
            className="rounded-full p-2 text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-text-secondary">
          {t("consent.text")}{" "}
          <a href="/privacidad" className="underline hover:text-brand-accent">
            {t("consent.privacyLink")}
          </a>
          .
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => handleConsent("essential")}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-secondary"
          >
            {t("consent.essential")}
          </button>
          <button
            onClick={() => handleConsent("all")}
            className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
          >
            {t("consent.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
