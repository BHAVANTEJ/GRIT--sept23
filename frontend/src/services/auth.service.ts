import { supabase } from '../lib/supabase';
import { handleAuthError, logAuthError } from '../lib/authErrors';

/**
 * Normalises an email the same way on every auth call.
 *
 * Root cause of the "credentials don't match" bug: sign-up and sign-in sent
 * whatever the input field contained. A trailing space or a capitalised first
 * letter created an account under one string and then failed to find it under
 * another, which Supabase reports as `invalid_credentials` — indistinguishable
 * from a genuinely wrong password.
 */
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export type SignUpOutcome =
  | { status: 'needs_verification'; email: string }
  | { status: 'active_session'; email: string };

export interface SignUpProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const authService = {
  /**
   * Registers the user and lets Supabase issue the confirmation email.
   *
   * The confirmation email carries both `{{ .Token }}` (the 6-digit OTP shown
   * in `OtpVerification`) and `{{ .ConfirmationURL }}` (a magic link handled
   * by `AuthCallback`) — the user can use either one to confirm.
   */
  signUp: async (
    email: string,
    password: string,
    profileData?: SignUpProfileData
  ): Promise<SignUpOutcome> => {
    const normalized = normalizeEmail(email);
    const firstName = profileData?.firstName?.trim() || '';
    const lastName = profileData?.lastName?.trim() || '';
    const phone = profileData?.phone?.trim() || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const friendly = handleAuthError('signUp', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }

    /**
     * Supabase anti-enumeration behaviour: when "Confirm email" is ON and the
     * address is ALREADY registered, signUp returns 200 with a decoy user whose
     * `identities` array is empty — no error is thrown and no email is sent.
     *
     * Without this check the UI showed "Account Created!" and then sent the user
     * to a verification screen for a code that would never arrive. This is the
     * error the user was hitting on re-registration.
     */
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw Object.assign(new Error('Email is already registered. Try signing in instead.'), {
        kind: 'email_exists',
      });
    }

    // A session here means the project has email confirmation DISABLED.
    if (data.session) {
      return { status: 'active_session', email: normalized };
    }

    return { status: 'needs_verification', email: normalized };
  },

  /**
   * Verifies the 6-digit code Supabase emailed at sign-up.
   *
   * Type is `'signup'` — not a guess: `supabase.auth.signUp()` issues a token of
   * type `signup`, and `verifyOtp` must be told which token family to check.
   * (`'email'` is for `signInWithOtp` tokens, `'recovery'` for password resets.)
   * On success Supabase returns a real session, which the auth listener picks up.
   */
  verifyOtp: async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizeEmail(email),
      token: token.trim(),
      type: 'signup',
    });

    if (error) {
      const friendly = handleAuthError('verifyOtp', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }

    return data;
  },

  /** Re-issues the sign-up confirmation OTP for an unverified address. */
  resendSignupOtp: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizeEmail(email),
    });

    if (error) {
      const friendly = handleAuthError('resendSignupOtp', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      const friendly = handleAuthError('signIn', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }

    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logAuthError('signOut', error);
      throw error;
    }
  },

  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      logAuthError('getSession', error);
      throw error;
    }
    return session;
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      logAuthError('getUser', error);
      throw error;
    }
    return user;
  },

  /** Sends a password-recovery email containing a link into `/reset-password`. */
  resetPasswordForEmail: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      const friendly = handleAuthError('resetPasswordForEmail', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }
  },

  /** Sets a new password on the session established by the recovery link. */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      const friendly = handleAuthError('updatePassword', error);
      throw Object.assign(new Error(friendly.message), { kind: friendly.kind, cause: error });
    }
  },
};
