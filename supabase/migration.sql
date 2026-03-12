-- ============================================
-- Santa Cruz App — Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================

-- 1. Custom ENUM types
CREATE TYPE business_category AS ENUM ('restaurante', 'cafe', 'bar', 'tour', 'tienda');
CREATE TYPE discount_type AS ENUM ('porcentaje', 'fijo', 'producto');

-- 2. Businesses table
CREATE TABLE businesses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  category    business_category NOT NULL DEFAULT 'restaurante',
  description TEXT NOT NULL DEFAULT '',
  address     TEXT NOT NULL DEFAULT '',
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  phone       TEXT NOT NULL DEFAULT '',
  website     TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Promotions table
CREATE TABLE promotions (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  discount_type  discount_type NOT NULL DEFAULT 'porcentaje',
  discount_value TEXT NOT NULL,
  valid_from     DATE NOT NULL,
  valid_until    DATE NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Redemptions table (coupon usage tracking)
CREATE TABLE redemptions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id  UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  guest_name    TEXT,
  guest_email   TEXT,
  redeemed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes         TEXT
);

-- 5. Indexes for common queries
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_active ON businesses(is_active);
CREATE INDEX idx_promotions_business ON promotions(business_id);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(valid_from, valid_until);
CREATE INDEX idx_redemptions_promotion ON redemptions(promotion_id);
CREATE INDEX idx_redemptions_date ON redemptions(redeemed_at);

-- 6. Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Public read access for active businesses & promotions (the app is public-facing)
CREATE POLICY "Anyone can read active businesses"
  ON businesses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can read active promotions"
  ON promotions FOR SELECT
  USING (is_active = true);

-- Only authenticated (admin) can insert/update/delete
CREATE POLICY "Admin can manage businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage redemptions"
  ON redemptions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anon can insert redemptions (when guest redeems a coupon)
CREATE POLICY "Anyone can create redemptions"
  ON redemptions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can read redemption count (for analytics displayed in app)
CREATE POLICY "Anyone can read redemptions"
  ON redemptions FOR SELECT
  TO anon
  USING (true);
