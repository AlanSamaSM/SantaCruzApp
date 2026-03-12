-- ============================================
-- Santa Cruz App — Lodgify Integration
-- Run this in Supabase SQL Editor AFTER migration-phase3b.sql
-- ============================================

-- 1. Table for Lodgify bookings + access codes
CREATE TABLE lodgify_bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lodgify_booking_id INTEGER NOT NULL UNIQUE,
  access_code     TEXT NOT NULL UNIQUE,
  guest_name      TEXT NOT NULL DEFAULT '',
  guest_email     TEXT NOT NULL DEFAULT '',
  guest_phone     TEXT NOT NULL DEFAULT '',
  suite_type      TEXT NOT NULL DEFAULT '',
  check_in        DATE NOT NULL,
  check_out       DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'checked_in', 'checked_out', 'cancelled')),
  guest_id        UUID REFERENCES guests(id) ON DELETE SET NULL,
  lodgify_source  TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER lodgify_bookings_updated_at
  BEFORE UPDATE ON lodgify_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Indexes
CREATE INDEX idx_lodgify_bookings_code ON lodgify_bookings(access_code);
CREATE INDEX idx_lodgify_bookings_email ON lodgify_bookings(guest_email);
CREATE INDEX idx_lodgify_bookings_status ON lodgify_bookings(status);
CREATE INDEX idx_lodgify_bookings_checkout ON lodgify_bookings(check_out);

-- 3. RLS
ALTER TABLE lodgify_bookings ENABLE ROW LEVEL SECURITY;

-- Authenticated guests can read their own linked booking
CREATE POLICY "Guests can read own booking"
  ON lodgify_bookings FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

-- Anon can read by access code (for verification before sign-up)
CREATE POLICY "Anon can read by access code"
  ON lodgify_bookings FOR SELECT
  TO anon
  USING (true);

-- Admin can manage all
CREATE POLICY "Admin can manage lodgify bookings"
  ON lodgify_bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Anon inserts (webhook uses anon key with secret verification)
CREATE POLICY "Anon can insert bookings"
  ON lodgify_bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon updates (for linking guest_id after verification)
CREATE POLICY "Anon can update bookings"
  ON lodgify_bookings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
