import { Request, Response, NextFunction } from 'express';
import { courseService } from '../services/course.service';
import { sendSuccess } from '../utils/response';

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await courseService.getPublishedCourses();
    return sendSuccess(res, courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.getCourseBySlug(req.params.slug);
    return sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
};
