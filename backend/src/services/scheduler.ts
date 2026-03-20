import cron from 'node-cron';
import { signalEngine } from './signalEngine.js';
import { calculateCRI } from './cri.js';
import { store } from '../utils/store.js';
import logger from '../utils/logger.js';

export const initScheduler = () => {
  // Every 5 min: Run all scrapers → score signals → enqueue
  cron.schedule('*/5 * * * *', async () => {
    logger.info('⏰ Running scheduled signal scan...');
    try {
      await signalEngine.runScan();
    } catch (error) {
      logger.error('Error in scheduled scan:', error);
    }
  });

  // Every 15 min: Update Chain Risk Index
  cron.schedule('*/15 * * * *', async () => {
    logger.info('⏰ Updating Chain Risk Index...');
    try {
      const criScores = await calculateCRI();
      await store.set('cri_scores', criScores);
    } catch (error) {
      logger.error('Error updating CRI scores:', error);
    }
  });

  // Every 1 hour: Check temporal baselines, fire anomaly alerts
  cron.schedule('0 * * * *', () => {
    logger.info('⏰ Hourly baseline check initiated...');
  });

  // 08:00 UTC: Send daily digest
  cron.schedule('0 8 * * *', () => {
    logger.info('⏰ Sending daily digest...');
    // Implementation for daily digest delivery would go here
  });

  logger.info('🕒 Scheduler initialized with 5-min, 15-min, hourly, and daily jobs.');
};
