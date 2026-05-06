import mongoose from 'mongoose';
import env from './env.js';
import Logger from '../services/log.service.js';

// Connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    Logger.info(`Connecting to MongoDB: ${env.MONGO_URI}`);
    
    await mongoose.connect(env.MONGO_URI, mongooseOptions);
    
    Logger.info('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      Logger.info('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      Logger.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      Logger.warn('Mongoose disconnected from MongoDB');
    });
  } catch (error) {
    Logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    Logger.info('MongoDB disconnected successfully');
  } catch (error) {
    Logger.error('MongoDB disconnection error:', error);
    process.exit(1);
  }
};

export { connectDB, disconnectDB };
