import { body, validationResult } from 'express-validator';
import { isStrongPassword } from '../../utils/validators.js';

/**
 * Register validation rules
 */
export const registerValidation = () => [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .custom((value) => isStrongPassword(value))
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
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
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
];

/**
 * Login validation rules
 */
export const loginValidation = () => [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Refresh token validation rules
 */
export const refreshTokenValidation = () => [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

/**
 * Update profile validation rules
 */
export const updateProfileValidation = () => [
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
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
];

/**
 * Change password validation rules
 */
export const changePasswordValidation = () => [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .custom((value) => isStrongPassword(value))
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
];
