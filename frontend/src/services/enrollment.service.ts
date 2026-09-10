import { supabase } from '../lib/supabase';
import { Enrollment } from '../types/enrollment.types';

/**
 * Purchased / enrolled content access.
 *
 * `public.enrollments` is the existing access record in this project — there is
 * no separate orders or payments table — so it is the single source of truth for
 * "what has this user actually paid for or been granted".
 *
 *   auth user -> enrollments.user_id -> enrollments.course_id -> courses
 *
 * Access is NOT granted just for being signed in. The query is scoped to the
 * caller's own rows, and the RLS policy `Users can view their own enrollments`
 * (auth.uid() = user_id) enforces the same restriction server-side, so a crafted
 * client cannot read anyone else's entitlements.
 */
export const enrollmentService = {
  /** Courses the signed-in user actually has access to. */
  getMyEnrollments: async (userId: string): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId)
      .in('status', ['active', 'completed'])
      .order('enrolled_at', { ascending: false });

    if (error) {
      if (import.meta.env.DEV) {
        console.warn('[enrollments] query failed:', error.message);
      }
      throw error;
    }
    return (data ?? []) as Enrollment[];
  },

  /** True only when an access record exists for this user and course. */
  hasAccessToCourse: async (userId: string, courseId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .in('status', ['active', 'completed'])
      .maybeSingle();

    if (error) return false;
    return Boolean(data);
  },
};
