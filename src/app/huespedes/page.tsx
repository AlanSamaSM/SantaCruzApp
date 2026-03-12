"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { PROPERTY_NAME } from "@/lib/constants";

export default function GuestLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // If already logged in, redirect to profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/huespedes/perfil");
    });
  }, [router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/huespedes/perfil`,
      },
    });

    if (error) {
      setError("No se pudo enviar el enlace. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enviamos un enlace mágico a <strong className="text-text-primary">{email}</strong>.
            Haz clic en el enlace para acceder a tu cuenta de huésped.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-brand-accent hover:underline"
          >
            Usar otro correo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 pb-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-text-primary">Acceso de Huésped</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Ingresa tu correo para acceder a servicios exclusivos de {PROPERTY_NAME}.
          </p>
        </div>

        <form onSubmit={handleMagicLink} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="guest-email" className="mb-1 block text-sm font-medium text-text-secondary">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                id="guest-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-brand-accent"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                Enviar enlace mágico
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[11px] text-text-secondary">
            Te enviaremos un enlace seguro a tu correo. No necesitas contraseña.
          </p>
        </form>
      </div>
    </main>
  );
}
