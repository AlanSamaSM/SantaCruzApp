"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Home,
  Save,
  LogOut,
  Trash2,
  Shield,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { PROPERTY_NAME, SUITE_TYPES } from "@/lib/constants";
import type { Session } from "@supabase/supabase-js";

interface GuestProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  suite_type: string;
  check_in: string | null;
  check_out: string | null;
  notes: string;
}

export default function GuestProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/huespedes");
        return;
      }
      setSession(session);
      loadProfile(session.user.id, session.user.email ?? "");
    });
  }, [router]);

  async function loadProfile(userId: string, email: string) {
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data as GuestProfile);
    } else {
      // First login — create guest profile
      const newProfile: GuestProfile = {
        id: userId,
        full_name: "",
        email,
        phone: "",
        suite_type: "",
        check_in: null,
        check_out: null,
        notes: "",
      };
      await supabase.from("guests").insert(newProfile);
      setProfile(newProfile);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    await supabase.from("guests").update({
      full_name: profile.full_name,
      phone: profile.phone,
      suite_type: profile.suite_type,
      check_in: profile.check_in,
      check_out: profile.check_out,
    }).eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/huespedes");
  }

  // ARCO: Delete all personal data
  async function handleDeleteData() {
    if (!session) return;

    // Delete service requests first (FK), then guest profile
    await supabase.from("service_requests").delete().eq("guest_id", session.user.id);
    await supabase.from("guests").delete().eq("id", session.user.id);
    await supabase.auth.signOut();
    router.push("/");
  }

  // ARCO: Export personal data as JSON
  function handleExportData() {
    if (!profile) return;
    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mis-datos-santacruz-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center pb-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 pb-24 pt-8">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Mi Perfil</h1>
            <p className="text-sm text-text-secondary">{PROPERTY_NAME}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>

        {/* Profile form */}
        <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Datos personales</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <User className="h-3.5 w-3.5" /> Nombre completo
              </label>
              <input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none focus:border-brand-accent"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Mail className="h-3.5 w-3.5" /> Correo electrónico
              </label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-text-secondary outline-none opacity-60"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Phone className="h-3.5 w-3.5" /> Teléfono
              </label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none focus:border-brand-accent"
                placeholder="+52 612 123 4567"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Home className="h-3.5 w-3.5" /> Tipo de suite
              </label>
              <select
                value={profile.suite_type}
                onChange={(e) => setProfile({ ...profile, suite_type: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none focus:border-brand-accent"
              >
                <option value="">Seleccionar...</option>
                {SUITE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                  <CalendarDays className="h-3.5 w-3.5" /> Check-in
                </label>
                <input
                  type="date"
                  value={profile.check_in ?? ""}
                  onChange={(e) => setProfile({ ...profile, check_in: e.target.value || null })}
                  className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                  <CalendarDays className="h-3.5 w-3.5" /> Check-out
                </label>
                <input
                  type="date"
                  value={profile.check_out ?? ""}
                  onChange={(e) => setProfile({ ...profile, check_out: e.target.value || null })}
                  className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none focus:border-brand-accent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : saved ? (
              <>✓ Guardado</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>

        {/* ARCO Rights Section */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Tus derechos ARCO</h2>
          </div>
          <p className="mb-4 text-xs text-text-secondary leading-relaxed">
            Bajo la LFPDPPP tienes derecho a Acceder, Rectificar, Cancelar y Oponerte al uso de tus datos personales.
          </p>

          <div className="space-y-2">
            {/* Access: export data */}
            <button
              onClick={handleExportData}
              className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-surface-secondary"
            >
              <FileText className="h-4 w-4 shrink-0 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-text-primary">Descargar mis datos</p>
                <p className="text-[11px] text-text-secondary">Exporta tu información en formato JSON</p>
              </div>
            </button>

            {/* Cancel: delete data */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-left transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-600">Eliminar mis datos</p>
                <p className="text-[11px] text-text-secondary">Borra toda tu información permanentemente</p>
              </div>
            </button>
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-sm font-semibold text-red-700">¿Estás seguro?</p>
              </div>
              <p className="mb-4 text-xs text-red-600">
                Esta acción eliminará permanentemente tu perfil, historial de servicios y datos personales. No se puede deshacer.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteData}
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Sí, eliminar todo
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-text-secondary">
          <a href="/privacidad" className="underline hover:text-text-primary">Aviso de privacidad</a>
        </p>
      </div>
    </main>
  );
}
