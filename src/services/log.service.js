import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger Service for application-wide logging
 */
class Logger {
  constructor() {
    this.logDir = 'logs';
    this.initializeLogDirectory();
  }

  /**
   * Initialize logs directory
   */
  initializeLogDirectory() {
    try {
      fs.ensureDirSync(this.logDir);
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
  }

  /**
   * Get formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    let formattedMsg = `[${timestamp}] [${level}] ${message}`;

    if (data) {
      formattedMsg += ` ${JSON.stringify(data)}`;
    }

    return formattedMsg;
  }

  /**
   * Write log to file and console
   */
  writeLog(level, message, data = null) {
    const formattedMsg = this.formatMessage(level, message, data);

    // Log to console
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](formattedMsg);

    // Log to file
    try {
      const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
      fs.appendFileSync(logFile, formattedMsg + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    this.writeLog('INFO', message, data);
  }

  /**
   * Log error message
   */
  error(message, data = null) {
    this.writeLog('ERROR', message, data);
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    this.writeLog('WARN', message, data);
  }

  /**
   * Log debug message
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog('DEBUG', message, data);
    }
  }
}

export default new Logger();
