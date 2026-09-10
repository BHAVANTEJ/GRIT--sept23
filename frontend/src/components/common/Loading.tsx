import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC<{ message?: string }> = ({ message = 'Loading GRIT SCHOOL...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '1rem', color: '#64748B' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: '#6366F1' }} />
      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
};
