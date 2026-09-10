import React from 'react';
import { X } from 'lucide-react';

interface IntroCloseButtonProps {
  onClose: () => void;
}

export const IntroCloseButton: React.FC<IntroCloseButtonProps> = ({ onClose }) => {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close introduction"
      style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #E2E8F0',
        color: '#0F172A',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <X size={22} />
    </button>
  );
};
