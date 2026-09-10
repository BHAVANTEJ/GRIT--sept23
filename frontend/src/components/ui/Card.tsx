import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style = {}, hoverable = true }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(hoverable
          ? {
              cursor: 'pointer',
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
