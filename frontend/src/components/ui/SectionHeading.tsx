import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
}) => {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: '3rem',
        maxWidth: align === 'center' ? '700px' : '100%',
        margin: align === 'center' ? '0 auto 3rem auto' : '0 0 3rem 0',
      }}
    >
      {badge && (
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#EEF2FF',
            color: '#6366F1',
            padding: '0.25rem 0.875rem',
            borderRadius: '9999px',
            fontSize: '0.825rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          {badge}
        </span>
      )}
      <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ marginTop: '0.75rem', fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
