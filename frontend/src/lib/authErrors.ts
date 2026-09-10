import { AuthError } from '@supabase/supabase-js';

/**
 * Maps a Supabase auth error to a user-friendly message WITHOUT losing the
 * technical detail.
 *
 * Previously the UI surfaced `error.message` raw (or a generic "Sign up failed"),
 * which made three genuinely different failures look identical:
 *   - the email is already registered
 *   - the email exists but has never been confirmed
 *   - the password is actually wrong
 *
 * Supabase >= 2.x returns a stable machine-readable `code` on AuthError. We
 * branch on `code` first and only fall back to message sniffing for older
 * responses / gateway errors that carry no code.
 */

export interface FriendlyAuthError {
  /** Safe to render in the UI. */
  message: string;
  /** Stable identifier so callers can branch (e.g. route to the OTP screen). */
  kind:
    | 'email_exists'
    | 'email_not_confirmed'
    | 'invalid_credentials'
    | 'invalid_otp'
    | 'otp_expired'
    | 'rate_limited'
    | 'weak_password'
    | 'invalid_email'
    | 'network'
    | 'unknown';
}

/** Narrow unknown errors to something with the fields we read. */
const asAuthError = (error: unknown): Partial<AuthError> & { code?: string; status?: number } => {
  if (error && typeof error === 'object') {
    return error as Partial<AuthError> & { code?: string; status?: number };
  }
  return {};
};

/**
 * Logs the real error to the console in development only, so the technical
 * detail is never lost while debugging but is never shipped to users either.
 */
export const logAuthError = (context: string, error: unknown): void => {
  if (import.meta.env.DEV) {
    const e = asAuthError(error);
    // eslint-disable-next-line no-console
    console.error(`[auth:${context}]`, {
      code: e.code,
      status: e.status,
      name: e.name,
      message: e.message,
      raw: error,
    });
  }
};

export const toFriendlyAuthError = (error: unknown): FriendlyAuthError => {
  const e = asAuthError(error);
  const code = (e.code || '').toLowerCase();
  const message = (e.message || '').toLowerCase();
  const status = e.status;

  // --- Duplicate registration -------------------------------------------
  if (code === 'user_already_exists' || code === 'email_exists') {
    return { kind: 'email_exists', message: 'Email is already registered. Try signing in instead.' };
  }

  // --- Unconfirmed email ------------------------------------------------
  if (code === 'email_not_confirmed') {
    return {
      kind: 'email_not_confirmed',
      message: 'Please verify your email before signing in.',
    };
  }

  // --- Wrong password / unknown user ------------------------------------
  if (code === 'invalid_credentials') {
    return { kind: 'invalid_credentials', message: 'Invalid email or password.' };
  }

  // --- OTP problems -----------------------------------------------------
  if (code === 'otp_expired') {
    return {
      kind: 'otp_expired',
      message: 'Verification code expired. Request a new code.',
    };
  }
  if (code === 'otp_disabled') {
    return {
      kind: 'invalid_otp',
      message: 'Email verification is not enabled for this project. Contact support.',
    };
  }

  // --- Rate limiting ----------------------------------------------------
  if (
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    status === 429
  ) {
    return {
      kind: 'rate_limited',
      message: 'Too many attempts. Please wait a minute before trying again.',
    };
  }

  // --- Validation -------------------------------------------------------
  if (code === 'weak_password') {
    return { kind: 'weak_password', message: 'Password must be at least 6 characters long.' };
  }
  if (code === 'email_address_invalid' || code === 'validation_failed') {
    return { kind: 'invalid_email', message: 'Please enter a valid email address.' };
  }

  // --- Supabase could not send the email --------------------------------
  // Surfaces as a 500 from the auth server when SMTP is misconfigured. This is
  // the single most common cause of "the OTP email never arrived".
  if (code === 'unexpected_failure' && message.includes('email')) {
    return {
      kind: 'unknown',
      message: 'Unable to send verification code. Please try again shortly.',
    };
  }

  // --- Fallbacks for responses with no code -----------------------------
  if (message.includes('already registered') || message.includes('already been registered')) {
    return { kind: 'email_exists', message: 'Email is already registered. Try signing in instead.' };
  }
  if (message.includes('email not confirmed')) {
    return { kind: 'email_not_confirmed', message: 'Please verify your email before signing in.' };
  }
  if (message.includes('invalid login credentials')) {
    return { kind: 'invalid_credentials', message: 'Invalid email or password.' };
  }
  if (message.includes('expired')) {
    return { kind: 'otp_expired', message: 'Verification code expired. Request a new code.' };
  }
  if (message.includes('token') || message.includes('otp')) {
    return { kind: 'invalid_otp', message: 'Invalid verification code. Please check and try again.' };
  }
  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return {
      kind: 'network',
      message: 'Could not reach the server. Check your connection and try again.',
    };
  }

  return { kind: 'unknown', message: 'Something went wrong. Please try again.' };
};

/** Convenience: log the technical error and return the safe message. */
export const handleAuthError = (context: string, error: unknown): FriendlyAuthError => {
  logAuthError(context, error);
  return toFriendlyAuthError(error);
};
