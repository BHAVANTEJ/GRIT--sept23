import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/common/Button';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { AuthToggle } from './AuthToggle';
import { OtpVerification } from './OtpVerification';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { isValidEmail, isValidPassword } from '../../../utils/validators';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess?: () => void;
}

type Step = 'form' | 'verify';

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode, onSuccess }) => {
  const { signIn, signUp, submitting, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!isValidEmail(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (mode === 'signup') {
        const outcome = await signUp(email, password, fullName);

        if (outcome.status === 'needs_verification') {
          // Supabase requires email confirmation: move to the OTP step instead
          // of pretending the account is ready. The previous version navigated
          // straight to /dashboard here even though no session existed, which is
          // why the navbar kept showing "Sign in" after registering.
          setPendingEmail(outcome.email);
          setStep('verify');
          return;
        }

        // Email confirmation is disabled on this project — a session already exists.
        onSuccess?.();
      } else {
        await signIn(email, password);
        onSuccess?.();
      }
    } catch (err: any) {
      // A verified-email problem is not a credentials problem: send the user to
      // the OTP screen so they can finish confirming instead of retyping a
      // password that was correct all along.
      if (err?.kind === 'email_not_confirmed') {
        setPendingEmail(email.trim().toLowerCase());
        setStep('verify');
      }
      // Every other message is already in the shared auth `error` state.
    }
  };

  if (step === 'verify') {
    return (
      <OtpVerification
        email={pendingEmail}
        onVerified={() => onSuccess?.()}
        onChangeEmail={() => {
          clearError();
          setStep('form');
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {(validationError || error) && (
        <ErrorMessage message={validationError || error || 'An error occurred'} />
      )}

      {mode === 'signup' && (
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <UserIcon size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
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

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting} style={{ marginTop: '0.5rem' }}>
        {submitting ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
      </Button>

      <AuthToggle mode={mode} onToggle={onToggleMode} />
    </form>
  );
};
