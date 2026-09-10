import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { AuthHeader } from './components/AuthHeader';
import { MainLayout } from '../../components/layout/MainLayout';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');

  return (
    <MainLayout>
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <AuthHeader
          title={mode === 'signup' ? 'Join GRIT SCHOOL' : 'Sign In to GRIT SCHOOL'}
          subtitle={mode === 'signup' ? 'Start your high-performance engineering journey today.' : 'Welcome back! Enter your credentials to access your courses.'}
        />
        <AuthForm
          mode={mode}
          onToggleMode={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          // Reached only once a session actually exists — after OTP verification,
          // or immediately when the project has email confirmation disabled.
          onSuccess={() => navigate('/dashboard', { replace: true })}
        />
      </div>
    </MainLayout>
  );
};
