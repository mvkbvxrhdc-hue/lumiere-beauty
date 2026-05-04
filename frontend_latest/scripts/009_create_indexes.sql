-- Performance indexes

-- Products
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_rating ON public.products(rating DESC);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- Product reviews
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);

-- Courses
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_rating ON public.courses(rating DESC);

-- Course enrollments
CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);

-- Community posts
CREATE INDEX idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_posts_likes_count ON public.community_posts(likes_count DESC);

-- Post comments
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX idx_post_comments_parent_id ON public.post_comments(parent_id);

-- Treatment records
CREATE INDEX idx_treatment_records_user_id ON public.treatment_records(user_id);
CREATE INDEX idx_treatment_records_date ON public.treatment_records(treatment_date DESC);

-- Service bookings
CREATE INDEX idx_service_bookings_user_id ON public.service_bookings(user_id);
CREATE INDEX idx_service_bookings_service_id ON public.service_bookings(service_id);
CREATE INDEX idx_service_bookings_date ON public.service_bookings(booking_date);

-- Orders
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Messages
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
