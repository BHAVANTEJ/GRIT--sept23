import { supabaseAdmin } from '../config/supabase';
import { SignupDTO, LoginDTO } from '../types/auth.types';
import { AppError } from '../utils/errors';

export class AuthService {
  async signup(dto: SignupDTO) {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          full_name: dto.fullName || '',
        },
      },
    });

    if (error) {
      throw new AppError(error.message, 400);
    }
    return data;
  }

  async login(dto: LoginDTO) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new AppError(error.message, 401);
    }
    return data;
  }

  async logout(token: string) {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
      throw new AppError(error.message, 400);
    }
    return true;
  }

  async getUser(token: string) {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      throw new AppError('User not found or invalid token', 401);
    }
    return user;
  }
}

export const authService = new AuthService();
