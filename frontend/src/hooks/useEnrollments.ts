import { useEffect, useState } from 'react';
import { Enrollment } from '../types/enrollment.types';
import { enrollmentService } from '../services/enrollment.service';

/**
 * Loads the signed-in user's own enrollments — the courses they have actually
 * purchased or been granted. Returns an empty list for users with no access,
 * rather than falling back to the full catalogue.
 */
export const useEnrollments = (userId?: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    enrollmentService
      .getMyEnrollments(userId)
      .then((data) => {
        if (!cancelled) {
          setEnrollments(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Most often the enrollments table has not been created yet. Treat it
          // as "no purchased content" rather than blocking the whole dashboard.
          setEnrollments([]);
          setError('Could not load your enrolled courses.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { enrollments, loading, error };
};
