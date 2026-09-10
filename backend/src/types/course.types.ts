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
  is_published: boolean;
  created_at: string;
  updated_at: string;
  modules?: CourseModule[];
}
