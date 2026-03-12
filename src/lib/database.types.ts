export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: "restaurante" | "cafe" | "bar" | "tour" | "tienda";
          description: string;
          address: string;
          lat: number;
          lng: number;
          phone: string;
          website: string;
          image_url: string;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: "restaurante" | "cafe" | "bar" | "tour" | "tienda";
          description?: string;
          address?: string;
          lat: number;
          lng: number;
          phone?: string;
          website?: string;
          image_url?: string;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: "restaurante" | "cafe" | "bar" | "tour" | "tienda";
          description?: string;
          address?: string;
          lat?: number;
          lng?: number;
          phone?: string;
          website?: string;
          image_url?: string;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description: string;
          discount_type: "porcentaje" | "fijo" | "producto";
          discount_value: string;
          valid_from: string;
          valid_until: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          description?: string;
          discount_type: "porcentaje" | "fijo" | "producto";
          discount_value: string;
          valid_from: string;
          valid_until: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          description?: string;
          discount_type?: "porcentaje" | "fijo" | "producto";
          discount_value?: string;
          valid_from?: string;
          valid_until?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      redemptions: {
        Row: {
          id: string;
          promotion_id: string;
          guest_name: string | null;
          guest_email: string | null;
          redeemed_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          guest_name?: string | null;
          guest_email?: string | null;
          redeemed_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          guest_name?: string | null;
          guest_email?: string | null;
          redeemed_at?: string;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      business_category: "restaurante" | "cafe" | "bar" | "tour" | "tienda";
      discount_type: "porcentaje" | "fijo" | "producto";
    };
  };
}
