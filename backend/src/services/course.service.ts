import { supabaseAdmin } from '../config/supabase';
import { Course } from '../types/course.types';
import { AppError } from '../utils/errors';

/**
 * Course reads for the public API.
 *
 * Two changes from the previous version:
 *
 * 1. The three hardcoded sample courses that were returned whenever the query
 *    errored have been removed. The final courses are not decided yet, and
 *    silently serving invented ones made a broken DB connection look like a
 *    populated catalogue. An empty catalogue now returns an empty array.
 *
 * 2. `getCourseBySlug` now filters on is_published. This client uses the
 *    SERVICE ROLE key, which bypasses Row Level Security — so the missing
 *    filter meant any draft or archived course was publicly readable by slug
 *    through /api/courses/:slug. The filter has to be explicit here precisely
 *    because RLS cannot do it for us.
 */
export class CourseService {
  async getPublishedCourses(): Promise<Course[]> {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*, course_modules(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw new AppError('Unable to load courses', 502, error.message);
    }
    return data || [];
  }

  async getCourseBySlug(slug: string): Promise<Course> {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*, course_modules(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      throw new AppError('Unable to load course', 502, error.message);
    }
    if (!data) {
      throw new AppError('Course not found', 404);
    }
    return data;
  }
}

export const courseService = new CourseService();
