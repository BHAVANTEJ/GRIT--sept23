import { validateBody } from '../middleware/validation.middleware';

export const validateCourseSlug = (req: any, res: any, next: any) => {
  if (!req.params.slug) {
    return res.status(400).json({ success: false, error: { message: 'Course slug parameter is required' } });
  }
  next();
};
