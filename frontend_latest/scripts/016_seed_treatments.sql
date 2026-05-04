-- Insert Treatment History for Demo User
WITH user_id AS (SELECT id FROM profiles WHERE email = 'demo@example.com' LIMIT 1)
INSERT INTO treatment_records (user_id, type, name, date, doctor_name, clinic_name, description, area, cost, status, notes)
VALUES
  (
    (SELECT id FROM user_id),
    'injection',
    'Botox Forehead Treatment',
    '2024-03-15',
    'Dr. Emily Chen',
    'Radiance Medical Spa',
    'Botulinum toxin injection to reduce forehead lines',
    'Forehead',
    450.00,
    'completed',
    '20 units administered. Results visible in 3-5 days.'
  ),
  (
    (SELECT id FROM user_id),
    'laser',
    'Fractional CO2 Laser',
    '2024-02-20',
    'Dr. Michael Zhang',
    'Elite Skin Clinic',
    'Laser treatment for skin texture improvement',
    'Full Face',
    1200.00,
    'completed',
    '3 sessions recommended. Downtime 5-7 days.'
  )
ON CONFLICT DO NOTHING;
