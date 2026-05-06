import { Router } from 'express';
import * as emailController from './email.controller.js';
import {
  createEmailTemplateValidation,
  updateEmailTemplateValidation,
  sendEmailValidation,
} from './email.validation.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import { verifyToken, checkRole } from '../../middlewares/auth.middleware.js';
import { USER_ROLES } from '../../config/constants.js';

const router = Router();

/**
 * All routes require authentication
 */
router.use(verifyToken);

/**
 * Public email routes
 */

// Send email with template
router.post(
  '/send',
  sendEmailValidation(),
  validateRequest,
  emailController.sendEmail
);

/**
 * Admin only routes
 */

// Get all templates
router.get(
  '/templates',
  checkRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]),
  emailController.getAllTemplates
);

// Get template by ID
router.get(
  '/templates/:id',
  checkRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]),
  emailController.getTemplateById
);

// Create template
router.post(
  '/templates',
  checkRole([USER_ROLES.ADMIN]),
  createEmailTemplateValidation(),
  validateRequest,
  emailController.createTemplate
);

// Update template
router.put(
  '/templates/:id',
  checkRole([USER_ROLES.ADMIN]),
  updateEmailTemplateValidation(),
  validateRequest,
  emailController.updateTemplate
);

// Delete template
router.delete(
  '/templates/:id',
  checkRole([USER_ROLES.ADMIN]),
  emailController.deleteTemplate
);

export default router;
