-- Migration: 005_create_learning_progress.sql
-- Create learning progress tracking table

CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    completed BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON public.learning_progress(user_id, course_id);

DROP TRIGGER IF EXISTS set_learning_progress_updated_at ON public.learning_progress;
CREATE TRIGGER set_learning_progress_updated_at
    BEFORE UPDATE ON public.learning_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
