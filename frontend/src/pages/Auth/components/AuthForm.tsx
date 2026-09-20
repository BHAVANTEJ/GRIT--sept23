import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/common/Button';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { AuthToggle } from './AuthToggle';
import { OtpVerification } from './OtpVerification';
import { LoginLoading } from './LoginLoading';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { isValidEmail, isValidPassword, isValidPhone } from '../../../utils/validators';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess?: () => void;
}

type Step = 'form' | 'verify';

const inputWrapperStyle: React.CSSProperties = { position: 'relative' };
const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#1E293B',
  marginBottom: '0.35rem',
};

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode, onSuccess }) => {
  const { signIn, signUp, submitting, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setValidationError(null);
    clearError();

    if (mode === 'signup' && !firstName.trim()) {
      setValidationError('First name is required.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup' && !isValidPhone(phone)) {
      setValidationError('Please enter a valid phone number.');
      return;
    }

    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (mode === 'signup') {
        const outcome = await signUp(email, password, {
          firstName,
          lastName,
          phone,
        });

        if (outcome.status === 'needs_verification') {
          // Supabase requires email confirmation: move to the verification step
          // instead of pretending the account is ready.
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
      // the verification screen so they can finish confirming instead of
      // retyping a password that was correct all along.
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

  if (mode === 'login' && submitting) {
    return <LoginLoading />;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {(validationError || error) && (
        <ErrorMessage message={validationError || error || 'An error occurred'} />
      )}

      {mode === 'signup' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <label style={labelStyle}>First Name *</label>
            <div style={inputWrapperStyle}>
              <UserIcon size={18} color="#94A3B8" style={iconStyle} />
              <input
                type="text"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <div style={inputWrapperStyle}>
              <UserIcon size={18} color="#94A3B8" style={iconStyle} />
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <label style={labelStyle}>Phone Number *</label>
          <div style={inputWrapperStyle}>
            <Phone size={18} color="#94A3B8" style={iconStyle} />
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
              style={inputStyle}
            />
          </div>
        </div>
      )}

      <div>
        <label style={labelStyle}>Email Address *</label>
        <div style={inputWrapperStyle}>
          <Mail size={18} color="#94A3B8" style={iconStyle} />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Password *</label>
        <div style={inputWrapperStyle}>
          <Lock size={18} color="#94A3B8" style={iconStyle} />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            style={inputStyle}
          />
        </div>
        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.85rem', color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting} style={{ marginTop: '0.5rem' }}>
        {submitting ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Login'}
      </Button>

      <AuthToggle mode={mode} onToggle={onToggleMode} />
    </form>
  );
};
