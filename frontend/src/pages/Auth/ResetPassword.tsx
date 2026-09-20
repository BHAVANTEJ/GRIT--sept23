import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { AuthHeader } from './components/AuthHeader';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loading } from '../../components/common/Loading';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isValidPassword } from '../../utils/validators';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/auth.service';
import { handleAuthError } from '../../lib/authErrors';

type LinkState = 'checking' | 'ready' | 'invalid';

/**
 * Landing page for the Supabase password-recovery email link.
 *
 * Mirrors `AuthCallback`'s handling of the two link formats Supabase can send
 * (`?code=...` for PKCE, `?token_hash=...&type=recovery` for the OTP-style
 * link) before showing the New Password / Confirm Password form.
 */
export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword, submitting, error, clearError } = useAuth();
  const [linkState, setLinkState] = useState<LinkState>('checking');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const establishRecoverySession = async () => {
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const errorDescription = searchParams.get('error_description');

      try {
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (tokenHash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (type as 'recovery') || 'recovery',
          });
          if (verifyError) throw verifyError;
        }

        // Whether the link carried a code, a token_hash, or an implicit hash
        // fragment already consumed by supabase-js, the session is now readable.
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;
        setLinkState(session ? 'ready' : 'invalid');
      } catch (err) {
        if (cancelled) return;
        setLinkError(handleAuthError('resetPasswordLink', err).message);
        setLinkState('invalid');
      }
    };

    void establishRecoverySession();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setValidationError(null);
    clearError();

    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      await updatePassword(password);
      // The recovery link leaves the browser signed in as this user — sign out
      // so the flow ends the same way it started: logging in with a password.
      await authService.signOut();
      setDone(true);
    } catch {
      /* surfaced via `error` */
    }
  };

  if (linkState === 'checking') {
    return (
      <MainLayout>
        <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
          <Loading message="Verifying your reset link..." />
        </div>
      </MainLayout>
    );
  }

  if (linkState === 'invalid') {
    return (
      <MainLayout>
        <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <ErrorMessage
            message={linkError || 'This password reset link is invalid or has expired.'}
          />
          <Link to="/forgot-password">
            <Button variant="primary" size="md">
              Request a new link
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (done) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
            Password updated successfully.
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
            You can now log in with your new password.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/signin', { replace: true })}>
            Go to Login
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <AuthHeader title="Choose a New Password" subtitle="Your new password must be at least 6 characters." />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(validationError || error) && (
            <ErrorMessage message={validationError || error || 'An error occurred'} />
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};
