"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe className="h-4 w-4" />
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
