import React from 'react';
import { Loader2 } from 'lucide-react';

const QUOTES = [
  "Your decision to grow today is one you'll thank yourself for tomorrow.",
  "Showing up here is a decision future you will thank you for.",
  "The engineers who go furthest are the ones who decided to start.",
];

/**
 * Shown in place of the login form while `submitting` is true.
 *
 * Deliberately reuses `Loader2` + the existing `.animate-spin` keyframe
 * (see globals.css) instead of pulling in an animation library.
 */
export const LoginLoading: React.FC = () => {
  const quote = React.useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1rem',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.35)',
        }}
      >
        <Loader2 size={30} color="#FFFFFF" className="animate-spin" />
      </div>
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '0.5rem',
          }}
        >
          Signing you in…
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '340px' }}>
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
};
