import { validateBody } from '../middleware/validation.middleware';

export const validateSignup = validateBody(['email', 'password']);
export const validateLogin = validateBody(['email', 'password']);
