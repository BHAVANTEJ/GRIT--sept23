import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.9rem', color: '#64748B' }}>{subtitle}</p>
    </div>
  );
};
