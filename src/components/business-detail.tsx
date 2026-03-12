"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Navigation,
  Tag,
  Clock,
  Star,
  ChevronUp,
} from "lucide-react";
import { SANTA_CRUZ_COORDS } from "@/lib/constants";
import { CATEGORY_META, type BusinessWithPromotion } from "@/lib/types";
import { CouponQR } from "./coupon-qr";
import { useState } from "react";

interface BusinessDetailProps {
  business: BusinessWithPromotion | null;
  onClose: () => void;
}

/** Haversine walking distance (rough estimate) */
function walkingDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const meters = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Estimate walking time */
function walkingTime(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const meters = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const minutes = Math.ceil(meters / 80); // ~80m/min walking
  return `${minutes} min`;
}

export function BusinessDetail({ business, onClose }: BusinessDetailProps) {
  const [showCoupon, setShowCoupon] = useState(false);

  return (
    <AnimatePresence>
      {business && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-white shadow-2xl pb-[env(safe-area-inset-bottom)]"
          >
            {/* Drag handle */}
            <div className="sticky top-0 flex justify-center bg-white pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="px-5 pb-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {CATEGORY_META[business.category].emoji}
                    </span>
                    <h2 className="text-lg font-bold text-text-primary">
                      {business.name}
                    </h2>
                    {business.isFeatured && (
                      <Star className="h-4 w-4 fill-brand-accent text-brand-accent" />
                    )}
                  </div>
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{
                      backgroundColor: CATEGORY_META[business.category].color,
                    }}
                  >
                    {CATEGORY_META[business.category].label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-text-secondary hover:bg-surface-secondary"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <p className="mb-4 text-base leading-relaxed text-text-secondary">
                {business.description}
              </p>

              {/* Distance + address */}
              <div className="mb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-accent" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {walkingTime(
                        SANTA_CRUZ_COORDS.lat,
                        SANTA_CRUZ_COORDS.lng,
                        business.lat,
                        business.lng
                      )}{" "}
                      caminando
                    </span>
                  </div>
                  <span className="text-border">•</span>
                  <span className="text-sm text-text-secondary">
                    {walkingDistance(
                      SANTA_CRUZ_COORDS.lat,
                      SANTA_CRUZ_COORDS.lng,
                      business.lat,
                      business.lng
                    )}
                  </span>
                </div>
              </div>

              {/* Directions button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary px-4 py-4 text-base font-medium text-text-primary shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Navigation className="h-5 w-5" />
                Cómo llegar
              </a>

              {/* Promotion section */}
              {business.promotion && (
                <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-4">
                  <button
                    onClick={() => setShowCoupon(!showCoupon)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-brand-accent" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-primary">
                          {business.promotion.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {business.promotion.description}
                        </p>
                      </div>
                    </div>
                    <ChevronUp
                      className={`h-5 w-5 shrink-0 text-brand-accent transition-transform ${
                        showCoupon ? "" : "rotate-180"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showCoupon && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-brand-accent/20 pt-4">
                          <CouponQR
                            promotion={business.promotion}
                            businessSlug={business.slug}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
