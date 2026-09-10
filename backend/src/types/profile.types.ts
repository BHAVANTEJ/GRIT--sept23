export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileDTO {
  full_name?: string;
  avatar_url?: string;
}
