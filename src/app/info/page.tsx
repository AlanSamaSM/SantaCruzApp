"use client";

import {
  MapPin,
  MessageCircle,
  Mail,
  Building2,
  ExternalLink,
  Shield,
  Phone,
} from "lucide-react";
import { CONTACT, PROPERTY_NAME, TOTAL_UNITS, SUITE_TYPES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";

export default function InfoPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 pb-24 pt-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            {PROPERTY_NAME}
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            {TOTAL_UNITS} suites — La Paz, B.C.S.
          </p>
        </div>

        {/* Suite types */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("info.suiteTypes")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUITE_TYPES.map((type) => (
              <span
                key={type}
                className="rounded-full border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-text-primary"
              >
                {type}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("info.contact")}
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
                <div>
                  <p className="text-sm text-text-secondary">{t("info.address")}</p>
                  <p className="text-base font-medium text-text-primary">{CONTACT.address}</p>
                </div>
              </div>
            </div>

            {CONTACT.whatsapp && (
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-5 shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="h-6 w-6 shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-green-700">{t("info.whatsapp")}</p>
                  <p className="text-base font-semibold text-green-800">{CONTACT.whatsapp}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-green-500" />
              </a>
            )}

            {CONTACT.email && (
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-5 shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Mail className="h-5 w-5 shrink-0 text-brand-accent" />
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">{t("info.email")}</p>
                  <p className="text-base font-medium text-text-primary">{CONTACT.email}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-text-secondary" />
              </a>
            )}
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("info.about")}
          </h2>
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
              <p className="text-base leading-relaxed text-text-secondary">
                {t("info.aboutText", { units: TOTAL_UNITS })}
              </p>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("info.legal")}
          </h2>
          <a
            href="/privacidad"
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-5 shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Shield className="h-5 w-5 text-brand-accent" />
            <div className="flex-1">
              <p className="text-base font-medium text-text-primary">
                {t("info.privacyTitle")}
              </p>
              <p className="text-sm text-text-secondary">
                {t("info.privacySubtitle")}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-text-secondary" />
          </a>
        </section>
      </div>
    </main>
  );
}
