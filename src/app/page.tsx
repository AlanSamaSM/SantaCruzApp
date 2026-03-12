"use client";

import { QRAccess } from "@/components/qr-access";
import { QuickActions } from "@/components/quick-actions";
import { LanguageToggle } from "@/components/language-toggle";
import { PROPERTY_NAME } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center px-6 pb-24 pt-10">
      {/* Language toggle */}
      <div className="mb-6 self-end">
        <LanguageToggle />
      </div>

      {/* Property Name */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          {PROPERTY_NAME}
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {t("home.subtitle")}
        </p>
      </div>

      {/* QR Access — hero element */}
      <QRAccess />

      {/* Quick actions grid */}
      <QuickActions />
    </main>
  );
}
