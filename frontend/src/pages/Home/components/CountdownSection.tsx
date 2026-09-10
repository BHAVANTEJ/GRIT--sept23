import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/common/Button';
import { CountdownTimer } from '../../../components/common/CountdownTimer';
import { cohortService } from '../../../services/cohort.service';
import { FALLBACK_COHORT, COHORT_TIMEZONE_LABEL, formatCohortStart } from '../../../data/cohorts';
import { Cohort } from '../../../types/cohort.types';

/**
 * "Next cohort" countdown, placed directly after the UX/outcomes section on the
 * landing page.
 *
 * The target date comes from the cohorts data source (Supabase row when present,
 * otherwise the single configured COHORT_START_DATE) — never from a literal in
 * this file.
 */
export const CountdownSection: React.FC = () => {
  const [cohort, setCohort] = useState<Cohort>(FALLBACK_COHORT);

  useEffect(() => {
    let cancelled = false;
    cohortService
      .getUpcomingCohort()
      .then((next) => {
        if (!cancelled) setCohort(next);
      })
      .catch(() => {
        /* the fallback cohort is already in state */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startLabel = formatCohortStart(cohort.start_date);

  return (
    <section
      style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width-site)',
          margin: '0 auto',
          padding: '0 var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <Badge variant="purple">NEXT COHORT</Badge>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            letterSpacing: '-0.03em',
            margin: '1rem 0 0.75rem 0',
          }}
        >
          Starts <span className="highlight-purple">{startLabel}</span>
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '540px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          Seats are limited and reviewed in the order applications arrive. Secure your place before
          enrolment closes.
        </p>

        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--color-text-light)',
            marginBottom: '1rem',
          }}
        >
          NEXT COHORT STARTS IN
        </p>

        <CountdownTimer targetDate={cohort.start_date} />

        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/register">
            <Button variant="primary" size="lg">
              <span>Join next cohort</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
          <p
            style={{
              marginTop: '0.875rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-light)',
            }}
          >
            {cohort.name} · all times {COHORT_TIMEZONE_LABEL}
          </p>
        </div>
      </div>
    </section>
  );
};
