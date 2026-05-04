-- Upgrade bookings system with enhanced features
-- Create service_bookings table if it doesn't exist

-- First create the service_bookings table if not exists
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    service_id TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    phone_number TEXT,
    email TEXT,
    service_name TEXT,
    service_duration TEXT,
    clinic_name TEXT,
    cancellation_reason TEXT,
    rescheduled_from UUID,
    reminder_sent_24h BOOLEAN DEFAULT FALSE,
    reminder_sent_1h BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on service_bookings
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for service_bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.service_bookings;

CREATE POLICY "Users can view own bookings" ON public.service_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.service_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.service_bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create booking reminders table
CREATE TABLE IF NOT EXISTS public.booking_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('email_24h', 'email_1h', 'sms_24h', 'sms_1h', 'confirmation', 'cancellation', 'reschedule')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_status TEXT DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'failed', 'pending')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinic time slots table
CREATE TABLE IF NOT EXISTS public.clinic_time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_name TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER DEFAULT 60,
    max_bookings_per_slot INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked dates table
CREATE TABLE IF NOT EXISTS public.clinic_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_name TEXT NOT NULL,
    blocked_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_blocked_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view reminders for their bookings" ON public.booking_reminders;
DROP POLICY IF EXISTS "Time slots viewable by everyone" ON public.clinic_time_slots;
DROP POLICY IF EXISTS "Blocked dates viewable by everyone" ON public.clinic_blocked_dates;

CREATE POLICY "Users can view reminders for their bookings" ON public.booking_reminders
    FOR SELECT USING (booking_id IN (SELECT id FROM public.service_bookings WHERE user_id = auth.uid()));

CREATE POLICY "Time slots viewable by everyone" ON public.clinic_time_slots
    FOR SELECT USING (true);

CREATE POLICY "Blocked dates viewable by everyone" ON public.clinic_blocked_dates
    FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_bookings_user_date ON public.service_bookings(user_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking_id ON public.booking_reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_clinic_time_slots_clinic ON public.clinic_time_slots(clinic_name, day_of_week);

-- Insert default time slots
INSERT INTO public.clinic_time_slots (clinic_name, day_of_week, start_time, end_time, slot_duration_minutes)
VALUES 
    ('Glow Medical Spa', 1, '09:00', '18:00', 60),
    ('Glow Medical Spa', 2, '09:00', '18:00', 60),
    ('Glow Medical Spa', 3, '09:00', '18:00', 60),
    ('Glow Medical Spa', 4, '09:00', '18:00', 60),
    ('Glow Medical Spa', 5, '09:00', '18:00', 60),
    ('Glow Medical Spa', 6, '10:00', '16:00', 60),
    ('Radiance Skin Clinic', 1, '08:00', '17:00', 45),
    ('Radiance Skin Clinic', 2, '08:00', '17:00', 45),
    ('Radiance Skin Clinic', 3, '08:00', '17:00', 45),
    ('Radiance Skin Clinic', 4, '08:00', '17:00', 45),
    ('Radiance Skin Clinic', 5, '08:00', '17:00', 45),
    ('Elite Dermatology Center', 1, '09:00', '19:00', 50),
    ('Elite Dermatology Center', 2, '09:00', '19:00', 50),
    ('Elite Dermatology Center', 3, '09:00', '19:00', 50),
    ('Elite Dermatology Center', 4, '09:00', '19:00', 50),
    ('Elite Dermatology Center', 5, '09:00', '19:00', 50),
    ('Elite Dermatology Center', 6, '10:00', '15:00', 50)
ON CONFLICT DO NOTHING;
