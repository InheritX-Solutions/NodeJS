import { body, param } from 'express-validator';

/**
 * Create email template validation
 */
export const createEmailTemplateValidation = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('template')
    .trim()
    .notEmpty()
    .withMessage('Template is required'),
  body('description')
    .optional()
    .trim(),
];

/**
 * Update email template validation
 */
export const updateEmailTemplateValidation = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid template ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('subject')
    .optional()
    .trim(),
  body('template')
    .optional()
    .trim(),
];

/**
 * Send email validation
 */
export const sendEmailValidation = () => [
  body('to')
    .isEmail()
    .withMessage('Invalid recipient email'),
  body('templateName')
    .trim()
    .notEmpty()
    .withMessage('Template name is required'),
  body('variables')
    .optional()
    .isObject()
    .withMessage('Variables must be an object'),
];
