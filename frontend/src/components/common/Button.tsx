import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  style = {},
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: '#EEF2FF',
          color: '#4F46E5',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#0F172A',
          border: '1px solid #E2E8F0',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.875rem', fontSize: '0.875rem', borderRadius: '8px' };
      case 'lg':
        return { padding: '0.875rem 1.75rem', fontSize: '1.05rem', borderRadius: '12px' };
      case 'md':
      default:
        return { padding: '0.625rem 1.25rem', fontSize: '0.95rem', borderRadius: '10px' };
    }
  };

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        border: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
