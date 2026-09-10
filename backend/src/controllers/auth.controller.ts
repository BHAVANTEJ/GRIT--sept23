import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.signup(req.body);
    return sendSuccess(res, data, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : '';
    await authService.logout(token);
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (error) {
    next(error);
  }
};
