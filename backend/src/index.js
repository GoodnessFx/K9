import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import routes from './api/routes.js';
import { signalEngine } from './services/signalEngine.js';
import { startBot } from './telegram/bot.js';
import { initScheduler } from './services/scheduler.js';
import logger from './utils/logger.js';
const app = express();
// Middleware
app.use(helmet());
app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json());
// API Routes
app.use('/api', routes);
// Error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
const server = app.listen(config.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${config.PORT}`);
    logger.info(`🌍 NODE_ENV: ${config.NODE_ENV}`);
});
// Start Telegram Bot
startBot();
// Initialize Scheduler
initScheduler();
// Initial scan on startup
signalEngine.runScan();
export default app;
//# sourceMappingURL=index.js.map