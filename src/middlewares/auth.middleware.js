import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import Logger from '../services/log.service.js';

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    Logger.error('Token verification error:', error);
    sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
};

/**
 * Check role-based access control
 * @param {Array<String>} allowedRoles - Array of allowed roles
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

/**
 * Optional token verification (doesn't fail if token missing)
 */
const optionalVerifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
    }

    next();
  } catch (error) {
    Logger.warn('Optional token verification failed:', error);
    next();
  }
};

export { verifyToken, checkRole, optionalVerifyToken };
