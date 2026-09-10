import { Cohort } from '../types/cohort.types';

/**
 * SINGLE SOURCE OF TRUTH for the upcoming cohort start date.
 *
 * The project had no existing timezone configuration, so the timezone is made
 * explicit here (and overridable via env) instead of being re-assumed in every
 * component that touches a date.
 *
 * The value is a full ISO 8601 string WITH an explicit UTC offset. That matters:
 * a bare "2026-10-09" would be parsed as UTC midnight by `new Date()`, which is
 * 05:30 IST on the same day — a silent 5.5 hour drift. Keeping the offset in the
 * string means every browser, in every timezone, counts down to the same instant.
 *
 * Override with VITE_COHORT_START_DATE (same ISO-with-offset format).
 */
export const COHORT_START_DATE: string =
  import.meta.env.VITE_COHORT_START_DATE || '2026-10-09T00:00:00+05:30';

/** Human-readable label for the timezone the date above is expressed in. */
export const COHORT_TIMEZONE_LABEL: string =
  import.meta.env.VITE_COHORT_TIMEZONE_LABEL || 'IST';

/** Display name for the upcoming cohort. */
export const COHORT_NAME: string =
  import.meta.env.VITE_COHORT_NAME || 'October 2026 Cohort';

/**
 * Fallback cohort used when the Supabase `cohorts` table is empty or
 * unreachable, so the landing page countdown always has a target.
 */
export const FALLBACK_COHORT: Cohort = {
  id: 'fallback-upcoming',
  name: COHORT_NAME,
  start_date: COHORT_START_DATE,
  end_date: null,
  status: 'upcoming',
};

/** Resolved Date object for the cohort start. */
export const getCohortStartDate = (isoDate: string = COHORT_START_DATE): Date =>
  new Date(isoDate);

/**
 * Formats the cohort start for headings, e.g. "October 9".
 * Rendered in the cohort's own timezone so the heading and the countdown agree.
 */
export const formatCohortStart = (
  isoDate: string = COHORT_START_DATE,
  options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'Asia/Kolkata' }).format(date);
};
