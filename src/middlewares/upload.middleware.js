import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import env from '../config/env.js';
import Logger from '../services/log.service.js';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
fs.ensureDirSync(uploadDir);

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * File filter function
 */
const fileFilter = (req, file, cb) => {
  if (!env.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(`File type not allowed: ${file.mimetype}`);
    Logger.warn(`Upload rejected: ${file.mimetype}`);
    return cb(error, false);
  }

  cb(null, true);
};

/**
 * Configure multer instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});

/**
 * Single file upload middleware
 */
export const uploadSingleFile = upload.single('file');

/**
 * Multiple files upload middleware
 */
export const uploadMultipleFiles = upload.array('files', 10);

/**
 * Fields upload middleware
 */
export const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 5 },
]);

export default upload;
