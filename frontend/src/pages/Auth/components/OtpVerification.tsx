import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MailCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { useAuth } from '../../../hooks/useAuth';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

interface OtpVerificationProps {
  email: string;
  onVerified: () => void;
  /** Lets the user go back and correct a mistyped email address. */
  onChangeEmail?: () => void;
}

/**
 * "Verify your email" step shown after registration.
 *
 * The code itself is generated, emailed and validated entirely by Supabase —
 * this component only collects the six digits and hands them to
 * `supabase.auth.verifyOtp`. Nothing is generated or stored locally.
 */
export const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onVerified,
  onChangeEmail,
}) => {
  const { verifyOtp, resendOtp, submitting, error, clearError } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [notice, setNotice] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Resend cooldown — Supabase rate-limits confirmation emails, so the button
  // is disabled rather than letting the user trigger a 429.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const submitCode = useCallback(
    async (value: string) => {
      if (value.length !== OTP_LENGTH) return;
      clearError();
      setNotice(null);
      try {
        await verifyOtp(email, value);
        setVerified(true);
        // Brief confirmation before handing off, so the success state is seen.
        window.setTimeout(onVerified, 900);
      } catch {
        // Message is surfaced through the shared auth `error` state.
        setDigits(Array(OTP_LENGTH).fill(''));
        inputsRef.current[0]?.focus();
      }
    },
    [clearError, email, onVerified, verifyOtp]
  );

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      // Handles paste of the whole code into any single box.
      for (let i = 0; i < cleaned.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = cleaned[i];
      }
      const focusTarget = Math.min(index + cleaned.length, OTP_LENGTH - 1);
      inputsRef.current[focusTarget]?.focus();

      const joined = next.join('');
      if (joined.length === OTP_LENGTH && !joined.includes('')) {
        void submitCode(joined);
      }
      return next;
    });
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleResend = async () => {
    clearError();
    setNotice(null);
    try {
      await resendOtp(email);
      setNotice('A new code has been sent to your email.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      /* surfaced via `error` */
    }
  };

  if (verified) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
        <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
          Email verified successfully.
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.925rem' }}>Taking you to your dashboard…</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          <MailCheck size={26} color="#6366F1" />
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '0.375rem',
          }}
        >
          Verify your email
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.55 }}>
          Registration successful. We&apos;ve sent a confirmation link and a 6-digit code to
          <br />
          <strong style={{ color: '#0F172A' }}>{email}</strong>
          <br />
          Click the link in your email, or enter the code below, to verify your account.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {notice && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            color: '#065F46',
            fontSize: '0.9rem',
          }}
        >
          {notice}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${OTP_LENGTH}, 1fr)`,
          gap: '0.5rem',
          maxWidth: '320px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={OTP_LENGTH}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={submitting}
            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            style={{
              width: '100%',
              minWidth: 0,
              aspectRatio: '1 / 1',
              textAlign: 'center',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#0F172A',
              borderRadius: '12px',
              border: `1px solid ${digit ? '#6366F1' : '#CBD5E1'}`,
              backgroundColor: digit ? '#F8FAFF' : '#FFFFFF',
              outline: 'none',
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting || code.length !== OTP_LENGTH}
        onClick={() => submitCode(code)}
      >
        {submitting ? 'Verifying…' : 'Verify email'}
      </Button>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
        Didn&apos;t get the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={submitting || cooldown > 0}
          style={{
            color: cooldown > 0 ? '#94A3B8' : '#6366F1',
            fontWeight: 600,
            cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      {onChangeEmail && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onChangeEmail}
            style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'underline' }}
          >
            Use a different email address
          </button>
        </div>
      )}
    </div>
  );
};
