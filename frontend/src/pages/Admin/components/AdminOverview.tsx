import React from 'react';
import { Users, ShieldCheck, BookOpen, FileEdit, GraduationCap, Building2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { AdminStats } from '../../../services/admin.service';
import { formatCohortStart } from '../../../data/cohorts';

interface AdminOverviewProps {
  stats: AdminStats;
}

/**
 * Overview tiles. Every value comes from `get_admin_stats()` — real counts, or
 * an explicit "none" state. No placeholder numbers.
 */
export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
  const tiles = [
    { label: 'Total users', value: stats.total_users, icon: <Users size={22} />, tint: '#EEF2FF', color: '#6366F1' },
    { label: 'Verified users', value: stats.verified_users, icon: <ShieldCheck size={22} />, tint: '#ECFDF5', color: '#10B981' },
    { label: 'Published courses', value: stats.published_courses, icon: <BookOpen size={22} />, tint: '#EEF2FF', color: '#4338CA' },
    { label: 'Draft courses', value: stats.draft_courses, icon: <FileEdit size={22} />, tint: '#FEF3C7', color: '#D97706' },
    { label: 'Enrollments', value: stats.total_enrollments, icon: <GraduationCap size={22} />, tint: '#F5F3FF', color: '#8B5CF6' },
    { label: 'Visible companies', value: stats.visible_companies, icon: <Building2 size={22} />, tint: '#F1F5F9', color: '#475569' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {tiles.map((tile) => (
          <Card key={tile.label} hoverable={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.7rem',
                  borderRadius: '12px',
                  backgroundColor: tile.tint,
                  color: tile.color,
                  display: 'flex',
                }}
              >
                {tile.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    display: 'block',
                  }}
                >
                  {tile.label}
                </span>
                <strong
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--color-text)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tile.value}
                </strong>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card hoverable={false} style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          Upcoming cohort
        </h3>
        {stats.upcoming_cohort ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            <strong>{stats.upcoming_cohort.name}</strong> — starts{' '}
            {formatCohortStart(stats.upcoming_cohort.start_date, {
              dateStyle: 'full',
            })}{' '}
            ({stats.upcoming_cohort.status})
          </p>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            No upcoming cohort recorded. The landing-page countdown is using the configured fallback
            date.
          </p>
        )}
      </Card>
    </div>
  );
};
