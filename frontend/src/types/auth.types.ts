import { User, Session } from '@supabase/supabase-js';
import { SignUpOutcome } from '../services/auth.service';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  /**
   * True only while the initial session restore is in flight. Route guards read
   * this, so it must NOT be toggled by form submissions — otherwise submitting
   * the login form briefly unmounts protected routes.
   */
  loading: boolean;
  /** True while a sign-in / sign-up / verify request is in flight. */
  submitting: boolean;
  /**
   * True once the profile fetch has settled — successfully or not. Lets the
   * admin guard distinguish "role not known yet" from "no profile row", instead
   * of spinning forever when the fetch fails.
   */
  profileLoaded: boolean;
  error: string | null;
  /** Convenience flag derived from `profile.role`. */
  isAdmin: boolean;
  /** True once the session exists AND the email has been confirmed. */
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<SignUpOutcome>;
  signIn: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
