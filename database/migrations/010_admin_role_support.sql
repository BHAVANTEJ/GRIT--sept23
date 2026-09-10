-- Migration: 010_admin_role_support.sql
-- Role-based access control helpers for the admin dashboard.
--
-- Everything privileged is enforced HERE, in the database, not in React. Hiding
-- the Admin button is a UX detail; these functions and the policies in
-- database/policies/admin_policies.sql are what actually stop a normal user.

-- ---------------------------------------------------------------------------
-- is_admin(): the single predicate every admin policy reuses.
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER + a fixed search_path so it can read public.profiles without
-- being subject to profiles' own RLS (which would otherwise recurse when the
-- policies below call it).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- PRIVILEGE ESCALATION FIX
-- ---------------------------------------------------------------------------
-- The original policy was:
--
--   CREATE POLICY "Users can update their own profile"
--   ON public.profiles FOR UPDATE USING (auth.uid() = id);
--
-- It has no WITH CHECK and no column restriction, so ANY signed-in user could
-- run `update profiles set role = 'admin' where id = auth.uid()` from the
-- browser and grant themselves the admin dashboard. Replaced below with a
-- policy that permits self-updates but pins `role` to its current value.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id
    -- role must equal what is already stored: users cannot promote themselves.
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
);

-- Only admins may change anyone's role (including demoting other admins).
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- get_admin_stats(): real overview numbers, no fabricated statistics.
-- ---------------------------------------------------------------------------
-- `verified_users` requires auth.users.email_confirmed_at, which is not exposed
-- to the anon/authenticated roles. A SECURITY DEFINER function that re-checks
-- is_admin() on every call is the safe way to surface that count without
-- handing the frontend a service-role key.
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied: admin role required'
            USING ERRCODE = '42501';
    END IF;

    SELECT json_build_object(
        'total_users',       (SELECT COUNT(*) FROM public.profiles),
        'verified_users',    (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL),
        'admin_users',       (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
        'published_courses', (SELECT COUNT(*) FROM public.courses WHERE status = 'published'),
        'draft_courses',     (SELECT COUNT(*) FROM public.courses WHERE status = 'draft'),
        'archived_courses',  (SELECT COUNT(*) FROM public.courses WHERE status = 'archived'),
        'total_enrollments', (SELECT COUNT(*) FROM public.enrollments WHERE status IN ('active', 'completed')),
        'visible_companies', (SELECT COUNT(*) FROM public.companies WHERE is_visible),
        'upcoming_cohort',   (
            SELECT json_build_object('id', c.id, 'name', c.name, 'start_date', c.start_date, 'status', c.status)
            FROM public.cohorts c
            WHERE c.status IN ('upcoming', 'active')
            ORDER BY c.start_date ASC
            LIMIT 1
        )
    ) INTO result;

    RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

-- ---------------------------------------------------------------------------
-- Admin user listing (again, email_confirmed_at lives in auth.users).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_admin_users(page_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    email_verified BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied: admin role required'
            USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    SELECT
        p.id,
        p.email,
        p.full_name,
        p.role,
        (u.email_confirmed_at IS NOT NULL) AS email_verified,
        p.created_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    ORDER BY p.created_at DESC
    LIMIT LEAST(GREATEST(page_limit, 1), 200);
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_users(INTEGER) TO authenticated;
