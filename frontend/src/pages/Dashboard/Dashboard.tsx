import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { useEnrollments } from '../../hooks/useEnrollments';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { COHORT_NAME, COHORT_START_DATE, formatCohortStart } from '../../data/cohorts';
import { BookOpen, Trophy, ArrowRight, Lock } from 'lucide-react';
import './Dashboard.css';

/**
 * Learner dashboard.
 *
 * Shows only what this user actually has access to. The counters used to be
 * literals ("1 active cohort", "4 completed projects", "98% grit score") shown
 * identically to everyone; they are now derived from the user's own enrollment
 * records, and a user with no purchases sees an explicit empty state rather than
 * someone else's numbers.
 */
export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { enrollments, loading } = useEnrollments(user?.id);

  const activeCount = enrollments.filter((e) => e.status === 'active').length;
  const completedCount = enrollments.filter((e) => e.status === 'completed').length;

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <Badge variant="purple">LEARNER DASHBOARD</Badge>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--color-text)',
                marginTop: '0.5rem',
              }}
            >
              Welcome Back, {profile?.full_name || user?.email || 'Engineer'}!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
              Track your GRIT SCHOOL progress, active cohorts, and project submissions.
            </p>
          </div>

          {loading ? (
            <Loading message="Loading your courses..." />
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '3rem',
                }}
              >
                <Card hoverable={false}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Active Courses
                      </span>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        {activeCount}
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card hoverable={false}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981' }}>
                      <Trophy size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Completed
                      </span>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        {completedCount}
                      </h3>
                    </div>
                  </div>
                </Card>
              </div>

              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  marginBottom: '1.25rem',
                }}
              >
                My Courses
              </h2>

              {enrollments.length === 0 ? (
                <Card hoverable={false} style={{ padding: '3rem 2rem', textAlign: 'center' }}>
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
                    <Lock size={24} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                    You haven&apos;t enrolled in a course yet
                  </h3>
                  <p
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.95rem',
                      maxWidth: '420px',
                      margin: '0 auto 1.75rem auto',
                      lineHeight: 1.6,
                    }}
                  >
                    Course content unlocks here as soon as your enrolment is confirmed.
                  </p>
                  <Link to="/courses">
                    <Button variant="primary" size="md">
                      <span>Browse courses</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} hoverable={false}>
                      <Badge variant={enrollment.status === 'completed' ? 'slate' : 'purple'}>
                        {enrollment.status === 'completed' ? 'COMPLETED' : 'ACTIVE'}
                      </Badge>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--color-text)',
                          margin: '0.75rem 0 0.5rem 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {enrollment.courses?.title ?? 'Course'}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.55,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {enrollment.courses?.short_description ?? 'Enrolled course'}
                      </p>
                      {enrollment.courses?.slug && (
                        <Link to={`/courses/${enrollment.courses.slug}`}>
                          <Button variant="secondary" size="sm">
                            <span>Continue</span>
                            <ArrowRight size={14} />
                          </Button>
                        </Link>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '3rem' }}>
                <Card hoverable={false} style={{ padding: '2rem' }}>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--color-text)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {COHORT_NAME} starts {formatCohortStart()}
                  </h3>
                  <p
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.9rem',
                      marginBottom: '1.75rem',
                    }}
                  >
                    Same countdown as the landing page, reading the same configured date.
                  </p>
                  <CountdownTimer targetDate={COHORT_START_DATE} />
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
