import CMSModel from './cms.model.js';
import Logger from '../../services/log.service.js';

/**
 * CMS Repository
 */
class CMSRepository {
  /**
   * Find all CMS pages with pagination
   */
  async findAll(query = {}, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const pages = await CMSModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('author', 'firstName lastName email');

      const total = await CMSModel.countDocuments(query);

      return {
        pages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error('Error finding CMS pages:', error);
      throw error;
    }
  }

  /**
   * Find CMS page by ID
   */
  async findById(pageId) {
    try {
      return await CMSModel.findById(pageId).populate('author', 'firstName lastName email');
    } catch (error) {
      Logger.error('Error finding CMS page by ID:', error);
      throw error;
    }
  }

  /**
   * Find CMS page by slug
   */
  async findBySlug(slug) {
    try {
      return await CMSModel.findOne({ slug, isPublished: true }).populate(
        'author',
        'firstName lastName email'
      );
    } catch (error) {
      Logger.error('Error finding CMS page by slug:', error);
      throw error;
    }
  }

  /**
   * Create CMS page
   */
  async create(pageData) {
    try {
      const page = new CMSModel(pageData);
      await page.save();
      return page.populate('author', 'firstName lastName email');
    } catch (error) {
      Logger.error('Error creating CMS page:', error);
      throw error;
    }
  }

  /**
   * Update CMS page
   */
  async update(pageId, updateData) {
    try {
      return await CMSModel.findByIdAndUpdate(pageId, updateData, {
        new: true,
        runValidators: true,
      }).populate('author', 'firstName lastName email');
    } catch (error) {
      Logger.error('Error updating CMS page:', error);
      throw error;
    }
  }

  /**
   * Delete CMS page
   */
  async delete(pageId) {
    try {
      return await CMSModel.findByIdAndDelete(pageId);
    } catch (error) {
      Logger.error('Error deleting CMS page:', error);
      throw error;
    }
  }

  /**
   * Publish CMS page
   */
  async publish(pageId) {
    try {
      return await CMSModel.findByIdAndUpdate(
        pageId,
        {
          isPublished: true,
          status: 'published',
          publishedAt: new Date(),
        },
        { new: true }
      );
    } catch (error) {
      Logger.error('Error publishing CMS page:', error);
      throw error;
    }
  }

  /**
   * Increment page views
   */
  async incrementViews(pageId) {
    try {
      return await CMSModel.findByIdAndUpdate(
        pageId,
        { $inc: { views: 1 } },
        { new: true }
      );
    } catch (error) {
      Logger.error('Error incrementing views:', error);
      throw error;
    }
  }

  /**
   * Search CMS pages
   */
  async search(searchQuery, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const query = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
        isPublished: true,
      };

      const pages = await CMSModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await CMSModel.countDocuments(query);

      return {
        pages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error('Error searching CMS pages:', error);
      throw error;
    }
  }
}

export default new CMSRepository();
