import app from './app';
import { ENV } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(ENV.PORT, () => {
  logger.info(`🚀 GRIT SCHOOL Backend server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default server;
