export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  position: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_url?: string;
  duration_weeks: number;
  price: number;
  /**
   * Kept for backwards compatibility with the existing RLS policy and any code
   * that predates `status`. Migration 007 keeps the two in sync via a trigger.
   */
  is_published: boolean;
  status?: CourseStatus;
  display_order?: number;
  created_at: string;
  updated_at: string;
  course_modules?: CourseModule[];
}

export interface CourseUpsertDTO {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_url?: string | null;
  duration_weeks?: number;
  price?: number;
  status?: CourseStatus;
  display_order?: number;
}
