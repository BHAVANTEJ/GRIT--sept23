-- Migration: 008_create_companies.sql
-- Company display data for the landing-page marquee.
--
-- NOTE: this table records companies shown on the marketing site. It carries no
-- claim of partnership or endorsement; the section heading in the UI is worded
-- accordingly.

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_visible_order
    ON public.companies(is_visible, display_order);

DROP TRIGGER IF EXISTS set_companies_updated_at ON public.companies;
CREATE TRIGGER set_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
