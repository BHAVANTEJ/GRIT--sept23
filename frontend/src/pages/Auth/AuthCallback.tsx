import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Button } from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { handleAuthError } from '../../lib/authErrors';

/**
 * Landing route for Supabase email links.
 *
 * The primary flow in this app is OTP — the user types the 6-digit code. This
 * route exists because the confirmation email can also contain
 * `{{ .ConfirmationURL }}`, and a user who clicks the link instead of typing the
 * code must land somewhere real rather than on the 404 page.
 *
 * Two link formats are handled:
 *  - PKCE / code exchange:  /auth/callback?code=...
 *  - token_hash verify:     /auth/callback?token_hash=...&type=signup
 *  - implicit hash tokens:  /auth/callback#access_token=...  (consumed
 *    automatically by supabase-js because detectSessionInUrl defaults to true)
 */
export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const complete = async () => {
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
            type: (type as 'signup' | 'email' | 'recovery' | 'invite' | 'email_change') || 'signup',
          });
          if (verifyError) throw verifyError;
        }

        // Whether the link carried a code, a token_hash, or an implicit hash
        // fragment already consumed by supabase-js, the session is now readable.
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;
        navigate(session ? '/dashboard' : '/signin', { replace: true });
      } catch (err) {
        if (cancelled) return;
        setError(handleAuthError('authCallback', err).message);
      }
    };

    void complete();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <MainLayout>
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        {error ? (
          <>
            <ErrorMessage message={error} />
            <Button variant="primary" size="md" onClick={() => navigate('/signin', { replace: true })}>
              Back to sign in
            </Button>
          </>
        ) : (
          <Loading message="Confirming your email..." />
        )}
      </div>
    </MainLayout>
  );
};
