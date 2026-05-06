import { Router } from 'express';
import * as userController from './user.controller.js';
import {
  getAllUsersValidation,
  getUserByIdValidation,
  updateUserValidation,
  deleteUserValidation,
  updatePreferencesValidation,
} from './user.validation.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import { verifyToken, checkRole } from '../../middlewares/auth.middleware.js';
import { USER_ROLES } from '../../config/constants.js';

const router = Router();

/**
 * Protected routes - all require authentication
 */
router.use(verifyToken);

/**
 * Get user statistics (admin only)
 */
router.get(
  '/admin/stats',
  checkRole([USER_ROLES.ADMIN]),
  userController.getUserStats
);

/**
 * Search users
 */
router.get('/search', userController.searchUsers);

/**
 * Get all users
 */
router.get('/', getAllUsersValidation(), validateRequest, userController.getAllUsers);

/**
 * Get user profile
 */
router.get('/:id/profile', getUserByIdValidation(), validateRequest, userController.getUserProfile);

/**
 * Get user by ID
 */
router.get(
  '/:id',
  getUserByIdValidation(),
  validateRequest,
  userController.getUserById
);

/**
 * Update user
 */
router.put(
  '/:id',
  updateUserValidation(),
  validateRequest,
  userController.updateUser
);

/**
 * Update user preferences
 */
router.put(
  '/:id/preferences',
  updatePreferencesValidation(),
  validateRequest,
  userController.updatePreferences
);

/**
 * Delete user (admin only)
 */
router.delete(
  '/:id',
  checkRole([USER_ROLES.ADMIN]),
  deleteUserValidation(),
  validateRequest,
  userController.deleteUser
);

export default router;
