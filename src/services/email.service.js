import sgMail from '@sendgrid/mail';
import env from '../config/env.js';
import Logger from './log.service.js';

/**
 * Email Service using SendGrid
 */
class EmailService {
  constructor() {
    if (env.SENDGRID_API_KEY) {
      sgMail.setApiKey(env.SENDGRID_API_KEY);
    }
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @param {String} options.to - Recipient email
   * @param {String} options.subject - Email subject
   * @param {String} options.html - Email HTML content
   * @param {String} options.text - Email text content
   * @returns {Promise<Object>} SendGrid response
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      if (!env.SENDGRID_API_KEY) {
        Logger.warn('SendGrid API key not configured');
        return null;
      }

      const msg = {
        to,
        from: env.EMAIL_FROM,
        subject,
        html,
        text,
      };

      const response = await sgMail.send(msg);
      Logger.info(`Email sent to ${to}`, { subject });
      return response;
    } catch (error) {
      Logger.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   * @param {String} email - User email
   * @param {String} name - User name
   */
  async sendWelcomeEmail(email, name) {
    const html = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for registering with our application.</p>
      <p>Click <a href="${env.APP_BASE_URL}">here</a> to get started.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Our Application',
      html,
      text: `Welcome ${name}! Thank you for registering.`,
    });
  }

  /**
   * Send password reset email
   * @param {String} email - User email
   * @param {String} resetLink - Password reset link
   */
  async sendPasswordResetEmail(email, resetLink) {
    const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
      text: 'Click the link in the email to reset your password.',
    });
  }

  /**
   * Send email verification email
   * @param {String} email - User email
   * @param {String} verificationLink - Email verification link
   */
  async sendEmailVerificationEmail(email, verificationLink) {
    const html = `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Email Verification',
      html,
      text: 'Click the link to verify your email address.',
    });
  }
}

export default new EmailService();
