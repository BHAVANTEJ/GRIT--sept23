import { STORAGE_KEYS } from '../lib/constants';

export const storage = {
  getIntroSeen: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.INTRO_SEEN) === 'true';
    } catch {
      return false;
    }
  },
  setIntroSeen: (seen: boolean = true): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTRO_SEEN, seen ? 'true' : 'false');
    } catch (e) {
      console.warn('LocalStorage error setting intro status', e);
    }
  },
  clearIntroSeen: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.INTRO_SEEN);
    } catch (e) {
      console.warn('LocalStorage error clearing intro status', e);
    }
  },
};
