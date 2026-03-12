"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { STORAGE_KEYS, PROPERTY_NAME } from "@/lib/constants";

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

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after a brief delay for smoother UX
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
    <div className="fixed inset-x-0 bottom-16 z-[60] mx-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Tu privacidad es importante
            </h3>
          </div>
          <button
            onClick={() => handleConsent("essential")}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-text-secondary">
          {PROPERTY_NAME} utiliza almacenamiento local para mejorar tu
          experiencia. Con tu consentimiento, habilitaremos funciones como el
          modo offline y la geolocalización en el mapa. Puedes consultar nuestro{" "}
          <a href="/privacidad" className="underline hover:text-brand-accent">
            Aviso de Privacidad
          </a>
          .
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => handleConsent("essential")}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Solo esenciales
          </button>
          <button
            onClick={() => handleConsent("all")}
            className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
