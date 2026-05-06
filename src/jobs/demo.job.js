import cron from 'node-cron';
import Logger from '../services/log.service.js';
import UserRepository from '../modules/user/user.repository.js';

/**
 * Demo Cron Job
 * Runs every day at 2:00 AM
 */
export const demoJob = cron.schedule('0 2 * * *', async () => {
  try {
    Logger.info('Demo cron job started');

    // Example: Get user statistics
    const totalUsers = await UserRepository.getTotalUsers();
    Logger.info(`Total users in system: ${totalUsers}`);

    // Add your job logic here
    // Example: Send daily emails, cleanup data, generate reports, etc.

    Logger.info('Demo cron job completed');
  } catch (error) {
    Logger.error('Demo cron job error:', error);
  }
});

/**
 * Cleanup expired tokens job
 * Runs every hour
 */
export const cleanupTokensJob = cron.schedule('0 * * * *', async () => {
  try {
    Logger.info('Cleanup tokens job started');

    // Implement token cleanup logic here
    // Example: Remove expired refresh tokens, etc.

    Logger.info('Cleanup tokens job completed');
  } catch (error) {
    Logger.error('Cleanup tokens job error:', error);
  }
});

/**
 * Start all cron jobs
 */
export const startJobs = () => {
  Logger.info('Starting cron jobs...');
  demoJob.start();
  cleanupTokensJob.start();
  Logger.info('Cron jobs started');
};

/**
 * Stop all cron jobs
 */
export const stopJobs = () => {
  Logger.info('Stopping cron jobs...');
  demoJob.stop();
  cleanupTokensJob.stop();
  Logger.info('Cron jobs stopped');
};

export default { startJobs, stopJobs };
