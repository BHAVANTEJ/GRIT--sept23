import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType, UserProfile } from '../types/auth.types';
import { authService, SignUpOutcome, SignUpProfileData } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      try {
        const userProfile = await profileService.getProfile(userId);
        if (mounted) setProfile(userProfile);
      } catch {
        if (mounted) setProfile(null);
      } finally {
        // Settled either way — the guard must not wait on a fetch that failed.
        if (mounted) setProfileLoaded(true);
      }
    };

    /**
     * Restores the persisted session on boot.
     *
     * `supabase.auth.getSession()` reads the session Supabase itself persisted
     * in localStorage (persistSession: true in lib/supabase.ts) and refreshes it
     * if the access token has expired. This is what makes "close the browser and
     * come back later" work — no manual token storage is involved.
     */
    const initializeAuth = async () => {
      try {
        const sess = await authService.getSession();
        if (!mounted) return;

        setSession(sess);
        setUser(sess?.user ?? null);

        if (sess?.user) {
          await loadProfile(sess.user.id);
        } else {
          setProfile(null);
          setProfileLoaded(true);
        }
      } catch {
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setProfileLoaded(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Keeps every tab and every component in sync with Supabase's own view of
    // the session: sign-in, sign-out, OTP verification and token refresh all
    // land here, so no screen has to push auth state around manually.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Deferred: Supabase warns against awaiting other Supabase calls
        // directly inside this callback (it can deadlock the auth lock).
        setProfileLoaded(false);
        setTimeout(() => {
          void loadProfile(newSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setProfileLoaded(true);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, profileData?: SignUpProfileData): Promise<SignUpOutcome> => {
      setSubmitting(true);
      setError(null);
      try {
        return await authService.signUp(email, password, profileData);
      } catch (err: any) {
        setError(err?.message || 'Unable to create account.');
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.signIn(email, password);
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.verifyOtp(email, token);
      // verifyOtp returns a live session; onAuthStateChange picks it up. We also
      // read it back explicitly so callers can navigate immediately afterwards
      // without racing the listener.
      const sess = await authService.getSession();
      setSession(sess);
      setUser(sess?.user ?? null);
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.resendSignupOtp(email);
    } catch (err: any) {
      setError(err?.message || 'Unable to send verification code.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.resetPasswordForEmail(email);
    } catch (err: any) {
      setError(err?.message || 'Unable to send password reset email.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.updatePassword(newPassword);
    } catch (err: any) {
      setError(err?.message || 'Unable to update password.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err: any) {
      setError(err?.message || 'Sign out failed');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      loading,
      submitting,
      profileLoaded,
      error,
      isAdmin: profile?.role === 'admin',
      // email_confirmed_at is set by Supabase the moment the OTP is verified.
      isAuthenticated: Boolean(session?.user),
      signUp,
      signIn,
      verifyOtp,
      resendOtp,
      sendPasswordReset,
      updatePassword,
      signOut,
      clearError,
    }),
    [
      user,
      session,
      profile,
      loading,
      submitting,
      profileLoaded,
      error,
      signUp,
      signIn,
      verifyOtp,
      resendOtp,
      sendPasswordReset,
      updatePassword,
      signOut,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
