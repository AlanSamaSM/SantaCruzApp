"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Map, Info, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n-context";
import type { TranslationKey } from "@/lib/i18n";

const tabs = [
  { href: "/", labelKey: "nav.access" as TranslationKey, icon: QrCode },
  { href: "/explorar", labelKey: "nav.explore" as TranslationKey, icon: Map },
  { href: "/huespedes", labelKey: "nav.guest" as TranslationKey, icon: User },
  { href: "/info", labelKey: "nav.info" as TranslationKey, icon: Info },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-3.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-brand-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute -top-px left-1/4 right-1/4 h-0.5 rounded-full bg-brand-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span>{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
