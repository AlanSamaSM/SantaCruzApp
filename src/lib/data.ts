import type { Business, Promotion, BusinessWithPromotion } from "./types";

/**
 * Seed data — 5 restaurantes fundacionales del ecosistema de convenios.
 * En Fase 3 se migran a Supabase con panel admin CRUD.
 */
export const businesses: Business[] = [
  {
    id: "taqueria-el-paisa",
    name: "Taquería El Paisa",
    slug: "taqueria-el-paisa",
    category: "restaurante",
    description:
      "Gastronomía local rápida con alto volumen nocturno. Los mejores tacos de asada de la zona, a pasos de Santa Cruz Suites.",
    address: "Mariano Abasolo 2730, Zona Central, La Paz",
    lat: 24.15192,
    lng: -110.32580,
    phone: "",
    website: "",
    imageUrl: "",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "mariscos-toro-el-guero",
    name: "Mariscos Toro el Güero",
    slug: "mariscos-toro-el-guero",
    category: "restaurante",
    description:
      "Cocina sudcaliforniana premium con mariscos frescos del día. Destino culinario establecido en la esquina de Abasolo y Sinaloa.",
    address: "Esq. Mariano Abasolo y Sinaloa, La Paz",
    lat: 24.14833,
    lng: -110.32890,
    phone: "",
    website: "",
    imageUrl: "",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "doce-cuarenta",
    name: "Doce Cuarenta",
    slug: "doce-cuarenta",
    category: "cafe",
    description:
      "Café de especialidad de vanguardia con repostería artesanal. Ecosistema propicio para nómadas digitales con WiFi de alta velocidad.",
    address: "Calle Madero, cerca de 5 de Mayo, La Paz",
    lat: 24.16294,
    lng: -110.31309,
    phone: "",
    website: "",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "harker-board-co",
    name: "Harker Board Co.",
    slug: "harker-board-co",
    category: "bar",
    description:
      "Cervecería artesanal local con vistas panorámicas del atardecer en el malecón. Alquiler de equipo de Paddleboard (SUP) disponible.",
    address: "Malecón y 5 de Mayo, La Paz",
    lat: 24.16445,
    lng: -110.31457,
    phone: "",
    website: "",
    imageUrl: "",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "la-parrilla-nortena",
    name: "La Parrilla Norteña",
    slug: "la-parrilla-nortena",
    category: "restaurante",
    description:
      "Cortes de carne, burritos y ambiente casual familiar. Sobre la misma arteria de Mariano Abasolo, a minutos caminando del complejo.",
    address: "Mariano Abasolo 3045, La Paz",
    lat: 24.14865,
    lng: -110.32862,
    phone: "",
    website: "",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
  },
];

export const promotions: Promotion[] = [
  {
    id: "promo-paisa-01",
    businessId: "taqueria-el-paisa",
    title: "2x1 en Tacos de Asada",
    description:
      "Muestra este QR al pagar y obtén 2x1 en tu orden de tacos de asada. Válido de lunes a jueves.",
    discountType: "producto",
    discountValue: "2x1 tacos de asada",
    validFrom: "2026-03-01",
    validUntil: "2026-06-30",
    isActive: true,
  },
  {
    id: "promo-toro-01",
    businessId: "mariscos-toro-el-guero",
    title: "Postre de cortesía",
    description:
      "Al presentar este QR con consumo mínimo de $300 MXN, recibe un postre regional de cortesía para tu mesa.",
    discountType: "producto",
    discountValue: "Postre regional gratis",
    validFrom: "2026-03-01",
    validUntil: "2026-06-30",
    isActive: true,
  },
  {
    id: "promo-doce-01",
    businessId: "doce-cuarenta",
    title: "15% de descuento en café",
    description:
      "Muestra este QR para obtener 15% de descuento en cualquier bebida de especialidad. Válido todo el día.",
    discountType: "porcentaje",
    discountValue: "15%",
    validFrom: "2026-03-01",
    validUntil: "2026-06-30",
    isActive: true,
  },
  {
    id: "promo-harker-01",
    businessId: "harker-board-co",
    title: "Combo Atardecer 🌅",
    description:
      "Descuento simultáneo: 20% en alquiler de tabla SUP + cerveza artesanal de cortesía al mostrar este QR.",
    discountType: "porcentaje",
    discountValue: "20% SUP + cerveza gratis",
    validFrom: "2026-03-01",
    validUntil: "2026-06-30",
    isActive: true,
  },
  {
    id: "promo-parrilla-01",
    businessId: "la-parrilla-nortena",
    title: "10% en cortes de carne",
    description:
      "Presenta este QR para obtener 10% de descuento en cualquier corte de carne. Válido fines de semana.",
    discountType: "porcentaje",
    discountValue: "10%",
    validFrom: "2026-03-01",
    validUntil: "2026-06-30",
    isActive: true,
  },
];

/** Merge businesses with their active promotions */
export function getBusinessesWithPromotions(): BusinessWithPromotion[] {
  return businesses
    .filter((b) => b.isActive)
    .map((b) => ({
      ...b,
      promotion: promotions.find(
        (p) => p.businessId === b.id && p.isActive
      ),
    }));
}

/** Convert businesses to GeoJSON for Mapbox layers */
export function toGeoJSON(items: BusinessWithPromotion[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: items.map((b) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [b.lng, b.lat],
      },
      properties: {
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        address: b.address,
        isFeatured: b.isFeatured,
        hasPromotion: !!b.promotion,
        promotionTitle: b.promotion?.title ?? "",
      },
    })),
  };
}
