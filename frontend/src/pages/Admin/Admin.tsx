import React, { useCallback, useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { adminService, AdminStats, AdminUserRow } from '../../services/admin.service';
import { courseService } from '../../services/course.service';
import { cohortService } from '../../services/cohort.service';
import { companyService } from '../../services/company.service';
import { Course } from '../../types/course.types';
import { Cohort } from '../../types/cohort.types';
import { Company } from '../../types/company.types';
import { formatCohortStart } from '../../data/cohorts';
import { AdminOverview } from './components/AdminOverview';
import { AdminTable, Column } from './components/AdminTable';
import './Admin.css';

type Tab = 'overview' | 'users' | 'courses' | 'cohorts' | 'companies';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'courses', label: 'Courses' },
  { key: 'cohorts', label: 'Cohorts' },
  { key: 'companies', label: 'Companies' },
];

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

/**
 * Admin dashboard.
 *
 * Every number and row shown here is read from the database. Nothing is
 * fabricated: when a table is empty the section says so rather than showing a
 * placeholder figure.
 *
 * Reaching this component already required passing ProtectedRoute
 * (requireAdmin), and each query is independently enforced by RLS.
 */
export const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetched together so the tab switch is instant and the counts on the
      // Overview tab always agree with the rows on the other tabs.
      const [statsData, usersData, coursesData, cohortsData, companiesData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        courseService.getAllCourses(),
        cohortService.getAllCohorts(),
        companyService.getAllCompanies(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setCourses(coursesData);
      setCohorts(cohortsData);
      setCompanies(companiesData);
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('[admin] load failed', err);
      setError(
        err?.code === '42501' || err?.message?.includes('Access denied')
          ? 'Access denied. This account does not have the admin role.'
          : 'Could not load admin data. Check that migrations 007–010 and the admin policies have been applied.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const userColumns: Column<AdminUserRow>[] = [
    { header: 'Name', render: (u) => u.full_name || '—' },
    { header: 'Email', render: (u) => u.email },
    {
      header: 'Role',
      render: (u) => <Badge variant={u.role === 'admin' ? 'indigo' : 'slate'}>{u.role}</Badge>,
    },
    {
      header: 'Verified',
      render: (u) => (
        <span style={{ color: u.email_verified ? '#059669' : '#B45309', fontWeight: 600 }}>
          {u.email_verified ? 'Yes' : 'Pending'}
        </span>
      ),
    },
    { header: 'Joined', render: (u) => formatDate(u.created_at) },
  ];

  const courseColumns: Column<Course>[] = [
    { header: 'Title', render: (c) => c.title },
    { header: 'Slug', render: (c) => c.slug },
    {
      header: 'Status',
      render: (c) => (
        <Badge variant={c.status === 'published' ? 'indigo' : 'slate'}>{c.status ?? 'draft'}</Badge>
      ),
    },
    { header: 'Duration', render: (c) => `${c.duration_weeks} wks` },
    { header: 'Order', render: (c) => c.display_order ?? 0 },
  ];

  const cohortColumns: Column<Cohort>[] = [
    { header: 'Name', render: (c) => c.name },
    { header: 'Starts', render: (c) => formatCohortStart(c.start_date, { dateStyle: 'medium' }) },
    { header: 'Ends', render: (c) => formatDate(c.end_date) },
    { header: 'Status', render: (c) => <Badge variant="slate">{c.status}</Badge> },
  ];

  const companyColumns: Column<Company>[] = [
    { header: 'Name', render: (c) => c.name },
    { header: 'Website', render: (c) => c.website_url || '—' },
    { header: 'Order', render: (c) => c.display_order },
    {
      header: 'Visible',
      render: (c) => (
        <span style={{ color: c.is_visible ? '#059669' : '#94A3B8', fontWeight: 600 }}>
          {c.is_visible ? 'Yes' : 'Hidden'}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="admin-page">
        <div style={{ maxWidth: 'var(--max-width-site)', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Badge variant="indigo">ADMIN</Badge>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--color-text)',
                marginTop: '0.5rem',
              }}
            >
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Signed in as {profile?.full_name || profile?.email}
            </p>
          </div>

          <nav className="admin-tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`admin-tab${tab === t.key ? ' admin-tab--active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {error && <ErrorMessage message={error} onRetry={load} />}

          {loading ? (
            <Loading message="Loading admin data..." />
          ) : (
            <div style={{ marginTop: '1.75rem' }}>
              {tab === 'overview' && stats && <AdminOverview stats={stats} />}

              {tab === 'users' && (
                <AdminTable
                  rows={users}
                  columns={userColumns}
                  emptyMessage="No users have registered yet."
                  getKey={(u) => u.id}
                />
              )}

              {tab === 'courses' && (
                <>
                  <AdminTable
                    rows={courses}
                    columns={courseColumns}
                    emptyMessage="No courses yet. Insert rows into public.courses to populate the catalogue."
                    getKey={(c) => c.id}
                  />
                  <Card hoverable={false} style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      Course records live in <code>public.courses</code> with a{' '}
                      <code>draft / published / archived</code> status. Publishing is a status change
                      — the public Courses page reads published rows only, so no UI code needs editing
                      when the final courses are decided.
                    </p>
                  </Card>
                </>
              )}

              {tab === 'cohorts' && (
                <>
                  <AdminTable
                    rows={cohorts}
                    columns={cohortColumns}
                    emptyMessage="No cohorts yet. The landing page countdown falls back to the configured COHORT_START_DATE."
                    getKey={(c) => c.id}
                  />
                  <Card hoverable={false} style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      The landing-page countdown targets the earliest{' '}
                      <code>upcoming</code>/<code>active</code> cohort. Changing that row&apos;s{' '}
                      <code>start_date</code> moves the timer — the date is not duplicated anywhere in
                      the UI.
                    </p>
                  </Card>
                </>
              )}

              {tab === 'companies' && (
                <AdminTable
                  rows={companies}
                  columns={companyColumns}
                  emptyMessage="No companies configured. The marquee is using the fallback list in src/data/companies.ts."
                  getKey={(c) => c.id}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
