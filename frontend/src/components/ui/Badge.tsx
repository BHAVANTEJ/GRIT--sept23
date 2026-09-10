import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'indigo' | 'slate';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'purple' }) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'purple':
        return { backgroundColor: '#EEF2FF', color: '#6366F1', border: '1px solid #C7D2FE' };
      case 'indigo':
        return { backgroundColor: '#E0E7FF', color: '#4338CA', border: '1px solid #A5B4FC' };
      case 'slate':
      default:
        return { backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        ...getStyles(),
      }}
    >
      {children}
    </span>
  );
};
