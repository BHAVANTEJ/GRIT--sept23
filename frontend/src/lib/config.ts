import { DEFAULT_INTRO_VIDEO_PATH, API_BASE_URL } from './constants';

export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  apiBaseUrl: API_BASE_URL,
  introVideoPath: DEFAULT_INTRO_VIDEO_PATH,
};
