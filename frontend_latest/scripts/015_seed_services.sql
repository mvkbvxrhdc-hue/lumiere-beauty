-- Insert Beauty Services
INSERT INTO beauty_services (name, description, detailed_description, price, duration, category, image_url, features, partner_clinic, rating, review_count)
VALUES
  (
    'HydraFacial Deluxe',
    'Deep cleansing, exfoliation, and hydration treatment.',
    'The HydraFacial Deluxe is a revolutionary multi-step treatment...',
    299.00,
    '60 min',
    'facial',
    '/beauty-services/hydrafacial.jpg',
    ARRAY['Deep pore cleansing', 'Exfoliation', 'Hydrating serum'],
    'Glow Medical Spa',
    4.9,
    234
  ),
  (
    'Botox & Fillers Combo',
    'Comprehensive anti-aging treatment combining Botox and fillers.',
    'Wrinkle reduction and volume restoration...',
    899.00,
    '90 min',
    'anti-aging',
    '/beauty-services/botox-fillers.jpg',
    ARRAY['Wrinkle reduction', 'Volume restoration', 'Natural results'],
    'Premier Aesthetics Clinic',
    4.9,
    312
  ),
  (
    'Laser Hair Removal - Full Body',
    'Complete full-body laser hair removal package.',
    'Painless diode laser technology...',
    2499.00,
    '180 min',
    'laser',
    '/beauty-services/laser-hair-removal.jpg',
    ARRAY['Full body coverage', '6 sessions', 'Painless'],
    'Smooth Skin Laser Center',
    4.8,
    267
  )
ON CONFLICT DO NOTHING;
