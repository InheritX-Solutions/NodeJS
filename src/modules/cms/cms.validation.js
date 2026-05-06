import { body, param, query } from 'express-validator';

/**
 * Get all CMS pages validation
 */
export const getAllCmsValidation = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
];

/**
 * Get CMS page by ID validation
 */
export const getCmsValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid CMS page ID'),
];

/**
 * Get CMS page by slug validation
 */
export const getCmsBySlugValidation = () => [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required'),
];

/**
 * Create CMS page validation
 */
export const createCmsValidation = () => [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('metaTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Meta title must not exceed 100 characters'),
  body('metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description must not exceed 160 characters'),
  body('category')
    .optional()
    .trim(),
];

/**
 * Update CMS page validation
 */
export const updateCmsValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid CMS page ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
];

/**
 * Delete CMS page validation
 */
export const deleteCmsValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid CMS page ID'),
];
