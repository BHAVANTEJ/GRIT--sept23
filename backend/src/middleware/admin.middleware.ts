import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { sendError } from '../utils/response';
import { APP_CONSTANTS } from '../config/constants';

/**
 * Admin gate for privileged API routes. Chain it AFTER `requireAuth`:
 *
 *   router.post('/admin/courses', requireAuth, requireAdmin, createCourse);
 *
 * The role is read from public.profiles server-side on every request. It is
 * deliberately NOT taken from the JWT claims or from anything the client sends,
 * so revoking someone's admin role takes effect immediately rather than when
 * their token happens to expire.
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      return sendError(res, 'Unable to verify permissions', 403);
    }

    if (data.role !== APP_CONSTANTS.ROLES.ADMIN) {
      // Deliberately generic: does not confirm what the caller's role actually is.
      return sendError(res, 'Access denied', 403);
    }

    return next();
  } catch (err: any) {
    return sendError(res, 'Unable to verify permissions', 403);
  }
};
