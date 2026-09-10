import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
  size?: number;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  ariaLabel = 'Close',
  size = 20,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #E2E8F0',
        color: '#0F172A',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
      }}
    >
      <X size={size} />
    </button>
  );
};
