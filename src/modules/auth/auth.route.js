import { Router } from 'express';
import * as authController from './auth.controller.js';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
} from './auth.validation.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * Public routes
 */

// Register
router.post(
  '/register',
  registerValidation(),
  validateRequest,
  authController.register
);

// Login
router.post(
  '/login',
  loginValidation(),
  validateRequest,
  authController.login
);

// Refresh token
router.post(
  '/refresh-token',
  refreshTokenValidation(),
  validateRequest,
  authController.refreshToken
);

/**
 * Protected routes
 */

// Logout
router.post('/logout', verifyToken, authController.logout);

// Logout all devices
router.post('/logout-all', verifyToken, authController.logoutAll);

// Get profile
router.get('/profile', verifyToken, authController.getProfile);

// Update profile
router.put(
  '/profile',
  verifyToken,
  updateProfileValidation(),
  validateRequest,
  authController.updateProfile
);

// Change password
router.post(
  '/change-password',
  verifyToken,
  changePasswordValidation(),
  validateRequest,
  authController.changePassword
);

export default router;
