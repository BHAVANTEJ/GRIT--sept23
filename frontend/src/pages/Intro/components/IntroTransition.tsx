import React from 'react';

interface IntroTransitionProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const IntroTransition: React.FC<IntroTransitionProps> = ({ isVisible, children }) => {
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};
