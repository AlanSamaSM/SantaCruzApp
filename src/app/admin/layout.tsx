"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !isLoginPage) router.push("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  // Login page renders without auth check
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-brand">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="min-h-dvh bg-surface-secondary">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border bg-brand px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white">Santa Cruz Admin</h1>
            <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-[10px] font-semibold text-brand-accent">
              Panel
            </span>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin/login");
            }}
            className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
