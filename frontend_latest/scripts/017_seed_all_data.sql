-- Seed Users and Profiles
INSERT INTO profiles (id, name, avatar, bio, is_professional, professional_title, location, website)
VALUES
  ('user-1', 'Demo User', '/default-avatar.jpg', 'Beauty enthusiast and skincare lover', false, null, 'Los Angeles, CA', null),
  ('user-2', 'Sarah Chen', '/placeholder.svg?height=100&width=100', 'Licensed Esthetician with 10+ years experience', true, 'Licensed Esthetician', 'New York, NY', 'https://sarahchen.com'),
  ('user-3', 'Dr. Lisa Wang', '/placeholder.svg?height=100&width=100', 'Board-certified Dermatologist specializing in medical aesthetics', true, 'Board-Certified Dermatologist', 'San Francisco, CA', 'https://drwang.com');

-- Seed Products
INSERT INTO products (id, name, description, price, original_price, category, skin_type, rating, review_count, in_stock, image, badge, brand, size, ingredients, benefits, how_to_use)
VALUES
  ('prod-1', 'Vitamin C Brightening Serum', 'A powerful antioxidant serum that brightens and evens skin tone', 45.00, 60.00, 'Serums', ARRAY['All', 'Dull'], 4.8, 1234, true, '/products/vitamin-c-serum.jpg', 'Best Seller', 'KEYAN', '30ml', 'Vitamin C, Hyaluronic Acid, Ferulic Acid', ARRAY['Brightens skin tone', 'Reduces dark spots', 'Antioxidant protection'], 'Apply 3-4 drops to clean face morning and evening'),
  ('prod-2', 'Hydrating Moisturizer', 'Lightweight yet deeply hydrating moisturizer for all skin types', 38.00, null, 'Moisturizers', ARRAY['All', 'Dry'], 4.7, 892, true, '/products/moisturizer.jpg', null, 'KEYAN', '50ml', 'Hyaluronic Acid, Ceramides, Niacinamide', ARRAY['Deep hydration', 'Strengthens skin barrier', 'Reduces redness'], 'Apply to face and neck after serum'),
  ('prod-3', 'Gentle Cleansing Foam', 'pH-balanced foaming cleanser that removes impurities without stripping', 28.00, null, 'Cleansers', ARRAY['All', 'Sensitive'], 4.9, 2156, true, '/products/cleanser.jpg', 'New', 'KEYAN', '150ml', 'Amino Acids, Glycerin, Allantoin', ARRAY['Gentle cleansing', 'Maintains pH balance', 'Soothes skin'], 'Use morning and evening on damp skin'),
  ('prod-4', 'Retinol Night Treatment', 'Advanced retinol formula for anti-aging and skin renewal', 65.00, 85.00, 'Treatments', ARRAY['Normal', 'Aging'], 4.6, 567, true, '/products/retinol.jpg', 'Professional', 'KEYAN', '30ml', 'Retinol 0.5%, Peptides, Squalane', ARRAY['Reduces fine lines', 'Improves texture', 'Boosts collagen'], 'Apply at night after cleansing, start 2x per week');

-- Seed Courses
INSERT INTO courses (id, title, description, instructor, instructor_title, instructor_avatar, category, level, duration, price, rating, student_count, image, what_you_learn, requirements, includes)
VALUES
  ('course-1', 'Complete Skincare Fundamentals', 'Master the basics of skincare science and build an effective routine', 'Dr. Lisa Wang', 'Board-Certified Dermatologist', '/placeholder.svg?height=100&width=100', 'Skincare Basics', 'Beginner', '4 weeks', 0, 4.9, 15234, '/courses/fundamentals.jpg', 
   ARRAY['Understanding skin types', 'Building a routine', 'Product selection', 'Common mistakes to avoid'],
   ARRAY['No prior knowledge needed', 'Willingness to learn'],
   ARRAY['12 video lessons', 'Downloadable resources', 'Certificate of completion']),
  ('course-2', 'Advanced Anti-Aging Techniques', 'Professional-level anti-aging strategies and treatments', 'Sarah Chen', 'Licensed Esthetician', '/placeholder.svg?height=100&width=100', 'Anti-Aging', 'Advanced', '6 weeks', 99, 4.8, 3421, '/courses/anti-aging.jpg',
   ARRAY['Advanced ingredient knowledge', 'Professional treatments', 'At-home protocols', 'Prevention strategies'],
   ARRAY['Basic skincare knowledge', 'Understanding of skin anatomy'],
   ARRAY['18 video lessons', 'Treatment protocols', 'Product recommendations']);

-- Seed Lessons for Course 1
INSERT INTO lessons (id, course_id, title, description, duration, video_url, order_index, is_free)
VALUES
  ('lesson-1-1', 'course-1', 'Introduction to Skin Types', 'Learn about different skin types and how to identify yours', '15:30', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, true),
  ('lesson-1-2', 'course-1', 'The Science of Cleansing', 'Understanding pH balance and proper cleansing techniques', '20:45', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, true),
  ('lesson-1-3', 'course-1', 'Moisturizing Essentials', 'How to choose and apply the right moisturizer', '18:20', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, false);

-- Seed Community Posts
INSERT INTO community_posts (id, author_id, title, content, excerpt, category, tags, likes, comments_count, views)
VALUES
  ('post-1', 'user-2', 'My 10-Step Korean Skincare Routine', 'After years of trial and error, I''ve finally perfected my routine. Here''s what works for me...', 'After years of trial and error, I''ve finally perfected my routine...', 'Routines', ARRAY['korean-skincare', 'routine', 'tips'], 234, 45, 1523),
  ('post-2', 'user-3', 'Understanding Retinol: A Dermatologist''s Guide', 'Retinol is one of the most researched and effective anti-aging ingredients. Let me break down everything you need to know...', 'Retinol is one of the most researched and effective anti-aging ingredients...', 'Ingredients', ARRAY['retinol', 'anti-aging', 'science'], 567, 89, 3421),
  ('post-3', 'user-1', 'Best Sunscreens for Sensitive Skin', 'I''ve tested over 20 sunscreens and these are my top picks for sensitive skin types...', 'I''ve tested over 20 sunscreens and these are my top picks...', 'Reviews', ARRAY['sunscreen', 'sensitive-skin', 'reviews'], 123, 34, 892);

-- Seed Beauty Services
INSERT INTO beauty_services (id, name, description, category, duration, price, rating, review_count, image, benefits, what_to_expect, aftercare, suitable_for)
VALUES
  ('service-1', 'HydraFacial Treatment', 'Deep cleansing and hydration facial treatment', 'Facial Treatments', '60 minutes', 150, 4.9, 234, '/services/hydrafacial.jpg',
   ARRAY['Deep cleansing', 'Intense hydration', 'Immediate glow', 'No downtime'],
   'A multi-step treatment including cleansing, exfoliation, extraction, and hydration',
   'Avoid sun exposure for 24 hours, use gentle products',
   ARRAY['All skin types', 'Dehydrated skin', 'Dull complexion']),
  ('service-2', 'Botox Consultation & Treatment', 'Professional Botox injections for wrinkle reduction', 'Injectable Treatments', '30 minutes', 350, 4.8, 156, '/services/botox.jpg',
   ARRAY['Reduces fine lines', 'Prevents wrinkles', 'Natural results', 'Quick procedure'],
   'Consultation followed by precise injections in targeted areas',
   'Avoid lying down for 4 hours, no exercise for 24 hours',
   ARRAY['Fine lines', 'Forehead wrinkles', 'Crow''s feet']);

-- Seed Treatment Records for Demo User
INSERT INTO treatment_records (id, user_id, treatment_type, treatment_name, date, doctor_name, doctor_specialty, clinic_name, cost, notes, before_photo, after_photo, satisfaction_rating)
VALUES
  ('treatment-1', 'user-1', 'injection', 'Botox Forehead', '2024-01-15', 'Dr. Lisa Wang', 'Dermatologist', 'KEYAN Medical Aesthetics', 350, 'First time trying Botox. Results visible after 3 days.', '/woman-forehead-wrinkles-before.jpg', '/woman-smooth-forehead-after.jpg', 5),
  ('treatment-2', 'user-1', 'laser', 'IPL Photofacial', '2024-02-20', 'Dr. Sarah Chen', 'Aesthetic Physician', 'KEYAN Skin Clinic', 400, 'Targeting sun damage and pigmentation. Mild redness for 2 days.', '/woman-face-pigmentation-before.jpg', '/woman-clear-skin-after.jpg', 4);

-- Create some sample reviews
INSERT INTO product_reviews (product_id, user_id, rating, title, content, helpful_count)
VALUES
  ('prod-1', 'user-2', 5, 'Amazing results!', 'This serum has completely transformed my skin. My dark spots are fading and my complexion is so much brighter.', 45),
  ('prod-1', 'user-3', 5, 'Professional quality', 'As a dermatologist, I recommend this to my patients. The formulation is excellent and results are consistent.', 67),
  ('prod-2', 'user-1', 4, 'Great moisturizer', 'Very hydrating without being greasy. Perfect for my combination skin.', 23);

-- Create sample service reviews
INSERT INTO service_reviews (service_id, user_id, rating, title, content, helpful_count)
VALUES
  ('service-1', 'user-1', 5, 'Best facial ever!', 'My skin has never looked better. The results lasted for weeks.', 34),
  ('service-2', 'user-2', 5, 'Natural results', 'Dr. Wang is amazing. The results look so natural, nobody can tell.', 56);
