import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { AuthHeader } from './components/AuthHeader';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Mail, MailCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';

export const ForgotPassword: React.FC = () => {
  const { sendPasswordReset, submitting, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setValidationError(null);
    clearError();

    if (!isValidEmail(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch {
      /* surfaced via `error` */
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <AuthHeader
          title="Reset Your Password"
          subtitle="Enter your account email and we'll send you a password reset link."
        />

        {sent ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <MailCheck size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              Check your email
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: '#0F172A' }}>{email.trim()}</strong>, a
              password reset link has been sent. Click it to choose a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(validationError || error) && (
              <ErrorMessage message={validationError || error || 'An error occurred'} />
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#64748B' }}>
          Remembered your password?{' '}
          <Link to="/signin" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};
