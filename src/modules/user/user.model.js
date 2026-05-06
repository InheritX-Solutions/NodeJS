import mongoose from 'mongoose';
import { USER_STATUS } from '../../config/constants.js';

/**
 * User Extended Schema
 * Additional user profile information
 */
const userSchema = new mongoose.Schema(
  {
    // Reference to auth user
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Additional profile fields
    bio: {
      type: String,
      maxlength: 500,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    company: {
      name: String,
      position: String,
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    preferences: {
      language: {
        type: String,
        enum: ['en', 'hn'],
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
    documents: [
      {
        type: String,
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create index for authId
userSchema.index({ authId: 1 });

export const UserModel = mongoose.model('UserProfile', userSchema);
export default UserModel;
