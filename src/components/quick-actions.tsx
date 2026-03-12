"use client";

import { Map, MessageCircle, ConciergeBell, Info } from "lucide-react";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";

const actions = [
  {
    labelKey: "actions.explore" as const,
    icon: Map,
    href: "/explorar",
    color: "bg-blue-50 text-blue-600",
  },
  {
    labelKey: "actions.whatsapp" as const,
    icon: MessageCircle,
    href: "__whatsapp__",
    color: "bg-green-50 text-green-600",
  },
  {
    labelKey: "actions.services" as const,
    icon: ConciergeBell,
    href: "/huespedes/servicios",
    color: "bg-amber-50 text-amber-600",
  },
  {
    labelKey: "actions.info" as const,
    icon: Info,
    href: "/info",
    color: "bg-purple-50 text-purple-600",
  },
];

export function QuickActions() {
  const { t } = useTranslation();

  const phone = CONTACT.whatsapp.replace(/\D/g, "");
  const waMessage = encodeURIComponent(t("whatsapp.message"));

  return (
    <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const href =
          action.href === "__whatsapp__"
            ? `https://wa.me/${phone}?text=${waMessage}`
            : action.href;
        const isExternal = action.href === "__whatsapp__";

        const inner = (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-5 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {t(action.labelKey)}
            </span>
          </div>
        );

        if (isExternal) {
          return (
            <a key={action.labelKey} href={href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          );
        }

        return (
          <Link key={action.labelKey} href={href}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
