import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './api/routes.js';
import { signalEngine } from './services/signalEngine.js';
import { startBot } from './telegram/bot.js';
import { initScheduler } from './services/scheduler.js';
import logger from './utils/logger.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for sensitive routes
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: { error: 'Too many attempts. Wait a minute.' },
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.green-api.com", "https://api.telegram.org"],
    },
  },
}));

app.use(cors({ 
  origin: config.NODE_ENV === 'production' ? config.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/api', limiter);

// Apply strict limiter to sensitive routes
app.use('/api/scan', strictLimiter);
app.use('/api/broadcast', strictLimiter);

// API Routes
app.use('/api', routes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

