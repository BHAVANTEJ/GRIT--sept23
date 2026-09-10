import React from 'react';
import { CloseButton } from '../common/CloseButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{title}</h3>}
          <CloseButton onClick={onClose} ariaLabel="Close modal" />
        </div>
        {children}
      </div>
    </div>
  );
};
