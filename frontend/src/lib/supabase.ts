import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Frontend Supabase Client initialized strictly using the public Anon key
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
