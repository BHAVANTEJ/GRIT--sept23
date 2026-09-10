-- Migration: 009_create_cohorts.sql
-- Cohort schedule. The landing-page countdown reads the next upcoming row.

CREATE TABLE IF NOT EXISTS public.cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    -- TIMESTAMPTZ, not DATE: the countdown targets a precise instant, and
    -- storing the zone removes any ambiguity about which midnight is meant.
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'upcoming'
        CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cohorts_status_start
    ON public.cohorts(status, start_date);

DROP TRIGGER IF EXISTS set_cohorts_updated_at ON public.cohorts;
CREATE TRIGGER set_cohorts_updated_at
    BEFORE UPDATE ON public.cohorts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed the cohort the countdown currently targets.
-- +05:30 is explicit so the instant is unambiguous regardless of server timezone.
INSERT INTO public.cohorts (name, start_date, status)
SELECT 'October 2026 Cohort', TIMESTAMPTZ '2026-10-09 00:00:00+05:30', 'upcoming'
WHERE NOT EXISTS (
    SELECT 1 FROM public.cohorts
    WHERE start_date = TIMESTAMPTZ '2026-10-09 00:00:00+05:30'
);
