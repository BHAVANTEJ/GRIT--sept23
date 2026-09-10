import { supabase } from '../lib/supabase';

export interface AdminStats {
  total_users: number;
  verified_users: number;
  admin_users: number;
  published_courses: number;
  draft_courses: number;
  archived_courses: number;
  total_enrollments: number;
  visible_companies: number;
  upcoming_cohort: { id: string; name: string; start_date: string; status: string } | null;
}

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  email_verified: boolean;
  created_at: string;
}

/**
 * Admin data access.
 *
 * Both calls go through SECURITY DEFINER Postgres functions that re-check
 * `public.is_admin()` server-side (migration 010). A non-admin who calls them
 * directly gets a 42501 error from the database — the UI guard is convenience,
 * this is the actual control. No service-role key is involved on the client.
 */
export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data as AdminStats;
  },

  getUsers: async (limit = 50): Promise<AdminUserRow[]> => {
    const { data, error } = await supabase.rpc('get_admin_users', { page_limit: limit });
    if (error) throw error;
    return (data ?? []) as AdminUserRow[];
  },
};
