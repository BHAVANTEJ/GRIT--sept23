import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-slate-900 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
      }}>
        <Sparkles size={20} />
      </div>
      {showText && (
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#0F172A',
        }}>
          GRIT <span style={{ color: '#6366F1' }}>SCHOOL</span>
        </span>
      )}
    </Link>
  );
};
