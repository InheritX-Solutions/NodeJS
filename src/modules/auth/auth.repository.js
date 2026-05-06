import AuthModel from './auth.model.js';
import Logger from '../../services/log.service.js';

/**
 * Auth Repository
 * Data access layer for authentication related operations
 */
class AuthRepository {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      return await AuthModel.findOne({ email: email.toLowerCase() });
    } catch (error) {
      Logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    try {
      return await AuthModel.findById(userId);
    } catch (error) {
      Logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(userData) {
    try {
      const user = new AuthModel(userData);
      await user.save();
      return user;
    } catch (error) {
      Logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(userId, updateData) {
    try {
      return await AuthModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      Logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(userId) {
    try {
      return await AuthModel.findByIdAndDelete(userId);
    } catch (error) {
      Logger.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Find user with password (for login)
   */
  async findByEmailWithPassword(email) {
    try {
      return await AuthModel.findOne({ email: email.toLowerCase() }).select(
        '+password'
      );
    } catch (error) {
      Logger.error('Error finding user with password:', error);
      throw error;
    }
  }

  /**
   * Add refresh token
   */
  async addRefreshToken(userId, token) {
    try {
      return await AuthModel.updateOne(
        { _id: userId },
        {
          $push: {
            refreshTokens: {
              token,
              createdAt: new Date(),
            },
          },
        }
      );
    } catch (error) {
      Logger.error('Error adding refresh token:', error);
      throw error;
    }
  }

  /**
   * Remove refresh token
   */
  async removeRefreshToken(userId, token) {
    try {
      return await AuthModel.updateOne(
        { _id: userId },
        {
          $pull: {
            refreshTokens: {
              token,
            },
          },
        }
      );
    } catch (error) {
      Logger.error('Error removing refresh token:', error);
      throw error;
    }
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId, metadata) {
    try {
      return await AuthModel.updateOne(
        { _id: userId },
        {
          $set: {
            lastLogin: new Date(),
            metadata,
          },
        }
      );
    } catch (error) {
      Logger.error('Error updating last login:', error);
      throw error;
    }
  }
}

export default new AuthRepository();
