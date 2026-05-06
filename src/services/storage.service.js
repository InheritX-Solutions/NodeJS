import AWS from 'aws-sdk';
import env from '../config/env.js';
import Logger from './log.service.js';
import fs from 'fs-extra';

/**
 * AWS S3 Storage Service
 */
class StorageService {
  constructor() {
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      this.s3 = new AWS.S3({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
      });
    }
  }

  /**
   * Upload file to S3
   * @param {String} filePath - Local file path
   * @param {String} key - S3 key (path)
   * @param {String} contentType - File content type
   * @returns {Promise<Object>} S3 upload response
   */
  async uploadToS3(filePath, key, contentType) {
    try {
      if (!this.s3) {
        Logger.warn('AWS S3 not configured');
        return null;
      }

      const fileContent = await fs.readFile(filePath);

      const params = {
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
      };

      const response = await this.s3.upload(params).promise();
      Logger.info(`File uploaded to S3: ${key}`);
      return response;
    } catch (error) {
      Logger.error('S3 upload error:', error);
      throw error;
    }
  }

  /**
   * Delete file from S3
   * @param {String} key - S3 key (path)
   * @returns {Promise<Object>} S3 delete response
   */
  async deleteFromS3(key) {
    try {
      if (!this.s3) {
        Logger.warn('AWS S3 not configured');
        return null;
      }

      const params = {
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      };

      const response = await this.s3.deleteObject(params).promise();
      Logger.info(`File deleted from S3: ${key}`);
      return response;
    } catch (error) {
      Logger.error('S3 delete error:', error);
      throw error;
    }
  }

  /**
   * Get file URL from S3
   * @param {String} key - S3 key (path)
   * @returns {String} S3 file URL
   */
  getFileUrl(key) {
    if (!this.s3 || !env.AWS_S3_BUCKET) {
      return null;
    }

    return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * List files in S3 bucket
   * @param {String} prefix - S3 prefix (folder path)
   * @returns {Promise<Array>} List of files
   */
  async listFiles(prefix = '') {
    try {
      if (!this.s3) {
        Logger.warn('AWS S3 not configured');
        return [];
      }

      const params = {
        Bucket: env.AWS_S3_BUCKET,
        Prefix: prefix,
      };

      const response = await this.s3.listObjectsV2(params).promise();
      return response.Contents || [];
    } catch (error) {
      Logger.error('S3 list error:', error);
      throw error;
    }
  }
}

export default new StorageService();
