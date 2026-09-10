-- RLS Policies: admin_policies.sql
-- Write access for the admin dashboard. Run AFTER 010_admin_role_support.sql.
--
-- Design rule: normal authenticated users keep exactly the read access they had.
-- Every INSERT / UPDATE / DELETE on catalogue tables is gated on
-- public.is_admin(), so a non-admin calling supabase.from('courses').insert()
-- straight from the browser console is rejected by Postgres, not by the UI.

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
-- Admins additionally need to SEE draft and archived rows. The existing
-- "Published courses readable by everyone" policy stays untouched; policies are
-- OR-ed, so this widens visibility for admins only.
DROP POLICY IF EXISTS "Admins can read all courses" ON public.courses;
CREATE POLICY "Admins can read all courses"
ON public.courses FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
CREATE POLICY "Admins can insert courses"
ON public.courses FOR INSERT
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
CREATE POLICY "Admins can update courses"
ON public.courses FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
CREATE POLICY "Admins can delete courses"
ON public.courses FOR DELETE
USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- course_modules
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can write course modules" ON public.course_modules;
CREATE POLICY "Admins can write course modules"
ON public.course_modules FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- enrollments — admins may review and grant access
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can read all enrollments" ON public.enrollments;
CREATE POLICY "Admins can read all enrollments"
ON public.enrollments FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can write enrollments" ON public.enrollments;
CREATE POLICY "Admins can write enrollments"
ON public.enrollments FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- intro_settings — was left without RLS entirely
-- ---------------------------------------------------------------------------
ALTER TABLE public.intro_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Intro settings readable by everyone" ON public.intro_settings;
CREATE POLICY "Intro settings readable by everyone"
ON public.intro_settings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can write intro settings" ON public.intro_settings;
CREATE POLICY "Admins can write intro settings"
ON public.intro_settings FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
