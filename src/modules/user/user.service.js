import UserRepository from './user.repository.js';
import Logger from '../../services/log.service.js';

/**
 * User Service
 * Business logic for user operations
 */
class UserService {
  /**
   * Get all users
   */
  async getAllUsers(query = {}, options = {}) {
    try {
      const result = await UserRepository.findAll(query, options);
      Logger.info('Users fetched', { count: result.users.length });
      return result;
    } catch (error) {
      Logger.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      Logger.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const profile = await UserRepository.findProfileByAuthId(userId);

      return {
        ...user.toObject(),
        profile,
      };
    } catch (error) {
      Logger.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Update auth record
      Object.assign(user, updateData);
      await user.save();

      Logger.info(`User updated: ${userId}`);

      return user;
    } catch (error) {
      Logger.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId, preferences) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const profile = await UserRepository.updatePreferences(
        userId,
        preferences
      );

      if (!profile) {
        // Create profile if doesn't exist
        await UserRepository.createProfile(userId, { preferences });
      }

      Logger.info(`Preferences updated for user: ${userId}`);

      return profile;
    } catch (error) {
      Logger.error('Update preferences error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      await UserRepository.deleteUser(userId);

      Logger.info(`User deleted: ${userId}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      Logger.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(searchQuery, options = {}) {
    try {
      if (!searchQuery || searchQuery.trim().length === 0) {
        const error = new Error('Search query is required');
        error.statusCode = 400;
        throw error;
      }

      const result = await UserRepository.search(searchQuery, options);
      return result;
    } catch (error) {
      Logger.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const totalUsers = await UserRepository.getTotalUsers();

      return {
        totalUsers,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('Get user stats error:', error);
      throw error;
    }
  }
}

export default new UserService();
