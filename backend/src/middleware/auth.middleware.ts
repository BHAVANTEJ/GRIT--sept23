import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { sendError } from '../utils/response';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authorization token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return sendError(res, 'Invalid or expired session token', 401);
    }
    req.user = user;
    next();
  } catch (err: any) {
    return sendError(res, err.message || 'Authentication error', 401);
  }
};
