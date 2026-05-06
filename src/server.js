import app from './app.js';
import env from './config/env.js';
import Logger from './services/log.service.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  Logger.info(`
    ╔═══════════════════════════════════════════════════════════╗
    ║              Server started successfully                  ║
    ║                                                           ║
    ║  Server running at: http://localhost:${PORT}                 ║
    ║  Environment: ${env.NODE_ENV}                                 ║
    ║  Database: ${env.MONGO_URI}       ║
    ╚═══════════════════════════════════════════════════════════╝
  `);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

export default server;
