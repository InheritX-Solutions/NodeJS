import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import env from '../../config/env.js';
import AuthRepository from './auth.repository.js';
import EmailService from '../../services/email.service.js';
import Logger from '../../services/log.service.js';
import { USER_STATUS } from '../../config/constants.js';

/**
 * Auth Service
 * Business logic for authentication operations
 */
class AuthService {
  /**
   * Register new user
   */
  async register(registerData) {
    try {
      // Check if user already exists
      const existingUser = await AuthRepository.findByEmail(registerData.email);
      if (existingUser) {
        const error = new Error('User already exists with this email');
        error.statusCode = 409;
        throw error;
      }

      // Create new user
      const user = await AuthRepository.create({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        status: USER_STATUS.PENDING,
      });

      // Send welcome email
      await EmailService.sendWelcomeEmail(user.email, user.firstName);

      Logger.info(`User registered: ${user.email}`);

      return {
        user: user.getProfile(),
        message: 'User registered successfully. Please check your email for verification.',
      };
    } catch (error) {
      Logger.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password, metadata) {
    try {
      // Find user with password
      const user = await AuthRepository.findByEmailWithPassword(email);

      if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Check if account is locked
      if (user.isLocked()) {
        const error = new Error('Account is locked. Please try again later.');
        error.statusCode = 401;
        throw error;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        await user.incLoginAttempts();
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Update last login
      await AuthRepository.updateLastLogin(user._id, metadata);

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Store refresh token
      await AuthRepository.addRefreshToken(user._id, tokens.refreshToken);

      Logger.info(`User logged in: ${user.email}`);

      return {
        user: user.getProfile(),
        ...tokens,
      };
    } catch (error) {
      Logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

      // Get user
      const user = await AuthRepository.findById(decoded.userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Check if refresh token exists
      const tokenExists = user.refreshTokens?.some(
        (rt) => rt.token === refreshToken
      );

      if (!tokenExists) {
        const error = new Error('Invalid refresh token');
        error.statusCode = 401;
        throw error;
      }

      // Remove old refresh token
      await AuthRepository.removeRefreshToken(user._id, refreshToken);

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Store new refresh token
      await AuthRepository.addRefreshToken(user._id, tokens.refreshToken);

      Logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;
    } catch (error) {
      Logger.error('Refresh token error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(userId, refreshToken) {
    try {
      // Remove refresh token
      await AuthRepository.removeRefreshToken(userId, refreshToken);

      Logger.info(`User logged out: ${userId}`);

      return { message: 'Logged out successfully' };
    } catch (error) {
      Logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tokenId: uuidv4(),
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRE }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRE,
    };
  }

  /**
   * Logout all devices (logout from all sessions)
   */
  async logoutAllDevices(userId) {
    try {
      await AuthRepository.update(userId, { refreshTokens: [] });
      Logger.info(`User logged out from all devices: ${userId}`);
      return { message: 'Logged out from all devices' };
    } catch (error) {
      Logger.error('Logout all devices error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const user = await AuthRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      return user.getProfile();
    } catch (error) {
      Logger.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update profile
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await AuthRepository.update(userId, updateData);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      Logger.info(`User profile updated: ${userId}`);

      return user.getProfile();
    } catch (error) {
      Logger.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await AuthRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify current password
      const userWithPassword = await AuthRepository.findByEmailWithPassword(
        user.email
      );
      const isPasswordValid = await userWithPassword.comparePassword(
        currentPassword
      );

      if (!isPasswordValid) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
      }

      // Update password
      await AuthRepository.update(userId, { password: newPassword });

      // Logout from all devices
      await this.logoutAllDevices(userId);

      Logger.info(`Password changed for user: ${userId}`);

      return { message: 'Password changed successfully. Please login again.' };
    } catch (error) {
      Logger.error('Change password error:', error);
      throw error;
    }
  }
}

export default new AuthService();
