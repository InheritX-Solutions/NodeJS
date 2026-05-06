import { Router } from 'express';
import * as cmsController from './cms.controller.js';
import {
  getAllCmsValidation,
  getCmsValidation,
  getCmsBySlugValidation,
  createCmsValidation,
  updateCmsValidation,
  deleteCmsValidation,
} from './cms.validation.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import { verifyToken, checkRole, optionalVerifyToken } from '../../middlewares/auth.middleware.js';
import { USER_ROLES } from '../../config/constants.js';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// Get CMS page by slug
router.get(
  '/page/:slug',
  getCmsBySlugValidation(),
  validateRequest,
  cmsController.getPageBySlug
);

// Search CMS pages
router.get(
  '/search/query',
  cmsController.searchPages
);

/**
 * Protected routes
 */

// Get all CMS pages (admin only)
router.get(
  '/',
  verifyToken,
  checkRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]),
  getAllCmsValidation(),
  validateRequest,
  cmsController.getAllPages
);

// Get CMS page by ID (admin only)
router.get(
  '/:id',
  verifyToken,
  checkRole([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]),
  getCmsValidation(),
  validateRequest,
  cmsController.getPageById
);

// Create CMS page (admin only)
router.post(
  '/',
  verifyToken,
  checkRole([USER_ROLES.ADMIN]),
  createCmsValidation(),
  validateRequest,
  cmsController.createPage
);

// Update CMS page (admin only)
router.put(
  '/:id',
  verifyToken,
  checkRole([USER_ROLES.ADMIN]),
  updateCmsValidation(),
  validateRequest,
  cmsController.updatePage
);

// Publish CMS page (admin only)
router.post(
  '/:id/publish',
  verifyToken,
  checkRole([USER_ROLES.ADMIN]),
  getCmsValidation(),
  validateRequest,
  cmsController.publishPage
);

// Delete CMS page (admin only)
router.delete(
  '/:id',
  verifyToken,
  checkRole([USER_ROLES.ADMIN]),
  deleteCmsValidation(),
  validateRequest,
  cmsController.deletePage
);

export default router;
