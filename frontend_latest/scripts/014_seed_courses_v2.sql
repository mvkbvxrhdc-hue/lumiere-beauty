-- Update course image paths to match existing files in public folder
UPDATE courses 
SET thumbnail = '/skincare-basics-course.jpg' 
WHERE title = 'Complete Skincare Basics';

UPDATE courses 
SET thumbnail = '/anti-aging-skincare-course.jpg' 
WHERE title = 'Advanced Anti-Aging Techniques';

UPDATE courses 
SET thumbnail = '/acne-treatment-course.jpg' 
WHERE title = 'Acne Treatment Masterclass';

-- Insert courses if they don't exist (using correct paths)
INSERT INTO courses (title, description, instructor_name, duration, level, price, original_price, category, rating, students_count, thumbnail, video_url, curriculum)
VALUES
  ('Complete Skincare Basics', 'Learn the fundamentals of proper skincare routines', 'Dr. Sarah Chen', '2.5 hours', 'Beginner', 29.99, 49.99, 'Skincare Fundamentals', 4.9, 1523, '/skincare-basics-course.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '["Introduction to Skin Types", "Daily Routine Steps", "Product Selection", "Common Mistakes"]'),
  ('Advanced Anti-Aging Techniques', 'Master professional anti-aging treatments and ingredients', 'Dr. Michael Kim', '4 hours', 'Advanced', 79.99, null, 'Anti-Aging', 4.8, 892, '/anti-aging-skincare-course.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '["Retinol Science", "Peptide Therapy", "Professional Treatments", "Home Care Protocols"]'),
  ('Acne Treatment Masterclass', 'Evidence-based approach to treating acne at all stages', 'Dr. Lisa Wang', '3 hours', 'Intermediate', 49.99, null, 'Problem Skin', 4.7, 1104, '/acne-treatment-course.jpg', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '["Understanding Acne", "Treatment Options", "Scar Prevention", "Maintenance Plans"]')
ON CONFLICT DO NOTHING;
