import { Router } from 'express';
import { getCourses, getCourseBySlug } from '../controllers/course.controller';
import { validateCourseSlug } from '../validators/course.validator';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:slug', validateCourseSlug, getCourseBySlug);

export default router;
