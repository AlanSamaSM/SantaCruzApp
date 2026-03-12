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
import { SUITE_TYPES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n-context";
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
  const { t } = useTranslation();

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
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">{t("profile.title")}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-base text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
          >
            <LogOut className="h-5 w-5" />
            {t("profile.logout")}
          </button>
        </div>

        {/* Profile form */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-text-primary">{t("profile.personal")}</h2>
          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <User className="h-4 w-4" /> {t("profile.fullName")}
              </label>
              <input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                placeholder={t("profile.namePlaceholder")}
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Mail className="h-4 w-4" /> {t("profile.emailLabel")}
              </label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base text-text-secondary outline-none opacity-60"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Phone className="h-4 w-4" /> {t("profile.phone")}
              </label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                placeholder={t("profile.phonePlaceholder")}
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                <Home className="h-4 w-4" /> {t("profile.suiteType")}
              </label>
              <select
                value={profile.suite_type}
                onChange={(e) => setProfile({ ...profile, suite_type: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
              >
                <option value="">{t("profile.selectSuite")}</option>
                {SUITE_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <CalendarDays className="h-4 w-4" /> Check-in
                </label>
                <input
                  type="date"
                  value={profile.check_in ?? ""}
                  onChange={(e) => setProfile({ ...profile, check_in: e.target.value || null })}
                  className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <CalendarDays className="h-4 w-4" /> Check-out
                </label>
                <input
                  type="date"
                  value={profile.check_out ?? ""}
                  onChange={(e) => setProfile({ ...profile, check_out: e.target.value || null })}
                  className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base outline-none focus:border-brand-accent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : saved ? (
              <>✓ {t("profile.saved")}</>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t("profile.save")}
              </>
            )}
          </button>
        </div>

        {/* ARCO Rights Section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-accent" />
            <h2 className="text-base font-semibold text-text-primary">{t("profile.arcoTitle")}</h2>
          </div>
          <p className="mb-5 text-sm text-text-secondary leading-relaxed">
            {t("profile.arcoDesc")}
          </p>

          <div className="space-y-3">
            {/* Access: export data */}
            <button
              onClick={handleExportData}
              className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-4 text-left transition-colors hover:bg-surface-secondary"
            >
              <FileText className="h-5 w-5 shrink-0 text-blue-500" />
              <div>
                <p className="text-base font-medium text-text-primary">{t("profile.exportData")}</p>
                <p className="text-sm text-text-secondary">{t("profile.exportDesc")}</p>
              </div>
            </button>

            {/* Cancel: delete data */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-4 text-left transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-base font-medium text-red-600">{t("profile.deleteData")}</p>
                <p className="text-sm text-text-secondary">{t("profile.deleteDesc")}</p>
              </div>
            </button>
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-base font-semibold text-red-700">{t("profile.deleteConfirm")}</p>
              </div>
              <p className="mb-4 text-sm text-red-600">
                {t("profile.deleteWarn")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-3 text-base text-text-secondary hover:bg-white"
                >
                  {t("profile.cancel")}
                </button>
                <button
                  onClick={handleDeleteData}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-base font-semibold text-white hover:bg-red-700"
                >
                  {t("profile.deleteAll")}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-text-secondary">
          <a href="/privacidad" className="underline hover:text-text-primary">{t("profile.privacy")}</a>
        </p>
      </div>
    </main>
  );
}
