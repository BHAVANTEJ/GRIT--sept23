import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { CourseGrid } from './components/CourseGrid';
import { CourseFilters } from './components/CourseFilters';
import { useCourses } from '../../hooks/useCourses';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import './Courses.css';

export const Courses: React.FC = () => {
  const { courses, loading, error } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Programs');

  return (
    <MainLayout>
      <div className="courses-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <SectionHeading
            badge="CURRICULUM CATALOG"
            title={<>Flagship <span className="highlight-purple">Engineering Cohorts</span></>}
            subtitle="Master modern web architectures, distributed systems, and agentic AI through deliberate practice."
          />

          <CourseFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          {loading ? (
            <Loading message="Loading GRIT SCHOOL curriculum..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <CourseGrid courses={courses} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
