import CMSService from './cms.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendPaginatedSuccess } from '../../utils/response.js';
import { HTTP_STATUS } from '../../config/constants.js';

/**
 * CMS Controller
 */

/**
 * Get all CMS pages
 * GET /api/v1/cms
 */
export const getAllPages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const result = await CMSService.getAllPages({ page, limit, status });

  sendPaginatedSuccess(
    res,
    HTTP_STATUS.OK,
    'CMS pages fetched successfully',
    result.pages,
    result.pagination
  );
});

/**
 * Get CMS page by ID
 * GET /api/v1/cms/:id
 */
export const getPageById = asyncHandler(async (req, res) => {
  const page = await CMSService.getPageById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'CMS page fetched successfully', page);
});

/**
 * Get CMS page by slug (public)
 * GET /api/v1/cms/page/:slug
 */
export const getPageBySlug = asyncHandler(async (req, res) => {
  const page = await CMSService.getPageBySlug(req.params.slug);
  sendSuccess(res, HTTP_STATUS.OK, 'CMS page fetched successfully', page);
});

/**
 * Create CMS page
 * POST /api/v1/cms
 */
export const createPage = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const page = await CMSService.createPage(req.body, userId);
  sendSuccess(res, HTTP_STATUS.CREATED, 'CMS page created successfully', page);
});

/**
 * Update CMS page
 * PUT /api/v1/cms/:id
 */
export const updatePage = asyncHandler(async (req, res) => {
  const page = await CMSService.updatePage(req.params.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'CMS page updated successfully', page);
});

/**
 * Delete CMS page
 * DELETE /api/v1/cms/:id
 */
export const deletePage = asyncHandler(async (req, res) => {
  const result = await CMSService.deletePage(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

/**
 * Publish CMS page
 * POST /api/v1/cms/:id/publish
 */
export const publishPage = asyncHandler(async (req, res) => {
  const page = await CMSService.publishPage(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'CMS page published successfully', page);
});

/**
 * Search CMS pages
 * GET /api/v1/cms/search/query
 */
export const searchPages = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await CMSService.searchPages(q, { page, limit });

  sendPaginatedSuccess(
    res,
    HTTP_STATUS.OK,
    'CMS pages found',
    result.pages,
    result.pagination
  );
});

export default {
  getAllPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  searchPages,
};
