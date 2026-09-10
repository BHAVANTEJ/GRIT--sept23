import { Course, CourseUpsertDTO } from '../types/course.types';
import { supabase } from '../lib/supabase';
import { FALLBACK_COURSES } from '../data/courses';

/**
 * Course data access.
 *
 * The three fully-written sample courses that used to live inline in this file
 * have been removed: the final GRIT SCHOOL courses are not decided yet, and
 * silently substituting invented ones made an empty database look populated.
 * Seed data — if ever needed — now belongs in `data/courses.ts`, and the public
 * pages render "Courses coming soon." when there is nothing to show.
 */
export const courseService = {
  /** Public catalogue: published courses only. */
  getCourses: async (): Promise<Course[]> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_modules(*)')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('[courses] query failed, using local fallback:', error.message);
        }
        return FALLBACK_COURSES;
      }
      return (data ?? []) as Course[];
    } catch {
      return FALLBACK_COURSES;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_modules(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        return FALLBACK_COURSES.find((c) => c.slug === slug) ?? null;
      }
      return data as Course;
    } catch {
      return FALLBACK_COURSES.find((c) => c.slug === slug) ?? null;
    }
  },

  /** Admin view: every course regardless of status. */
  getAllCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Course[];
  },

  upsertCourse: async (course: CourseUpsertDTO): Promise<Course> => {
    const { data, error } = await supabase.from('courses').upsert(course).select().single();
    if (error) throw error;
    return data as Course;
  },

  setStatus: async (id: string, status: Course['status']): Promise<void> => {
    const { error } = await supabase.from('courses').update({ status }).eq('id', id);
    if (error) throw error;
  },
};
