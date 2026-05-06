import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../config/constants.js';
import { sendError } from '../utils/response.js';

/**
 * Validation middleware to check if validation passed
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Validation failed',
      formattedErrors
    );
  }

  next();
};

export default validateRequest;
