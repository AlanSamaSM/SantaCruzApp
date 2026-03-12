import { supabase } from "./supabase";
import type { Business, Promotion, BusinessWithPromotion } from "./types";
import { businesses as localBusinesses, promotions as localPromotions } from "./data";

/** Map Supabase row (snake_case) to app type (camelCase) */
function mapBusiness(row: Record<string, unknown>): Business {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    category: row.category as Business["category"],
    description: (row.description as string) ?? "",
    address: (row.address as string) ?? "",
    lat: row.lat as number,
    lng: row.lng as number,
    phone: (row.phone as string) ?? "",
    website: (row.website as string) ?? "",
    imageUrl: (row.image_url as string) ?? "",
    isFeatured: (row.is_featured as boolean) ?? false,
    isActive: (row.is_active as boolean) ?? true,
  };
}

function mapPromotion(row: Record<string, unknown>): Promotion {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    discountType: row.discount_type as Promotion["discountType"],
    discountValue: row.discount_value as string,
    validFrom: row.valid_from as string,
    validUntil: row.valid_until as string,
    isActive: (row.is_active as boolean) ?? true,
  };
}

/**
 * Fetch businesses with their active promotions from Supabase.
 * Falls back to local seed data if Supabase is unreachable.
 */
export async function fetchBusinessesWithPromotions(): Promise<BusinessWithPromotion[]> {
  try {
    const [bizRes, promoRes] = await Promise.all([
      supabase.from("businesses").select("*").eq("is_active", true),
      supabase.from("promotions").select("*").eq("is_active", true),
    ]);

    if (bizRes.error || promoRes.error) throw new Error("Supabase query failed");

    const businesses = (bizRes.data ?? []).map(mapBusiness);
    const promotions = (promoRes.data ?? []).map(mapPromotion);

    return businesses.map((b) => ({
      ...b,
      promotion: promotions.find((p) => p.businessId === b.id),
    }));
  } catch {
    // Fallback to local data (offline / Supabase not seeded yet)
    return localBusinesses
      .filter((b) => b.isActive)
      .map((b) => ({
        ...b,
        promotion: localPromotions.find((p) => p.businessId === b.id && p.isActive),
      }));
  }
}
