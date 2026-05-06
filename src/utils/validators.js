/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate strong password
 * - At least 8 characters
 * - Contains uppercase, lowercase, number, and special character
 * @param {String} password - Password to validate
 * @returns {Boolean} Is strong password
 */
export const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate URL format
 * @param {String} url - URL to validate
 * @returns {Boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string (remove special characters)
 * @param {String} str - String to sanitize
 * @returns {String} Sanitized string
 */
export const sanitizeString = (str) => {
  return str.replace(/[^a-zA-Z0-9 _-]/g, '');
};

/**
 * Truncate string
 * @param {String} str - String to truncate
 * @param {Number} length - Max length
 * @returns {String} Truncated string
 */
export const truncateString = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export default {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidUrl,
  sanitizeString,
  truncateString,
};
