import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** When true the route additionally requires profile.role === 'admin'. */
  requireAdmin?: boolean;
}

/**
 * Gate for authenticated-only routes.
 *
 * Waits for the initial session restore to finish before deciding — otherwise a
 * returning user with a perfectly valid persisted session gets bounced to
 * /signin during the split second before `getSession()` resolves.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading, profileLoaded } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    // `state.from` lets the sign-in page send the user back where they meant to go.
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin) {
    // The profile row carries the role and is fetched right after the session.
    // Hold only while that fetch is still in flight; once it has settled, a
    // missing or non-admin profile is a denial — never an indefinite spinner.
    if (!profileLoaded) {
      return <Loading message="Checking permissions..." />;
    }
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
