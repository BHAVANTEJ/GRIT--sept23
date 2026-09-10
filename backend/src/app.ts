import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import profileRoutes from './routes/profile.routes';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// API Endpoints
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', profileRoutes);

// Fallbacks
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
