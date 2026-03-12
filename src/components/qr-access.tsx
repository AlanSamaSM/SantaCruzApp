"use client";

import QRCode from "react-qr-code";
import { QR_ACCESS_VALUE, PROPERTY_NAME } from "@/lib/constants";

export function QRAccess() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-2xl bg-white p-5 shadow-lg">
        <QRCode
          value={QR_ACCESS_VALUE}
          size={260}
          level="H"
          bgColor="#ffffff"
          fgColor="#1a1a2e"
        />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Acceso al Estacionamiento
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Muestra este código QR a la cámara de la reja para ingresar
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-success" />
        <span className="text-xs font-medium text-success">
          {PROPERTY_NAME} — Acceso activo
        </span>
      </div>
    </div>
  );
}
