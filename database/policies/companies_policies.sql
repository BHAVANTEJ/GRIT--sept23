-- RLS Policies: companies_policies.sql
-- Run AFTER 008_create_companies.sql and 010_admin_role_support.sql.

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- The landing-page marquee is public and unauthenticated, so visible rows must
-- be readable by the anon role. Hidden rows stay invisible to everyone but admins.
DROP POLICY IF EXISTS "Visible companies readable by everyone" ON public.companies;
CREATE POLICY "Visible companies readable by everyone"
ON public.companies FOR SELECT
USING (is_visible = true);

DROP POLICY IF EXISTS "Admins can read all companies" ON public.companies;
CREATE POLICY "Admins can read all companies"
ON public.companies FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can write companies" ON public.companies;
CREATE POLICY "Admins can write companies"
ON public.companies FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
