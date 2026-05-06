import { HTTP_STATUS } from '../config/constants.js';

/**
 * Standardized API Response
 */
class ApiResponse {
  constructor(statusCode, message, data = null, errors = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {Object} data - Response data
 */
export const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message = 'Success', data = null) => {
  const response = new ApiResponse(statusCode, message, data);
  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Error details
 */
export const sendError = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Error', errors = null) => {
  const response = new ApiResponse(statusCode, message, null, errors);
  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {Array} data - Response data
 * @param {Object} pagination - Pagination info
 */
export const sendPaginatedSuccess = (res, statusCode, message, data, pagination) => {
  const response = {
    statusCode,
    success: statusCode < 400,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

export default ApiResponse;
