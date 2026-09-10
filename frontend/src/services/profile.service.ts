import { UserProfile } from '../types/auth.types';
import { ProfileUpdateDTO } from '../types/profile.types';
import { supabase } from '../lib/supabase';

export const profileService = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Profile fetch error, returning fallback profile', error);
      return null;
    }
    return data;
  },

  updateProfile: async (userId: string, updates: ProfileUpdateDTO): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
