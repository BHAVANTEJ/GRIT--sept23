import { useState, useEffect } from 'react';
import { UserProfile } from '../types/auth.types';
import { profileService } from '../services/profile.service';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    profileService
      .getProfile(user.id)
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return { profile, loading };
};
