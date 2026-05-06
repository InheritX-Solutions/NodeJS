import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import env from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import Logger from './services/log.service.js';
import { startJobs } from './jobs/demo.job.js';

const app = express();

/**
 * Connect to database
 */
connectDB();

/**
 * Trust proxy
 */
app.set('trust proxy', 1);

/**
 * Middleware configuration
 */

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [env.FRONTEND_URL, 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => Logger.info(message.trim()),
  },
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Routes
 */
app.use('/api/v1', routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀"
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});


/**
 * Error handler middleware
 */
app.use(errorHandler);

/**
 * Start cron jobs
 */
startJobs();

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
