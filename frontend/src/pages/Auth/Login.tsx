import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { AuthHeader } from './components/AuthHeader';
import { MainLayout } from '../../components/layout/MainLayout';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // ProtectedRoute records where the user was heading before being bounced here,
  // so a deep link survives the sign-in detour.
  const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';

  return (
    <MainLayout>
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <AuthHeader
          title={mode === 'login' ? 'Login to GRIT SCHOOL' : 'Create Your Account'}
          subtitle={mode === 'login' ? 'Welcome back! Enter your credentials to access your courses.' : 'Join thousands of engineers building high-impact skills.'}
        />
        <AuthForm
          mode={mode}
          onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
          onSuccess={() => navigate(redirectTo, { replace: true })}
        />
      </div>
    </MainLayout>
  );
};
