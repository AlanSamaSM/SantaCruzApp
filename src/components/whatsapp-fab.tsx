"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";

export function WhatsAppFAB() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;
  if (!CONTACT.whatsapp) return null;

  const phone = CONTACT.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(t("whatsapp.message"));
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <MessageCircle className="relative h-7 w-7 fill-white" />
    </a>
  );
}
