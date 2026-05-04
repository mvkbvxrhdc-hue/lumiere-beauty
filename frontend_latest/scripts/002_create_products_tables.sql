-- Products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category TEXT NOT NULL,
    skin_types TEXT[] DEFAULT '{}',
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    badge TEXT,
    tags TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    seller TEXT,
    shipping_info TEXT,
    highlights TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews table
CREATE TABLE public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    skin_type TEXT,
    age TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Q&A table
CREATE TABLE public.product_qna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    asked_by UUID REFERENCES public.profiles(id),
    answered_by UUID REFERENCES public.profiles(id),
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_qna ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone"
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Reviews are viewable by everyone"
    ON public.product_reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews"
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "QnA viewable by everyone"
    ON public.product_qna FOR SELECT USING (true);

CREATE POLICY "Users can ask questions"
    ON public.product_qna FOR INSERT
    WITH CHECK (auth.uid() = asked_by);
