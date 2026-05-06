import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route.js';
import userRoutes from '../modules/user/user.route.js';
import emailRoutes from '../modules/email/email.route.js';
import cmsRoutes from '../modules/cms/cms.route.js';

const router = Router();

/**
 * API v1 Routes
 */

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Email routes
router.use('/email', emailRoutes);

// CMS routes
router.use('/cms', cmsRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
