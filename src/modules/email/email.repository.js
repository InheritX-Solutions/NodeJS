import EmailModel from './email.model.js';
import Logger from '../../services/log.service.js';

/**
 * Email Repository
 */
class EmailRepository {
  /**
   * Find all templates
   */
  async findAll(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const templates = await EmailModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await EmailModel.countDocuments();

      return {
        templates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error('Error finding templates:', error);
      throw error;
    }
  }

  /**
   * Find template by name
   */
  async findByName(name) {
    try {
      return await EmailModel.findOne({ name });
    } catch (error) {
      Logger.error('Error finding template by name:', error);
      throw error;
    }
  }

  /**
   * Find template by ID
   */
  async findById(templateId) {
    try {
      return await EmailModel.findById(templateId);
    } catch (error) {
      Logger.error('Error finding template by ID:', error);
      throw error;
    }
  }

  /**
   * Create template
   */
  async create(templateData) {
    try {
      const template = new EmailModel(templateData);
      await template.save();
      return template;
    } catch (error) {
      Logger.error('Error creating template:', error);
      throw error;
    }
  }

  /**
   * Update template
   */
  async update(templateId, updateData) {
    try {
      return await EmailModel.findByIdAndUpdate(templateId, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      Logger.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Delete template
   */
  async delete(templateId) {
    try {
      return await EmailModel.findByIdAndDelete(templateId);
    } catch (error) {
      Logger.error('Error deleting template:', error);
      throw error;
    }
  }
}

export default new EmailRepository();
