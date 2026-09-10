-- RLS Policies: cohorts_policies.sql
-- Run AFTER 009_create_cohorts.sql and 010_admin_role_support.sql.

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

-- The countdown on the public landing page reads the upcoming cohort while
-- signed out, so upcoming/active rows must be readable by the anon role.
DROP POLICY IF EXISTS "Upcoming cohorts readable by everyone" ON public.cohorts;
CREATE POLICY "Upcoming cohorts readable by everyone"
ON public.cohorts FOR SELECT
USING (status IN ('upcoming', 'active'));

DROP POLICY IF EXISTS "Admins can read all cohorts" ON public.cohorts;
CREATE POLICY "Admins can read all cohorts"
ON public.cohorts FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can write cohorts" ON public.cohorts;
CREATE POLICY "Admins can write cohorts"
ON public.cohorts FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
