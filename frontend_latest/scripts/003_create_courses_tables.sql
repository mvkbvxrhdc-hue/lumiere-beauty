-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_name TEXT NOT NULL,
    instructor_title TEXT,
    instructor_avatar TEXT,
    duration TEXT,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT NOT NULL,
    image_url TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    student_count INTEGER DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0,
    what_you_learn TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    recommended_products UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    type TEXT CHECK (type IN ('video', 'reading', 'quiz')),
    content TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Courses viewable by everyone"
    ON public.courses FOR SELECT USING (true);

CREATE POLICY "Lessons viewable by enrolled users"
    ON public.lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments
            WHERE course_id = lessons.course_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own enrollments"
    ON public.course_enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
    ON public.course_enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
    ON public.lesson_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.lesson_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);
