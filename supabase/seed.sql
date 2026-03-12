-- ============================================
-- Santa Cruz App — Seed Data
-- Run this AFTER migration.sql in Supabase SQL Editor
-- ============================================

-- Insert businesses with deterministic UUIDs so promotions can reference them
INSERT INTO businesses (id, name, slug, category, description, address, lat, lng, phone, website, image_url, is_featured) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Taquería El Paisa', 'taqueria-el-paisa', 'restaurante',
   'Gastronomía local rápida con alto volumen nocturno. Los mejores tacos de asada de la zona, a pasos de Santa Cruz Suites.',
   'Mariano Abasolo 2730, Zona Central, La Paz', 24.15192, -110.32580, '', '', '', true),

  ('a1b2c3d4-0002-4000-8000-000000000002', 'Mariscos Toro el Güero', 'mariscos-toro-el-guero', 'restaurante',
   'Cocina sudcaliforniana premium con mariscos frescos del día. Destino culinario establecido en la esquina de Abasolo y Sinaloa.',
   'Esq. Mariano Abasolo y Sinaloa, La Paz', 24.14833, -110.32890, '', '', '', true),

  ('a1b2c3d4-0003-4000-8000-000000000003', 'Doce Cuarenta', 'doce-cuarenta', 'cafe',
   'Café de especialidad de vanguardia con repostería artesanal. Ecosistema propicio para nómadas digitales con WiFi de alta velocidad.',
   'Calle Madero, cerca de 5 de Mayo, La Paz', 24.16294, -110.31309, '', '', '', false),

  ('a1b2c3d4-0004-4000-8000-000000000004', 'Harker Board Co.', 'harker-board-co', 'bar',
   'Cervecería artesanal local con vistas panorámicas del atardecer en el malecón. Alquiler de equipo de Paddleboard (SUP) disponible.',
   'Malecón y 5 de Mayo, La Paz', 24.16445, -110.31457, '', '', '', true),

  ('a1b2c3d4-0005-4000-8000-000000000005', 'La Parrilla Norteña', 'la-parrilla-nortena', 'restaurante',
   'Cortes de carne, burritos y ambiente casual familiar. Sobre la misma arteria de Mariano Abasolo, a minutos caminando del complejo.',
   'Mariano Abasolo 3045, La Paz', 24.14865, -110.32862, '', '', '', false);

-- Insert promotions
INSERT INTO promotions (business_id, title, description, discount_type, discount_value, valid_from, valid_until) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', '2x1 en Tacos de Asada',
   'Muestra este QR al pagar y obtén 2x1 en tu orden de tacos de asada. Válido de lunes a jueves.',
   'producto', '2x1 tacos de asada', '2026-03-01', '2026-06-30'),

  ('a1b2c3d4-0002-4000-8000-000000000002', 'Postre de cortesía',
   'Al presentar este QR con consumo mínimo de $300 MXN, recibe un postre regional de cortesía para tu mesa.',
   'producto', 'Postre regional gratis', '2026-03-01', '2026-06-30'),

  ('a1b2c3d4-0003-4000-8000-000000000003', '15% de descuento en café',
   'Muestra este QR para obtener 15% de descuento en cualquier bebida de especialidad. Válido todo el día.',
   'porcentaje', '15%', '2026-03-01', '2026-06-30'),

  ('a1b2c3d4-0004-4000-8000-000000000004', 'Combo Atardecer 🌅',
   'Descuento simultáneo: 20% en alquiler de tabla SUP + cerveza artesanal de cortesía al mostrar este QR.',
   'porcentaje', '20% SUP + cerveza gratis', '2026-03-01', '2026-06-30'),

  ('a1b2c3d4-0005-4000-8000-000000000005', '10% en cortes de carne',
   'Presenta este QR para obtener 10% de descuento en cualquier corte de carne. Válido fines de semana.',
   'porcentaje', '10%', '2026-03-01', '2026-06-30');
