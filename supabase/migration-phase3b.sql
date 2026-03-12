-- ============================================
-- Santa Cruz App — Phase 3B: Guests & Services
-- Run this in Supabase SQL Editor AFTER migration.sql
-- ============================================

-- 1. Guests table (linked to Supabase Auth)
CREATE TABLE guests (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL DEFAULT '',
  suite_type  TEXT NOT NULL DEFAULT '',
  check_in    DATE,
  check_out   DATE,
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Services catalog (admin-managed upselling options)
CREATE TABLE services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'MXN',
  category    TEXT NOT NULL DEFAULT 'general',
  icon        TEXT NOT NULL DEFAULT '🏨',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Service requests from guests
CREATE TABLE service_requests (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id    UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  requested_date DATE,
  message     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Indexes
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_checkout ON guests(check_out);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_service_requests_guest ON service_requests(guest_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- 5. RLS policies
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Guests: each guest can read/update only their own row
CREATE POLICY "Guests can read own profile"
  ON guests FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Guests can update own profile"
  ON guests FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Guests: allow insert for new signups (the trigger/app inserts on first login)
CREATE POLICY "Guests can insert own profile"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Guests: ARCO — guest can delete own data
CREATE POLICY "Guests can delete own profile"
  ON guests FOR DELETE
  TO authenticated
  USING (id = auth.uid());

-- Admin can manage all guests
CREATE POLICY "Admin can manage guests"
  ON guests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Services: public read (everyone sees the catalog)
CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Admin can manage services
CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Service requests: guest can read/create their own
CREATE POLICY "Guests can read own requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (guest_id = auth.uid());

CREATE POLICY "Guests can create requests"
  ON service_requests FOR INSERT
  TO authenticated
  WITH CHECK (guest_id = auth.uid());

-- Admin can manage all requests
CREATE POLICY "Admin can manage requests"
  ON service_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Seed services catalog
INSERT INTO services (name, slug, description, price, category, icon) VALUES
  ('Late Checkout (14:00)', 'late-checkout', 'Extiende tu checkout hasta las 14:00 hrs. Sujeto a disponibilidad.', 350, 'alojamiento', '🕐'),
  ('Early Check-in (11:00)', 'early-checkin', 'Accede a tu suite desde las 11:00 hrs. Sujeto a disponibilidad.', 350, 'alojamiento', '🌅'),
  ('Transporte Aeropuerto', 'transporte-aeropuerto', 'Servicio de transporte privado desde/hacia el aeropuerto de La Paz.', 600, 'transporte', '✈️'),
  ('Tour Balandra', 'tour-balandra', 'Excursión de día completo a Playa Balandra con snorkel y lunch incluido.', 1200, 'experiencias', '🏖️'),
  ('Nado con Tiburón Ballena', 'tiburon-ballena', 'Experiencia única de nado con tiburón ballena en el Mar de Cortés (temporada Oct-Abr).', 1800, 'experiencias', '🐋'),
  ('Cena Romántica en Azotea', 'cena-romantica', 'Cena privada en la azotea con vista a la bahía. Incluye menú de 3 tiempos y vino.', 2500, 'experiencias', '🌙'),
  ('Kit de Snorkel', 'kit-snorkel', 'Alquiler de equipo de snorkel por el día (máscara + tubo + aletas).', 250, 'equipo', '🤿'),
  ('Tabla SUP (día)', 'sup-dia', 'Alquiler de tabla de Stand Up Paddleboard por el día completo.', 400, 'equipo', '🏄');
