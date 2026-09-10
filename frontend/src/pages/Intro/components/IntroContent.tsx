import React from 'react';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/ui/Badge';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface IntroContentProps {
  onStartClick: () => void;
}

export const IntroContent: React.FC<IntroContentProps> = ({ onStartClick }) => {
  const highlights = [
    'Project-based full-stack engineering & modern AI stacks',
    'Real-world database architecture & secure Supabase RLS',
    'Deliberate practice with expert mentorship & feedback',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1.75rem',
        paddingRight: '1rem',
      }}
    >
      <div>
        <Badge variant="purple">INTRODUCING GRIT SCHOOL</Badge>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 4vw, 3.75rem)',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
        }}
      >
        Master High-Impact Skills with{' '}
        <span className="highlight-purple">Grit & Practice</span>
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          color: '#475569',
          lineHeight: 1.6,
          maxWidth: '520px',
        }}
      >
        Accelerate your software engineering career with production-grade curriculum, live projects, and rigorous code reviews built for ambitious developers.
      </p>

      {/* Feature Bullet Points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {highlights.map((text, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} color="#6366F1" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.975rem', fontWeight: 600, color: '#1E293B' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA Button Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="primary" size="lg" onClick={onStartClick}>
          <span>Join GRIT SCHOOL</span>
          <ArrowRight size={18} />
        </Button>
      </div>

      {/* Scroll indicator prompt */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#94A3B8', fontSize: '0.875rem' }}>
        <ChevronDown size={18} className="animate-bounce" style={{ color: '#6366F1' }} />
        <span>Scroll down to continue to Sign Up / Sign In</span>
      </div>
    </div>
  );
};
