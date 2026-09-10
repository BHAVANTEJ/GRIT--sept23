import { supabase } from '../lib/supabase';
import { Cohort } from '../types/cohort.types';
import { FALLBACK_COHORT } from '../data/cohorts';

/**
 * Cohort data.
 *
 * The landing-page countdown asks for the next upcoming cohort. When the
 * `cohorts` table exists and has an upcoming row, that row's `start_date` drives
 * the timer; otherwise the single configured date in `data/cohorts.ts` is used.
 * The date therefore lives in exactly one place per source, never inline in a
 * component.
 */
export const cohortService = {
  getUpcomingCohort: async (): Promise<Cohort> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .in('status', ['upcoming', 'active'])
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        if (error && import.meta.env.DEV) {
          console.warn('[cohorts] falling back to configured date:', error.message);
        }
        return FALLBACK_COHORT;
      }
      return data as Cohort;
    } catch {
      return FALLBACK_COHORT;
    }
  },

  getAllCohorts: async (): Promise<Cohort[]> => {
    const { data, error } = await supabase
      .from('cohorts')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Cohort[];
  },
};
