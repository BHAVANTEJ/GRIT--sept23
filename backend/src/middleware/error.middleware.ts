import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.path} Error:`, err.message || err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  return sendError(res, err.message || 'Internal Server Error', 500);
};
