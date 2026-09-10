export const APP_NAME = 'GRIT SCHOOL';

export const STORAGE_KEYS = {
  INTRO_SEEN: 'grit_school_intro_seen',
  AUTH_TOKEN: 'grit_school_auth_token',
};

export const DEFAULT_INTRO_VIDEO_PATH = '/videos/grit-school-intro.mp4';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
