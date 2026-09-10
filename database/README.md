# GRIT SCHOOL Database Schema & Migrations

This folder contains the complete SQL database migrations, seed data, and Row Level Security (RLS) policies for Supabase PostgreSQL.

## Migration Order

Execute the SQL scripts in order using the Supabase SQL Editor or the SQL CLI:

1. `migrations/001_create_profiles.sql`
2. `migrations/002_create_courses.sql`
3. `migrations/003_create_course_modules.sql`
4. `migrations/004_create_enrollments.sql`
5. `migrations/005_create_learning_progress.sql`
6. `migrations/006_create_intro_settings.sql`
7. `migrations/007_alter_courses_add_status.sql` — adds `status` (draft/published/archived) and `display_order`, kept in sync with the existing `is_published` boolean by a trigger
8. `migrations/008_create_companies.sql` — landing-page marquee data
9. `migrations/009_create_cohorts.sql` — cohort schedule; seeds the October 2026 cohort the countdown targets
10. `migrations/010_admin_role_support.sql` — `is_admin()`, admin stats/users RPCs, **and the privilege-escalation fix on `profiles`**

## RLS Policies

Execute policy scripts **after** the migrations above:

1. `policies/profiles_policies.sql`
2. `policies/courses_policies.sql`
3. `policies/enrollments_policies.sql`
4. `policies/progress_policies.sql`
5. `policies/companies_policies.sql`
6. `policies/cohorts_policies.sql`
7. `policies/admin_policies.sql`

> **Order matters.** `companies_policies`, `cohorts_policies` and `admin_policies` all call `public.is_admin()`, which is created by migration 010.

> **Re-running `profiles_policies.sql` after 010 will reintroduce the privilege-escalation hole.** Migration 010 deliberately replaces the `"Users can update their own profile"` policy defined there. If you re-run the older file, re-run 010 afterwards.

## Security notes

- `profiles.role` (`student` / `instructor` / `admin`) drives all admin access. Every admin policy is gated on `public.is_admin()`, so a non-admin calling the tables directly from the browser is rejected by Postgres, not merely by hidden UI.
- Users may update their own profile but **cannot change their own `role`** — the `WITH CHECK` clause in migration 010 pins it to the stored value.
- `get_admin_stats()` and `get_admin_users()` are `SECURITY DEFINER` (they read `auth.users.email_confirmed_at`, which is not exposed to the `authenticated` role) and re-check `is_admin()` on every call.

## Granting the first admin

There is no self-service path to admin, by design. Promote the first one manually in the Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'you@example.com';
```

The user must sign out and back in (or reload) for the app to pick up the new role.

## Seed Data

- `seed/seed_companies.sql` — populates the landing-page marquee. Safe to run.
- `seed/seed_courses.sql` — ⚠️ **placeholder courses only.** The final GRIT SCHOOL courses have not been decided; run this only to exercise the UI locally. The app works correctly with an empty `courses` table and shows "Courses coming soon."
