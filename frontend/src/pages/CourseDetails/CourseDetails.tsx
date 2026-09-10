import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Course } from '../../types/course.types';
import { courseService } from '../../services/course.service';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { CheckCircle2, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import './CourseDetails.css';

export const CourseDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    courseService
      .getCourseBySlug(slug)
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Course not found');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <MainLayout><Loading message="Loading course details..." /></MainLayout>;
  if (error || !course) return <MainLayout><ErrorMessage message={error || 'Course not found'} /></MainLayout>;

  return (
    <MainLayout>
      <div className="course-details-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <span>Back to All Courses</span>
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
            {/* Left Column: Details & Modules */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <Badge variant="purple">{course.duration_weeks} Weeks Duration</Badge>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', lineHeight: 1.2 }}>
                {course.title}
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
                {course.description}
              </p>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                Syllabus & Modules
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.course_modules?.map((module, idx) => (
                  <div key={module.id || idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#6366F1" />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                        {module.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', paddingLeft: '2.25rem', lineHeight: 1.5 }}>
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Enrollment Card */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' }}>
              {course.thumbnail_url && (
                <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
                  {formatCurrency(course.price)}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ full cohort</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#6366F1" />
                  <span>{course.duration_weeks} Weeks Cohort</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="#6366F1" />
                  <span>Next Cohort Starts Soon</span>
                </div>
              </div>

              <Button variant="primary" size="lg" fullWidth>
                Enroll in Cohort
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
