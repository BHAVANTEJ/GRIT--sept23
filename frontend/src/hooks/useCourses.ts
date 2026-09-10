import { useState, useEffect } from 'react';
import { Course } from '../types/course.types';
import { courseService } from '../services/course.service';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    courseService
      .getCourses()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch courses');
        setLoading(false);
      });
  }, []);

  return { courses, loading, error };
};
