import UserModel from './user.model.js';
import AuthModel from '../auth/auth.model.js';
import Logger from '../../services/log.service.js';

/**
 * User Repository
 * Data access layer for user operations
 */
class UserRepository {
  /**
   * Find all users with pagination
   */
  async findAll(query = {}, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const users = await AuthModel.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password -refreshTokens');

      const total = await AuthModel.countDocuments(query);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error('Error finding all users:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    try {
      return await AuthModel.findById(userId).select('-password');
    } catch (error) {
      Logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create user profile
   */
  async createProfile(authId, profileData) {
    try {
      const profile = new UserModel({
        authId,
        ...profileData,
      });
      await profile.save();
      return profile;
    } catch (error) {
      Logger.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Find user profile by authId
   */
  async findProfileByAuthId(authId) {
    try {
      return await UserModel.findOne({ authId });
    } catch (error) {
      Logger.error('Error finding user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(authId, updateData) {
    try {
      return await UserModel.findOneAndUpdate(
        { authId },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
    } catch (error) {
      Logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(authId, preferences) {
    try {
      return await UserModel.findOneAndUpdate(
        { authId },
        { preferences },
        {
          new: true,
        }
      );
    } catch (error) {
      Logger.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Delete user and profile
   */
  async deleteUser(userId) {
    try {
      // Delete user profile
      await UserModel.deleteOne({ authId: userId });

      // Delete user auth record
      return await AuthModel.findByIdAndDelete(userId);
    } catch (error) {
      Logger.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Search users
   */
  async search(searchQuery, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const query = {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ],
      };

      const users = await AuthModel.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password');

      const total = await AuthModel.countDocuments(query);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Get user count
   */
  async getTotalUsers() {
    try {
      return await AuthModel.countDocuments();
    } catch (error) {
      Logger.error('Error getting user count:', error);
      throw error;
    }
  }

  /**
   * Add user document
   */
  async addDocument(authId, document) {
    try {
      return await UserModel.findOneAndUpdate(
        { authId },
        {
          $push: {
            documents: {
              ...document,
              uploadedAt: new Date(),
            },
          },
        },
        { new: true }
      );
    } catch (error) {
      Logger.error('Error adding document:', error);
      throw error;
    }
  }

  /**
   * Remove user document
   */
  async removeDocument(authId, documentId) {
    try {
      return await UserModel.findOneAndUpdate(
        { authId },
        {
          $pull: {
            documents: { _id: documentId },
          },
        },
        { new: true }
      );
    } catch (error) {
      Logger.error('Error removing document:', error);
      throw error;
    }
  }
}

export default new UserRepository();
