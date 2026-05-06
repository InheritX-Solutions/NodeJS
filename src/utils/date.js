import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format date to specified format
 * @param {Date|String} date - Date to format
 * @param {String} format - Format string (default: 'DD-MM-YYYY')
 * @returns {String} Formatted date
 */
export const formatDate = (date, format = 'DD-MM-YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Get current date
 * @param {String} format - Format string
 * @returns {String} Current date
 */
export const getCurrentDate = (format = 'DD-MM-YYYY') => {
  return dayjs().format(format);
};

/**
 * Get current datetime
 * @param {String} format - Format string
 * @returns {String} Current datetime
 */
export const getCurrentDateTime = (format = 'DD-MM-YYYY HH:mm:ss') => {
  return dayjs().format(format);
};

/**
 * Add days to a date
 * @param {Date|String} date - Base date
 * @param {Number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  return dayjs(date).add(days, 'day').toDate();
};

/**
 * Subtract days from a date
 * @param {Date|String} date - Base date
 * @param {Number} days - Number of days to subtract
 * @returns {Date} New date
 */
export const subtractDays = (date, days) => {
  return dayjs(date).subtract(days, 'day').toDate();
};

/**
 * Check if date is valid
 * @param {Date|String} date - Date to validate
 * @returns {Boolean} Is valid date
 */
export const isValidDate = (date) => {
  return dayjs(date).isValid();
};

/**
 * Get difference between two dates in days
 * @param {Date|String} date1 - First date
 * @param {Date|String} date2 - Second date
 * @returns {Number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  return dayjs(date1).diff(dayjs(date2), 'day');
};

/**
 * Convert date to specific timezone
 * @param {Date|String} date - Date to convert
 * @param {String} tz - Timezone (e.g., 'Asia/Kolkata')
 * @returns {String} Date in timezone
 */
export const convertToTimezone = (date, tz = 'Asia/Kolkata') => {
  return dayjs(date).tz(tz).format('DD-MM-YYYY HH:mm:ss');
};

export default {
  formatDate,
  getCurrentDate,
  getCurrentDateTime,
  addDays,
  subtractDays,
  isValidDate,
  getDaysDifference,
  convertToTimezone,
};
