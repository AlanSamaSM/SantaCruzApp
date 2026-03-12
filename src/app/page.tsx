import { QRAccess } from "@/components/qr-access";
import { PROPERTY_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 pb-20">
      {/* Logo / Property Name */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {PROPERTY_NAME}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          La Paz, Baja California Sur
        </p>
      </div>

      {/* QR Access — hero element */}
      <QRAccess />

      {/* Quick tip */}
      <p className="mt-8 max-w-xs text-center text-xs text-text-secondary">
        Instala esta app en tu pantalla de inicio para acceso rápido, incluso sin
        conexión a internet.
      </p>
    </main>
  );
}
