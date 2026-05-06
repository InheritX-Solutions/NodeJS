import UserService from './user.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../../utils/response.js';
import { HTTP_STATUS } from '../../config/constants.js';

/**
 * User Controller
 * Handle user requests
 */

/**
 * Get all users
 * GET /api/v1/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;

  let query = {};
  if (search) {
    query = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const result = await UserService.getAllUsers(query, { page, limit });

  sendPaginatedSuccess(
    res,
    HTTP_STATUS.OK,
    'Users fetched successfully',
    result.users,
    result.pagination
  );
});

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'User fetched successfully', user);
});

/**
 * Get user profile
 * GET /api/v1/users/:id/profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.getUserProfile(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, 'Profile fetched successfully', profile);
});

/**
 * Update user
 * PUT /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'User updated successfully', user);
});

/**
 * Update user preferences
 * PUT /api/v1/users/:id/preferences
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = await UserService.updatePreferences(
    req.params.id,
    req.body.preferences
  );
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    'Preferences updated successfully',
    preferences
  );
});

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

/**
 * Search users
 * GET /api/v1/users/search/query
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await UserService.searchUsers(q, { page, limit });

  sendPaginatedSuccess(
    res,
    HTTP_STATUS.OK,
    'Users found',
    result.users,
    result.pagination
  );
});

/**
 * Get user statistics
 * GET /api/v1/users/admin/stats
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await UserService.getUserStats();
  sendSuccess(res, HTTP_STATUS.OK, 'Statistics fetched', stats);
});

export default {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUser,
  updatePreferences,
  deleteUser,
  searchUsers,
  getUserStats,
};
