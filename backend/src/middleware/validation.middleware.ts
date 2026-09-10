import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((field) => !req.body || req.body[field] === undefined || req.body[field] === '');
    if (missing.length > 0) {
      return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }
    next();
  };
};
