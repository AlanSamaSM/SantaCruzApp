"use client";

import QRCode from "react-qr-code";
import { PROPERTY_NAME } from "@/lib/constants";
import type { Promotion } from "@/lib/types";

interface CouponQRProps {
  promotion: Promotion;
  businessSlug: string;
}

/**
 * Generates a unique QR value for coupon redemption.
 * Format: SCX-{businessSlug}-{promotionId}-{date}
 * The restaurant scans this to validate the discount.
 */
function generateCouponValue(businessSlug: string, promotionId: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `SCX-${businessSlug}-${promotionId}-${date}`;
}

export function CouponQR({ promotion, businessSlug }: CouponQRProps) {
  const qrValue = generateCouponValue(businessSlug, promotion.id);

  const validUntil = new Date(promotion.validUntil).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3 shadow-md">
        <QRCode
          value={qrValue}
          size={180}
          level="H"
          bgColor="#ffffff"
          fgColor="#1a1a2e"
        />
      </div>
      <p className="text-center text-[11px] text-text-secondary">
        Muestra este código al momento de pagar.
        <br />
        Válido hasta el {validUntil}.
      </p>
      <p className="text-center text-[9px] text-text-secondary/60">
        Promoción exclusiva para huéspedes de {PROPERTY_NAME}
      </p>
    </div>
  );
}
