-- Migration: 006_create_intro_settings.sql
-- Create intro settings table for GRIT SCHOOL introduction configuration

CREATE TABLE IF NOT EXISTS public.intro_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_url TEXT NOT NULL DEFAULT '/videos/grit-school-intro.mp4',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO public.intro_settings (video_url, is_enabled)
SELECT '/videos/grit-school-intro.mp4', true
WHERE NOT EXISTS (SELECT 1 FROM public.intro_settings);
