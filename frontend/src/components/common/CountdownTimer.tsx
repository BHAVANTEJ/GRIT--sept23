import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  /** ISO 8601 string (with UTC offset) or Date. */
  targetDate: string | Date;
  /** Rendered instead of the cards once the target passes. */
  completedMessage?: string;
}

const UNITS: Array<{ key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string }> = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HOURS' },
  { key: 'minutes', label: 'MINUTES' },
  { key: 'seconds', label: 'SECONDS' },
];

/** Two-digit padding keeps the card width stable, avoiding per-second layout shift. */
const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Reusable countdown. Owns no date of its own — the target is always passed in,
 * so there is a single configured cohort date rather than one per usage.
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  completedMessage = 'Applications for this cohort are now closed.',
}) => {
  const remaining = useCountdown(targetDate);

  if (remaining.isComplete) {
    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {completedMessage}
      </div>
    );
  }

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds remaining`}
      style={{
        display: 'grid',
        // auto-fit + minmax lets four cards sit in a row on desktop and wrap to
        // a 2x2 grid on narrow screens without a media query or overflow.
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '1.25rem 0.75rem',
            textAlign: 'center',
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.85rem, 5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-text)',
              // Tabular figures stop the digits jittering as they change.
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pad(remaining[key])}
          </div>
          <div
            style={{
              marginTop: '0.4rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--color-text-light)',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};
