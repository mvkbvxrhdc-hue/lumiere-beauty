-- Treatment records table
CREATE TABLE public.treatment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('injection', 'laser', 'surgery', 'facial', 'other')),
    name TEXT NOT NULL,
    treatment_date DATE NOT NULL,
    doctor_name TEXT NOT NULL,
    doctor_specialty TEXT,
    clinic_name TEXT,
    doctor_avatar TEXT,
    description TEXT,
    area TEXT,
    cost DECIMAL(10, 2),
    before_photo_url TEXT,
    after_photo_url TEXT,
    notes TEXT,
    next_appointment DATE,
    status TEXT CHECK (status IN ('completed', 'scheduled', 'follow-up')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.treatment_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own treatments"
    ON public.treatment_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own treatments"
    ON public.treatment_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own treatments"
    ON public.treatment_records FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own treatments"
    ON public.treatment_records FOR DELETE
    USING (auth.uid() = user_id);
