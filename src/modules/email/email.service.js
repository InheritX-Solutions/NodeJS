import EmailRepository from './email.repository.js';
import EmailService from '../../services/email.service.js';
import Logger from '../../services/log.service.js';

/**
 * Email Service
 */
class EmailTemplateService {
  /**
   * Get all email templates
   */
  async getAllTemplates(options = {}) {
    try {
      const result = await EmailRepository.findAll(options);
      return result;
    } catch (error) {
      Logger.error('Get all templates error:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  async getTemplateById(templateId) {
    try {
      const template = await EmailRepository.findById(templateId);

      if (!template) {
        const error = new Error('Template not found');
        error.statusCode = 404;
        throw error;
      }

      return template;
    } catch (error) {
      Logger.error('Get template by ID error:', error);
      throw error;
    }
  }

  /**
   * Create email template
   */
  async createTemplate(templateData) {
    try {
      // Check if template with same name already exists
      const existing = await EmailRepository.findByName(templateData.name);

      if (existing) {
        const error = new Error('Template with this name already exists');
        error.statusCode = 409;
        throw error;
      }

      const template = await EmailRepository.create(templateData);
      Logger.info(`Email template created: ${templateData.name}`);

      return template;
    } catch (error) {
      Logger.error('Create template error:', error);
      throw error;
    }
  }

  /**
   * Update email template
   */
  async updateTemplate(templateId, updateData) {
    try {
      const template = await EmailRepository.update(templateId, updateData);

      if (!template) {
        const error = new Error('Template not found');
        error.statusCode = 404;
        throw error;
      }

      Logger.info(`Email template updated: ${templateId}`);

      return template;
    } catch (error) {
      Logger.error('Update template error:', error);
      throw error;
    }
  }

  /**
   * Delete email template
   */
  async deleteTemplate(templateId) {
    try {
      const template = await EmailRepository.delete(templateId);

      if (!template) {
        const error = new Error('Template not found');
        error.statusCode = 404;
        throw error;
      }

      Logger.info(`Email template deleted: ${templateId}`);

      return { message: 'Template deleted successfully' };
    } catch (error) {
      Logger.error('Delete template error:', error);
      throw error;
    }
  }

  /**
   * Send email using template
   */
  async sendEmailWithTemplate(to, templateName, variables = {}) {
    try {
      const template = await EmailRepository.findByName(templateName);

      if (!template) {
        const error = new Error('Template not found');
        error.statusCode = 404;
        throw error;
      }

      if (!template.isActive) {
        const error = new Error('Template is not active');
        error.statusCode = 400;
        throw error;
      }

      // Replace variables in template
      let html = template.template;
      Object.entries(variables).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      let subject = template.subject;
      Object.entries(variables).forEach(([key, value]) => {
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      // Send email
      await EmailService.sendEmail({
        to,
        subject,
        html,
      });

      Logger.info(`Email sent using template: ${templateName} to ${to}`);

      return { message: 'Email sent successfully' };
    } catch (error) {
      Logger.error('Send email error:', error);
      throw error;
    }
  }
}

export default new EmailTemplateService();
