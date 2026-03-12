"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  Store,
  Tag,
  BarChart3,
  Save,
  X,
  Users,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  KeyRound,
  Copy,
} from "lucide-react";
import { CATEGORY_META } from "@/lib/types";
import type { BusinessCategory } from "@/lib/types";

interface BusinessRow {
  id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
}

interface PromotionRow {
  id: string;
  business_id: string;
  title: string;
  description: string;
  discount_type: "porcentaje" | "fijo" | "producto";
  discount_value: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

interface Stats {
  totalBusinesses: number;
  activePromos: number;
  totalRedemptions: number;
  redemptionsThisWeek: number;
  totalGuests: number;
  pendingRequests: number;
}

interface LodgifyBookingRow {
  id: string;
  lodgify_booking_id: number;
  access_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  suite_type: string;
  check_in: string;
  check_out: string;
  status: string;
  guest_id: string | null;
  lodgify_source: string;
  created_at: string;
}

type Tab = "negocios" | "promos" | "reservas" | "huespedes" | "solicitudes" | "stats";

const emptyBusiness: Omit<BusinessRow, "id"> = {
  name: "",
  slug: "",
  category: "restaurante",
  description: "",
  address: "",
  lat: 24.152,
  lng: -110.326,
  phone: "",
  website: "",
  image_url: "",
  is_featured: false,
  is_active: true,
};

const emptyPromotion: Omit<PromotionRow, "id"> = {
  business_id: "",
  title: "",
  description: "",
  discount_type: "porcentaje",
  discount_value: "",
  valid_from: new Date().toISOString().slice(0, 10),
  valid_until: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  is_active: true,
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("negocios");
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [promotions, setPromotions] = useState<PromotionRow[]>([]);
  const [stats, setStats] = useState<Stats>({ totalBusinesses: 0, activePromos: 0, totalRedemptions: 0, redemptionsThisWeek: 0, totalGuests: 0, pendingRequests: 0 });
  const [loading, setLoading] = useState(true);

  // Guests & requests
  const [guests, setGuests] = useState<{ id: string; full_name: string; email: string; phone: string; suite_type: string; check_in: string | null; check_out: string | null }[]>([]);
  const [serviceRequests, setServiceRequests] = useState<{ id: string; guest_id: string; service_id: string; status: string; requested_date: string | null; message: string; created_at: string }[]>([]);
  const [servicesCatalog, setServicesCatalog] = useState<{ id: string; name: string; icon: string }[]>([]);

  // Lodgify bookings
  const [lodgifyBookings, setLodgifyBookings] = useState<LodgifyBookingRow[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Business form
  const [editingBiz, setEditingBiz] = useState<Partial<BusinessRow> | null>(null);
  const [bizSaving, setBizSaving] = useState(false);

  // Promo form
  const [editingPromo, setEditingPromo] = useState<Partial<PromotionRow> | null>(null);
  const [promoSaving, setPromoSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bizRes, promoRes, redemptionRes, guestRes, reqRes, svcRes, lodgifyRes] = await Promise.all([
      supabase.from("businesses").select("*").order("name").returns<BusinessRow[]>(),
      supabase.from("promotions").select("*").order("title").returns<PromotionRow[]>(),
      supabase.from("redemptions").select("id, redeemed_at").returns<{ id: string; redeemed_at: string }[]>(),
      supabase.from("guests").select("*").order("created_at", { ascending: false }).returns<{ id: string; full_name: string; email: string; phone: string; suite_type: string; check_in: string | null; check_out: string | null }[]>(),
      supabase.from("service_requests").select("*").order("created_at", { ascending: false }).returns<{ id: string; guest_id: string; service_id: string; status: string; requested_date: string | null; message: string; created_at: string }[]>(),
      supabase.from("services").select("id, name, icon").returns<{ id: string; name: string; icon: string }[]>(),
      supabase.from("lodgify_bookings").select("*").order("check_in", { ascending: false }).returns<LodgifyBookingRow[]>(),
    ]);

    const biz = bizRes.data ?? [];
    const promos = promoRes.data ?? [];
    const redemptions = redemptionRes.data ?? [];

    setBusinesses(biz);
    setPromotions(promos);

    const guestsData = guestRes.data ?? [];
    const requestsData = reqRes.data ?? [];
    setGuests(guestsData);
    setServiceRequests(requestsData);
    setServicesCatalog(svcRes.data ?? []);
    setLodgifyBookings(lodgifyRes.data ?? []);

    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    setStats({
      totalBusinesses: biz.length,
      activePromos: promos.filter((p) => p.is_active).length,
      totalRedemptions: redemptions.length,
      redemptionsThisWeek: redemptions.filter((r) => r.redeemed_at >= weekAgo).length,
      totalGuests: guestsData.length,
      pendingRequests: requestsData.filter((r) => r.status === "pending").length,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Business CRUD ----
  async function saveBusiness() {
    if (!editingBiz) return;
    setBizSaving(true);

    const slug = editingBiz.slug || editingBiz.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
    const payload = { ...editingBiz, slug };

    if (editingBiz.id) {
      await supabase.from("businesses").update(payload).eq("id", editingBiz.id);
    } else {
      await supabase.from("businesses").insert(payload);
    }

    setBizSaving(false);
    setEditingBiz(null);
    fetchData();
  }

  async function deleteBusiness(id: string) {
    if (!confirm("¿Eliminar este negocio y todas sus promociones?")) return;
    await supabase.from("businesses").delete().eq("id", id);
    fetchData();
  }

  // ---- Promotion CRUD ----
  async function savePromotion() {
    if (!editingPromo) return;
    setPromoSaving(true);

    if (editingPromo.id) {
      await supabase.from("promotions").update(editingPromo).eq("id", editingPromo.id);
    } else {
      await supabase.from("promotions").insert(editingPromo);
    }

    setPromoSaving(false);
    setEditingPromo(null);
    fetchData();
  }

  async function deletePromotion(id: string) {
    if (!confirm("¿Eliminar esta promoción?")) return;
    await supabase.from("promotions").delete().eq("id", id);
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm scrollbar-none">
        {[
          { key: "negocios" as Tab, label: "Negocios", icon: Store },
          { key: "promos" as Tab, label: "Promos", icon: Tag },
          { key: "reservas" as Tab, label: "Reservas", icon: KeyRound },
          { key: "huespedes" as Tab, label: "Huéspedes", icon: Users },
          { key: "solicitudes" as Tab, label: "Solicitudes", icon: ShoppingBag },
          { key: "stats" as Tab, label: "Stats", icon: BarChart3 },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-brand text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ============ NEGOCIOS TAB ============ */}
      {tab === "negocios" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Negocios ({businesses.length})</h2>
            <button
              onClick={() => setEditingBiz({ ...emptyBusiness })}
              className="flex items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>

          {/* Business Form Modal */}
          {editingBiz && (
            <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  {editingBiz.id ? "Editar negocio" : "Nuevo negocio"}
                </h3>
                <button onClick={() => setEditingBiz(null)} className="text-text-secondary hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Nombre *</label>
                  <input
                    value={editingBiz.name ?? ""}
                    onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Categoría</label>
                  <select
                    value={editingBiz.category ?? "restaurante"}
                    onChange={(e) => setEditingBiz({ ...editingBiz, category: e.target.value as BusinessCategory })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>{meta.emoji} {meta.label}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Descripción</label>
                  <textarea
                    value={editingBiz.description ?? ""}
                    onChange={(e) => setEditingBiz({ ...editingBiz, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Dirección</label>
                  <input
                    value={editingBiz.address ?? ""}
                    onChange={(e) => setEditingBiz({ ...editingBiz, address: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={editingBiz.lat ?? 24.152}
                    onChange={(e) => setEditingBiz({ ...editingBiz, lat: parseFloat(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={editingBiz.lng ?? -110.326}
                    onChange={(e) => setEditingBiz({ ...editingBiz, lng: parseFloat(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Teléfono</label>
                  <input
                    value={editingBiz.phone ?? ""}
                    onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Sitio web</label>
                  <input
                    value={editingBiz.website ?? ""}
                    onChange={(e) => setEditingBiz({ ...editingBiz, website: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="flex items-center gap-4 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      checked={editingBiz.is_featured ?? false}
                      onChange={(e) => setEditingBiz({ ...editingBiz, is_featured: e.target.checked })}
                      className="h-4 w-4 rounded accent-brand-accent"
                    />
                    Destacado
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      checked={editingBiz.is_active ?? true}
                      onChange={(e) => setEditingBiz({ ...editingBiz, is_active: e.target.checked })}
                      className="h-4 w-4 rounded accent-brand-accent"
                    />
                    Activo
                  </label>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setEditingBiz(null)}
                  className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveBusiness}
                  disabled={bizSaving || !editingBiz.name}
                  className="flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {bizSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          )}

          {/* Business List */}
          <div className="space-y-2">
            {businesses.map((biz) => {
              const meta = CATEGORY_META[biz.category];
              return (
                <div key={biz.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: meta.color }}
                  >
                    <span className="text-lg">{meta.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-text-primary">{biz.name}</p>
                      {!biz.is_active && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-600">Inactivo</span>
                      )}
                      {biz.is_featured && (
                        <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-[10px] text-brand-accent">★</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-text-secondary">{biz.address}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingBiz(biz)}
                      className="rounded-lg p-2 text-text-secondary hover:bg-surface-secondary hover:text-brand-accent"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBusiness(biz.id)}
                      className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {businesses.length === 0 && (
              <p className="py-12 text-center text-sm text-text-secondary">
                No hay negocios. Ejecuta el seed SQL o agrega uno arriba.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============ PROMOS TAB ============ */}
      {tab === "promos" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Promociones ({promotions.length})</h2>
            <button
              onClick={() => setEditingPromo({ ...emptyPromotion, business_id: businesses[0]?.id ?? "" })}
              className="flex items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>

          {/* Promo Form */}
          {editingPromo && (
            <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  {editingPromo.id ? "Editar promoción" : "Nueva promoción"}
                </h3>
                <button onClick={() => setEditingPromo(null)} className="text-text-secondary hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Negocio *</label>
                  <select
                    value={editingPromo.business_id ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, business_id: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  >
                    <option value="">Seleccionar...</option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Título *</label>
                  <input
                    value={editingPromo.title ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Tipo de descuento</label>
                  <select
                    value={editingPromo.discount_type ?? "porcentaje"}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discount_type: e.target.value as PromotionRow["discount_type"] })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  >
                    <option value="porcentaje">Porcentaje</option>
                    <option value="fijo">Monto fijo</option>
                    <option value="producto">Producto/2x1</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Descripción</label>
                  <textarea
                    value={editingPromo.description ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Valor del descuento *</label>
                  <input
                    value={editingPromo.discount_value ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discount_value: e.target.value })}
                    placeholder="Ej: 15%, $50, 2x1"
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      checked={editingPromo.is_active ?? true}
                      onChange={(e) => setEditingPromo({ ...editingPromo, is_active: e.target.checked })}
                      className="h-4 w-4 rounded accent-brand-accent"
                    />
                    Activa
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Válida desde</label>
                  <input
                    type="date"
                    value={editingPromo.valid_from ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, valid_from: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Válida hasta</label>
                  <input
                    type="date"
                    value={editingPromo.valid_until ?? ""}
                    onChange={(e) => setEditingPromo({ ...editingPromo, valid_until: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setEditingPromo(null)}
                  className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePromotion}
                  disabled={promoSaving || !editingPromo.title || !editingPromo.business_id}
                  className="flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {promoSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          )}

          {/* Promo List */}
          <div className="space-y-2">
            {promotions.map((promo) => {
              const biz = businesses.find((b) => b.id === promo.business_id);
              return (
                <div key={promo.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent/10">
                    <Tag className="h-5 w-5 text-brand-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-text-primary">{promo.title}</p>
                      {!promo.is_active && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-600">Inactiva</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-text-secondary">
                      {biz?.name ?? "—"} · {promo.discount_value} · hasta {promo.valid_until}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingPromo(promo)}
                      className="rounded-lg p-2 text-text-secondary hover:bg-surface-secondary hover:text-brand-accent"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {promotions.length === 0 && (
              <p className="py-12 text-center text-sm text-text-secondary">
                No hay promociones. Ejecuta el seed SQL o agrega una arriba.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============ RESERVAS TAB (Lodgify) ============ */}
      {tab === "reservas" && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-text-primary">Reservas Lodgify ({lodgifyBookings.length})</h2>
          {lodgifyBookings.length === 0 ? (
            <div className="py-12 text-center">
              <KeyRound className="mx-auto mb-3 h-10 w-10 text-text-secondary opacity-40" />
              <p className="text-sm text-text-secondary">
                No hay reservas. Configura el webhook de Lodgify para recibir reservas automáticamente.
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                Webhook URL: <code className="rounded bg-surface-secondary px-1.5 py-0.5 text-[11px]">{typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/lodgify?secret=***</code>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {lodgifyBookings.map((bk) => {
                const statusColors: Record<string, string> = {
                  active: "bg-green-100 text-green-700",
                  checked_in: "bg-blue-100 text-blue-700",
                  checked_out: "bg-gray-100 text-gray-600",
                  cancelled: "bg-red-100 text-red-600",
                };
                return (
                  <div key={bk.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent/10">
                        <KeyRound className="h-5 w-5 text-brand-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-text-primary">{bk.guest_name || "Sin nombre"}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[bk.status] ?? statusColors.active}`}>
                            {bk.status}
                          </span>
                          {bk.guest_id && (
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">Vinculado</span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">{bk.guest_email} · {bk.suite_type || "—"}</p>
                        <p className="text-xs text-text-secondary">{bk.check_in} → {bk.check_out} · Lodgify #{bk.lodgify_booking_id}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <code className="rounded-lg bg-surface-secondary px-2.5 py-1.5 text-xs font-bold tracking-wider text-brand">
                          {bk.access_code}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(bk.access_code);
                            setCopiedCode(bk.id);
                            setTimeout(() => setCopiedCode(null), 2000);
                          }}
                          className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-secondary hover:text-brand-accent"
                          title="Copiar código"
                        >
                          {copiedCode === bk.id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============ STATS TAB ============ */}
      {tab === "stats" && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-text-primary">Dashboard</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Negocios", value: stats.totalBusinesses, icon: Store, color: "bg-blue-50 text-blue-600" },
              { label: "Promos activas", value: stats.activePromos, icon: Tag, color: "bg-amber-50 text-amber-600" },
              { label: "Canjes totales", value: stats.totalRedemptions, icon: BarChart3, color: "bg-green-50 text-green-600" },
              { label: "Canjes (7 días)", value: stats.redemptionsThisWeek, icon: BarChart3, color: "bg-purple-50 text-purple-600" },
              { label: "Huéspedes", value: stats.totalGuests, icon: Users, color: "bg-indigo-50 text-indigo-600" },
              { label: "Solicitudes pend.", value: stats.pendingRequests, icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-text-primary">Negocios por categoría</h3>
            <div className="space-y-2">
              {Object.entries(CATEGORY_META).map(([key, meta]) => {
                const count = businesses.filter((b) => b.category === key).length;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="flex-1 text-sm text-text-secondary">{meta.label}</span>
                    <span className="font-semibold text-text-primary">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ HUÉSPEDES TAB ============ */}
      {tab === "huespedes" && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-text-primary">Huéspedes ({guests.length})</h2>
          <div className="space-y-2">
            {guests.map((guest) => (
              <div key={guest.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary">{guest.full_name || "Sin nombre"}</p>
                    <p className="text-xs text-text-secondary">{guest.email}</p>
                  </div>
                  {guest.suite_type && (
                    <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-[10px] font-semibold text-brand-accent">
                      {guest.suite_type}
                    </span>
                  )}
                </div>
                {(guest.check_in || guest.check_out) && (
                  <div className="mt-2 flex gap-4 pl-[52px] text-xs text-text-secondary">
                    {guest.check_in && <span>Check-in: {guest.check_in}</span>}
                    {guest.check_out && <span>Check-out: {guest.check_out}</span>}
                  </div>
                )}
                {guest.phone && (
                  <p className="mt-1 pl-[52px] text-xs text-text-secondary">Tel: {guest.phone}</p>
                )}
              </div>
            ))}
            {guests.length === 0 && (
              <p className="py-12 text-center text-sm text-text-secondary">
                No hay huéspedes registrados aún.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ============ SOLICITUDES TAB ============ */}
      {tab === "solicitudes" && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-text-primary">Solicitudes de servicio ({serviceRequests.length})</h2>
          <div className="space-y-2">
            {serviceRequests.map((req) => {
              const guest = guests.find((g) => g.id === req.guest_id);
              const service = servicesCatalog.find((s) => s.id === req.service_id);
              const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
                pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
                confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
                completed: { label: "Completado", color: "bg-green-100 text-green-700", icon: CheckCircle },
                cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600", icon: XCircle },
              };
              const status = statusConfig[req.status] ?? statusConfig.pending;
              return (
                <div key={req.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{service?.icon ?? "📋"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-text-primary">{service?.name ?? "Servicio"}</p>
                      <p className="text-xs text-text-secondary">
                        {guest?.full_name || guest?.email || "Huésped"} · {new Date(req.created_at).toLocaleDateString("es-MX")}
                      </p>
                      {req.message && <p className="mt-1 text-xs text-text-secondary italic">\"{req.message}\"</p>}
                    </div>
                    <select
                      value={req.status}
                      onChange={async (e) => {
                        await supabase.from("service_requests").update({ status: e.target.value }).eq("id", req.id);
                        fetchData();
                      }}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold outline-none ${status.color}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              );
            })}
            {serviceRequests.length === 0 && (
              <p className="py-12 text-center text-sm text-text-secondary">
                No hay solicitudes de servicio.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
