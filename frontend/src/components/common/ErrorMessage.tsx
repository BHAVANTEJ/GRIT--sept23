import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div style={{
      backgroundColor: '#FEF2F2',
      border: '1px solid #FCA5A5',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      color: '#991B1B',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      margin: '1rem 0',
    }}>
      <AlertCircle size={20} color="#DC2626" />
      <div style={{ flex: 1, fontSize: '0.925rem' }}>{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};
