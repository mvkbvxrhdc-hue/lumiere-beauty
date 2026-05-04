-- Create test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Demo User"}'),
  ('00000000-0000-0000-0000-000000000002', 'sarah@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Sarah Chen"}'),
  ('00000000-0000-0000-0000-000000000003', 'dr.wang@example.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Dr. Lisa Wang"}')
ON CONFLICT (id) DO NOTHING;

-- Create profiles for these users
INSERT INTO public.profiles (id, full_name, email, role, avatar_url, bio)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo User', 'demo@example.com', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo', 'Beauty enthusiast loving the journey!'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Chen', 'sarah@example.com', 'expert', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'Skincare expert and content creator.'),
  ('00000000-0000-0000-0000-000000000003', 'Dr. Lisa Wang', 'dr.wang@example.com', 'doctor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', 'Board-certified Dermatologist specializing in acne and anti-aging.')
ON CONFLICT (id) DO NOTHING;
