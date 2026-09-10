import React from 'react';

interface AuthToggleProps {
  mode: 'login' | 'signup';
  onToggle: () => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ mode, onToggle }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#64748B' }}>
      {mode === 'signup' ? 'Already have a GRIT SCHOOL account?' : "Don't have an account yet?"}{' '}
      <button
        type="button"
        onClick={onToggle}
        style={{
          color: '#6366F1',
          fontWeight: 700,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {mode === 'signup' ? 'Sign in' : 'Create Account'}
      </button>
    </div>
  );
};
