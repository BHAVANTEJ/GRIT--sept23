import { Course } from './course.types';

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at?: string | null;
  /** Populated when the query joins the related course row. */
  courses?: Course | null;
}
