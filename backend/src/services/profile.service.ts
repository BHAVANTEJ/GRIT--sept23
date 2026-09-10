import { supabaseAdmin } from '../config/supabase';
import { UserProfile, UpdateProfileDTO } from '../types/profile.types';
import { AppError } from '../utils/errors';

export class ProfileService {
  async getProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new AppError('Profile not found', 404);
    }
    return data;
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<UserProfile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }
    return data;
  }
}

export const profileService = new ProfileService();
