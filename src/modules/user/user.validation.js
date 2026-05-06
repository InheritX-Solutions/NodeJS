import { body, param, query } from 'express-validator';

/**
 * Get all users validation
 */
export const getAllUsersValidation = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search must be at least 2 characters'),
];

/**
 * Get user by ID validation
 */
export const getUserByIdValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

/**
 * Create user validation
 */
export const createUserValidation = () => [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
];

/**
 * Update user validation
 */
export const updateUserValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
];

/**
 * Delete user validation
 */
export const deleteUserValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

/**
 * Update preferences validation
 */
export const updatePreferencesValidation = () => [
  body('language')
    .optional()
    .isIn(['en', 'hn'])
    .withMessage('Invalid language'),
  body('timezone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Timezone is required'),
  body('notifications')
    .optional()
    .isObject()
    .withMessage('Notifications must be an object'),
];
