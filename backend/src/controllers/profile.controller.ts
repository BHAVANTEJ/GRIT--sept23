import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { sendSuccess } from '../utils/response';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getProfile(req.user!.id);
    return sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await profileService.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};
