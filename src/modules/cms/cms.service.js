import CMSRepository from './cms.repository.js';
import Logger from '../../services/log.service.js';

/**
 * CMS Service
 */
class CMSService {
  /**
   * Get all CMS pages
   */
  async getAllPages(options = {}) {
    try {
      const query = {};
      if (options.status) {
        query.status = options.status;
      }

      const result = await CMSRepository.findAll(query, options);
      return result;
    } catch (error) {
      Logger.error('Get all CMS pages error:', error);
      throw error;
    }
  }

  /**
   * Get CMS page by ID
   */
  async getPageById(pageId) {
    try {
      const page = await CMSRepository.findById(pageId);

      if (!page) {
        const error = new Error('CMS page not found');
        error.statusCode = 404;
        throw error;
      }

      return page;
    } catch (error) {
      Logger.error('Get CMS page by ID error:', error);
      throw error;
    }
  }

  /**
   * Get CMS page by slug (public)
   */
  async getPageBySlug(slug) {
    try {
      const page = await CMSRepository.findBySlug(slug);

      if (!page) {
        const error = new Error('CMS page not found');
        error.statusCode = 404;
        throw error;
      }

      // Increment views
      await CMSRepository.incrementViews(page._id);

      return page;
    } catch (error) {
      Logger.error('Get CMS page by slug error:', error);
      throw error;
    }
  }

  /**
   * Create CMS page
   */
  async createPage(pageData, userId) {
    try {
      const page = await CMSRepository.create({
        ...pageData,
        author: userId,
      });

      Logger.info(`CMS page created: ${pageData.title}`);

      return page;
    } catch (error) {
      Logger.error('Create CMS page error:', error);
      throw error;
    }
  }

  /**
   * Update CMS page
   */
  async updatePage(pageId, updateData) {
    try {
      const page = await CMSRepository.findById(pageId);

      if (!page) {
        const error = new Error('CMS page not found');
        error.statusCode = 404;
        throw error;
      }

      const updated = await CMSRepository.update(pageId, updateData);

      Logger.info(`CMS page updated: ${pageId}`);

      return updated;
    } catch (error) {
      Logger.error('Update CMS page error:', error);
      throw error;
    }
  }

  /**
   * Delete CMS page
   */
  async deletePage(pageId) {
    try {
      const page = await CMSRepository.findById(pageId);

      if (!page) {
        const error = new Error('CMS page not found');
        error.statusCode = 404;
        throw error;
      }

      await CMSRepository.delete(pageId);

      Logger.info(`CMS page deleted: ${pageId}`);

      return { message: 'CMS page deleted successfully' };
    } catch (error) {
      Logger.error('Delete CMS page error:', error);
      throw error;
    }
  }

  /**
   * Publish CMS page
   */
  async publishPage(pageId) {
    try {
      const page = await CMSRepository.findById(pageId);

      if (!page) {
        const error = new Error('CMS page not found');
        error.statusCode = 404;
        throw error;
      }

      const published = await CMSRepository.publish(pageId);

      Logger.info(`CMS page published: ${pageId}`);

      return published;
    } catch (error) {
      Logger.error('Publish CMS page error:', error);
      throw error;
    }
  }

  /**
   * Search CMS pages
   */
  async searchPages(searchQuery, options = {}) {
    try {
      if (!searchQuery || searchQuery.trim().length === 0) {
        const error = new Error('Search query is required');
        error.statusCode = 400;
        throw error;
      }

      const result = await CMSRepository.search(searchQuery, options);
      return result;
    } catch (error) {
      Logger.error('Search CMS pages error:', error);
      throw error;
    }
  }
}

export default new CMSService();
