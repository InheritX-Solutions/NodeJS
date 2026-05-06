import AuthService from './auth.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { HTTP_STATUS } from '../../config/constants.js';
import Logger from '../../services/log.service.js';
import requestIp from 'request-ip';

/**
 * Auth Controller
 * Handle authentication requests
 */

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, result.message, result.user);
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ip = requestIp.getClientIp(req);
  const userAgent = req.headers['user-agent'];

  const result = await AuthService.login(email, password, {
    loginIp: ip,
    loginUserAgent: userAgent,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Login successful', result);
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await AuthService.refreshToken(refreshToken);
  sendSuccess(res, HTTP_STATUS.OK, 'Token refreshed successfully', tokens);
});

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { refreshToken } = req.body;

  const result = await AuthService.logout(userId, refreshToken);
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

/**
 * Logout from all devices
 * POST /api/v1/auth/logout-all
 */
export const logoutAll = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.logoutAllDevices(userId);
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

/**
 * Get user profile
 * GET /api/v1/auth/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await AuthService.getProfile(userId);
  sendSuccess(res, HTTP_STATUS.OK, 'Profile fetched successfully', user);
});

/**
 * Update user profile
 * PUT /api/v1/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await AuthService.updateProfile(userId, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Profile updated successfully', user);
});

/**
 * Change password
 * POST /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  const result = await AuthService.changePassword(
    userId,
    currentPassword,
    newPassword
  );
  sendSuccess(res, HTTP_STATUS.OK, result.message);
});

export default {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
  updateProfile,
  changePassword,
};
