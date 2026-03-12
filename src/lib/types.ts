export type BusinessCategory = "restaurante" | "cafe" | "bar" | "tour" | "tienda";

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  businessId: string;
  title: string;
  description: string;
  discountType: "porcentaje" | "fijo" | "producto";
  discountValue: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface BusinessWithPromotion extends Business {
  promotion?: Promotion;
}

/** Icon + color mapping per category */
export const CATEGORY_META: Record<
  BusinessCategory,
  { label: string; color: string; emoji: string }
> = {
  restaurante: { label: "Restaurante", color: "#ef4444", emoji: "🍽️" },
  cafe: { label: "Café", color: "#92400e", emoji: "☕" },
  bar: { label: "Bar & Cervecería", color: "#f59e0b", emoji: "🍺" },
  tour: { label: "Tours & Aventura", color: "#3b82f6", emoji: "🏄" },
  tienda: { label: "Tienda", color: "#8b5cf6", emoji: "🛍️" },
};
