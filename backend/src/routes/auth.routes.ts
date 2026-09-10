import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/auth.controller';
import { validateSignup, validateLogin } from '../validators/auth.validator';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/auth/signup', validateSignup, signup);
router.post('/auth/login', validateLogin, login);
router.post('/auth/logout', requireAuth, logout);
router.get('/auth/me', requireAuth, getMe);

export default router;
