import { Course } from '../types/course.types';

/**
 * Course data layer — deliberately EMPTY.
 *
 * The final GRIT SCHOOL courses have not been decided yet, so no course
 * information is invented here and none is hardcoded inside UI components.
 * `courseService` reads the Supabase `courses` table; when it returns nothing
 * the Courses page renders the "Courses coming soon." empty state.
 *
 * To publish courses, insert rows into `public.courses` (status = 'published')
 * via the admin dashboard or SQL. Nothing in the UI needs to change.
 *
 * If you ever need local seed data before the table is populated, add entries
 * here — the UI reads whatever this array contains as a fallback.
 */
export const FALLBACK_COURSES: Course[] = [];

export const COURSES_EMPTY_STATE_MESSAGE = 'Courses coming soon.';
