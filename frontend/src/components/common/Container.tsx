import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({ children, style = {} }) => {
  return (
    <div
      style={{
        maxWidth: 'var(--max-width-site)',
        margin: '0 auto',
        padding: '0 var(--space-lg)',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
