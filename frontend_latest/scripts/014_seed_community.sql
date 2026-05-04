-- Insert Community Posts
WITH user1 AS (SELECT id FROM profiles WHERE email = 'sarah@example.com' LIMIT 1),
     user2 AS (SELECT id FROM profiles WHERE email = 'dr.wang@example.com' LIMIT 1)
INSERT INTO community_posts (author_id, title, content, excerpt, category, tags, likes_count, views_count)
VALUES
  (
    (SELECT id FROM user1),
    'My Complete Morning Skincare Routine for Glowing Skin',
    'After years of trial and error, I have finally perfected my morning routine... Step 1: Gentle Cleanser...',
    'Sharing my detailed 7-step morning routine that transformed my skin...',
    'Routines',
    ARRAY['Morning Routine', 'Glowing Skin', 'Skincare Tips'],
    1234,
    8903
  ),
  (
    (SELECT id FROM user2),
    'The Truth About Chemical Peels',
    'As a board-certified dermatologist, I want to demystify chemical peels... Types of peels: Superficial, Medium, Deep...',
    'Comprehensive medical guide to chemical peels including types and aftercare...',
    'Treatments',
    ARRAY['Chemical Peels', 'Dermatology', 'Medical Advice'],
    2456,
    15234
  )
ON CONFLICT DO NOTHING;
