import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const getHealthStatus = (req: Request, res: Response) => {
  return sendSuccess(res, {
    status: 'ok',
    app: 'GRIT SCHOOL API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
