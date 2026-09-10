import React from 'react';
import { BookOpen } from 'lucide-react';
import { Course } from '../../../types/course.types';
import { CourseCard } from './CourseCard';
import { COURSES_EMPTY_STATE_MESSAGE } from '../../../data/courses';

interface CourseGridProps {
  courses: Course[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  // The catalogue is genuinely empty until courses are published. Saying so is
  // correct; inventing placeholder courses to fill the grid is not.
  if (courses.length === 0) {
    return (
      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg-alt)',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <BookOpen size={26} color="var(--color-primary)" />
        </div>
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          {COURSES_EMPTY_STATE_MESSAGE}
        </h3>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
            maxWidth: '420px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Our next cohort curriculum is being finalised. Join the next cohort to be notified the
          moment enrolment opens.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
