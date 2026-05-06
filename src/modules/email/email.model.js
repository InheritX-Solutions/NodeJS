import mongoose from 'mongoose';

/**
 * Email Template Schema
 */
const emailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true, // HTML template with placeholders
    },
    description: String,
    variables: [String], // List of available variables
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const EmailModel = mongoose.model('EmailTemplate', emailSchema);
export default EmailModel;
