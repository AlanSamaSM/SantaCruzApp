"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Check,
  Clock,
  Send,
  ChevronRight,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";
import type { Session } from "@supabase/supabase-js";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  icon: string;
  is_active: boolean;
}

interface ServiceRequest {
  id: string;
  service_id: string;
  status: string;
  requested_date: string | null;
  message: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completado", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600" },
};

export default function ServiciosPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requestDate, setRequestDate] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/huespedes");
        return;
      }
      setSession(session);
      loadData(session.user.id);
    });
  }, [router]);

  async function loadData(userId: string) {
    const [servRes, reqRes] = await Promise.all([
      supabase.from("services").select("*").eq("is_active", true).order("category").returns<Service[]>(),
      supabase.from("service_requests").select("*").eq("guest_id", userId).order("created_at", { ascending: false }).returns<ServiceRequest[]>(),
    ]);
    setServices(servRes.data ?? []);
    setMyRequests(reqRes.data ?? []);
    setLoading(false);
  }

  async function handleRequest() {
    if (!session || !selectedService) return;
    setSending(true);

    await supabase.from("service_requests").insert({
      guest_id: session.user.id,
      service_id: selectedService.id,
      requested_date: requestDate || null,
      message: requestMessage,
    });

    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedService(null);
      setRequestDate("");
      setRequestMessage("");
      loadData(session.user.id);
    }, 1500);
  }

  if (loading) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center pb-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </main>
    );
  }

  // Group services by category
  const categories = [...new Set(services.map((s) => s.category))];

  const categoryLabels: Record<string, string> = {
    alojamiento: "🏨 Alojamiento",
    transporte: "✈️ Transporte",
    experiencias: "🏖️ Experiencias",
    equipo: "🤿 Equipo & Deportes",
    general: "📋 General",
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 pb-24 pt-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{t("services.title")}</h1>
          <p className="mt-1 text-base text-text-secondary">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Service catalog */}
        {categories.map((cat) => (
          <section key={cat} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {categoryLabels[cat] ?? cat}
            </h2>
            <div className="space-y-3">
              {services
                .filter((s) => s.category === cat)
                .map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setSent(false);
                    }}
                    className="flex w-full items-center gap-4 rounded-xl border border-border bg-white p-5 text-left shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span className="text-3xl">{service.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-text-primary">{service.name}</p>
                      <p className="truncate text-sm text-text-secondary">{service.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-lg font-bold text-brand-accent">
                        ${service.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-text-secondary">{service.currency}</span>
                      <ChevronRight className="ml-1 h-5 w-5 text-text-secondary" />
                    </div>
                  </button>
                ))}
            </div>
          </section>
        ))}

        {/* My requests */}
        {myRequests.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              📋 {t("services.myRequests")}
            </h2>
            <div className="space-y-3">
              {myRequests.map((req) => {
                const service = services.find((s) => s.id === req.service_id);
                const statusKey = `services.${req.status}` as "services.pending" | "services.confirmed" | "services.completed" | "services.cancelled";
                const status = STATUS_LABELS[req.status] ?? STATUS_LABELS.pending;
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
                  >
                    <span className="text-2xl">{service?.icon ?? "📋"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium text-text-primary">
                        {service?.name ?? "Servicio"}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {new Date(req.created_at).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.color}`}>
                      {t(statusKey)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Request modal */}
        <AnimatePresence>
          {selectedService && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/30"
                onClick={() => setSelectedService(null)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-white p-6 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
              >
                <div className="mb-1 flex justify-center">
                  <div className="h-1 w-10 rounded-full bg-border" />
                </div>

                <div className="mb-4 flex items-center gap-4">
                  <span className="text-4xl">{selectedService.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{selectedService.name}</h3>
                    <p className="text-base text-brand-accent font-semibold">
                      ${selectedService.price.toLocaleString()} {selectedService.currency}
                    </p>
                  </div>
                </div>

                <p className="mb-5 text-base text-text-secondary">{selectedService.description}</p>

                {sent ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                      <Check className="h-7 w-7 text-green-500" />
                    </div>
                    <p className="text-lg font-semibold text-text-primary">{t("services.sent")}</p>
                    <p className="text-base text-text-secondary">{t("services.sentHint")}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <Calendar className="h-4 w-4" /> {t("services.dateLabel")}
                      </label>
                      <input
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div className="mb-5">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <MessageSquare className="h-4 w-4" /> {t("services.commentLabel")}
                      </label>
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={2}
                        placeholder={t("services.commentPlaceholder")}
                        className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                      />
                    </div>
                    <button
                      onClick={handleRequest}
                      disabled={sending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                    >
                      {sending ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t("services.submit")}
                        </>
                      )}
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
