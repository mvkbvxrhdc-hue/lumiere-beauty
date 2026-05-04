-- Insert Courses
WITH instructor AS (SELECT id FROM profiles WHERE email = 'dr.wang@example.com' LIMIT 1)
INSERT INTO courses (title, description, instructor_id, duration, level, category, image_url, price, rating, students_count, what_you_learn, requirements)
VALUES
  (
    'Skincare Fundamentals: Complete Beginner Guide',
    'Master the basics of skincare with this comprehensive course. Learn about skin types, proper cleansing techniques, and building your first routine.',
    (SELECT id FROM instructor),
    '4 hours',
    'Beginner',
    'Basics',
    '/skincare-basics-course.jpg',
    0,
    4.9,
    12543,
    ARRAY['Identify your skin type', 'Understand skin anatomy', 'Master cleansing techniques', 'Build a routine'],
    ARRAY['No prior knowledge required', 'Willingness to learn']
  ),
  (
    'Anti-Aging Skincare Masterclass',
    'Advanced strategies for preventing and treating signs of aging. Learn about retinoids, peptides, and antioxidants.',
    (SELECT id FROM instructor),
    '6 hours',
    'Advanced',
    'Anti-Aging',
    '/anti-aging-skincare-course.jpg',
    79.00,
    4.8,
    8932,
    ARRAY['Understand skin aging', 'Master retinoid usage', 'Combine actives safely', 'Create anti-aging routine'],
    ARRAY['Basic skincare knowledge', 'Commitment to routine']
  ),
  (
    'Acne Treatment & Prevention Protocol',
    'Evidence-based strategies for treating and preventing acne using dermatologist-recommended ingredients.',
    (SELECT id FROM instructor),
    '5 hours',
    'Intermediate',
    'Acne',
    '/acne-treatment-course.jpg',
    59.00,
    4.9,
    15678,
    ARRAY['Understand acne formation', 'Use salicylic acid effectively', 'Apply benzoyl peroxide', 'Treat scarring'],
    ARRAY['Basic understanding of skincare', 'Patience for results']
  )
ON CONFLICT DO NOTHING;

-- Insert Lessons for the first course
WITH course AS (SELECT id FROM courses WHERE title = 'Skincare Fundamentals: Complete Beginner Guide' LIMIT 1)
INSERT INTO lessons (course_id, title, duration, type, content, video_url, "order")
VALUES
  ((SELECT id FROM course), 'Understanding Your Skin Type', '25 min', 'video', 'Learn how to identify your skin type...', 'https://www.youtube.com/watch?v=a1UxrjX9G44', 1),
  ((SELECT id FROM course), 'The Science of Skin Layers', '20 min', 'video', 'Explore the three main layers of skin...', 'https://www.youtube.com/watch?v=Ne7o1wpdOYQ', 2),
  ((SELECT id FROM course), 'Cleansing: The Foundation', '30 min', 'video', 'Master proper cleansing techniques...', 'https://www.youtube.com/watch?v=-Jt3gczy_4o', 3),
  ((SELECT id FROM course), 'Building Your First Routine', '35 min', 'video', 'Create a dermatologist-approved routine...', 'https://www.youtube.com/watch?v=oYtfaQTwx7A', 4)
ON CONFLICT DO NOTHING;
