import {
  MapPin,
  MessageCircle,
  Mail,
  Building2,
  ExternalLink,
  Shield,
} from "lucide-react";
import { CONTACT, PROPERTY_NAME, TOTAL_UNITS, SUITE_TYPES } from "@/lib/constants";

export const metadata = {
  title: "Info — Santa Cruz Suites",
};

export default function InfoPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 pb-24 pt-8">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-text-primary">
            {PROPERTY_NAME}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {TOTAL_UNITS} suites en La Paz, Baja California Sur
          </p>
        </div>

        {/* Suite types */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Tipos de Suite
          </h2>
          <div className="flex flex-wrap gap-2">
            {SUITE_TYPES.map((type) => (
              <span
                key={type}
                className="rounded-full border border-border bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary"
              >
                {type}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Contacto
          </h2>
          <div className="space-y-3">
            <InfoRow icon={MapPin} label="Dirección" value={CONTACT.address} />
            {CONTACT.whatsapp && (
              <InfoRow
                icon={MessageCircle}
                label="WhatsApp"
                value={CONTACT.whatsapp}
                href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
              />
            )}
            {CONTACT.email && (
              <InfoRow
                icon={Mail}
                label="Email"
                value={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
              />
            )}
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Acerca de
          </h2>
          <div className="rounded-xl border border-border bg-surface-secondary p-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
              <p className="text-sm leading-relaxed text-text-secondary">
                Santa Cruz Suites es un complejo de {TOTAL_UNITS} unidades
                ubicado en el corazón de La Paz, sobre la calle Mariano Abasolo.
                Contamos con más de 300 reseñas positivas y estándares de
                limpieza verificados. Nuestras suites incluyen configuraciones
                Studio A, Studio B, Penthouse y Loft, con amenidades como
                jacuzzi en azotea con vista a la bahía.
              </p>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Legal
          </h2>
          <a
            href="/privacidad"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-secondary p-4 transition-colors hover:bg-border/30"
          >
            <Shield className="h-5 w-5 text-brand-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                Aviso de Privacidad
              </p>
              <p className="text-xs text-text-secondary">
                LFPDPPP — Protección de datos personales
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-text-secondary" />
          </a>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-secondary p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
