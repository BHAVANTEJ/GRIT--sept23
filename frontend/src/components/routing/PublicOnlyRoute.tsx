import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../common/Loading';

/**
 * Keeps already-authenticated users off /signin and /register.
 *
 * Without this, a signed-in user returning to the site could land on the login
 * form and reasonably conclude they had been logged out.
 */
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
