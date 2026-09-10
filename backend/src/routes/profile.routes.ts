import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateProfileUpdate } from '../validators/profile.validator';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, validateProfileUpdate, updateProfile);

export default router;
