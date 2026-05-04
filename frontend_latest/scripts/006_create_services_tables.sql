-- Beauty services table
CREATE TABLE public.beauty_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    duration TEXT,
    category TEXT CHECK (category IN ('facial', 'anti-aging', 'laser', 'body', 'spa')),
    image_url TEXT,
    features TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    process TEXT[] DEFAULT '{}',
    faqs JSONB DEFAULT '[]',
    partner_clinic TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service bookings table
CREATE TABLE public.service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.beauty_services(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service reviews table
CREATE TABLE public.service_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.beauty_services(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, user_id)
);

-- Enable RLS
ALTER TABLE public.beauty_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Services viewable by everyone"
    ON public.beauty_services FOR SELECT USING (true);

CREATE POLICY "Users can view own bookings"
    ON public.service_bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
    ON public.service_bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
    ON public.service_bookings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Service reviews viewable by everyone"
    ON public.service_reviews FOR SELECT USING (true);

CREATE POLICY "Users can create service reviews"
    ON public.service_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);
