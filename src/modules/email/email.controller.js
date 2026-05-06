import EmailTemplateService from './email.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendPaginatedSuccess } from '../../utils/response.js';
import { HTTP_STATUS } from '../../config/constants.js';

/**
 * Email Controller
 */

/**
 * Get all email templates
 * GET /api/v1/email/templates
 */
export const getAllTemplates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await EmailTemplateService.getAllTemplates({ page, limit });

  sendPaginatedSuccess(
    res,
    HTTP_STATUS.OK,
    'Templates fetched successfully',
    result.templates,
    result.pagination
  );
});

/**
 * Get template by ID
 * GET /api/v1/email/templates/:id
 */
export const getTemplateById = asyncHandler(async (req, res) => {
  const template = await EmailTemplateService.getTemplateById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'Template fetched successfully', template);
});

/**
 * Create email template
 * POST /api/v1/email/templates
 */
export const createTemplate = asyncHandler(async (req, res) => {
  const template = await EmailTemplateService.createTemplate(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Template created successfully', template);
});

/**
 * Update email template
 * PUT /api/v1/email/templates/:id
 */
export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await EmailTemplateService.updateTemplate(
    req.params.id,
    req.body
  );
  sendSuccess(res, HTTP_STATUS.OK, 'Template updated successfully', template);
});

/**
 * Delete email template
 * DELETE /api/v1/email/templates/:id
 */
export const deleteTemplate = asyncHandler(async (req, res) => {
  const result = await EmailTemplateService.deleteTemplate(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

/**
 * Send email with template
 * POST /api/v1/email/send
 */
export const sendEmail = asyncHandler(async (req, res) => {
  const { to, templateName, variables } = req.body;

  const result = await EmailTemplateService.sendEmailWithTemplate(
    to,
    templateName,
    variables
  );
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

export default {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  sendEmail,
};
