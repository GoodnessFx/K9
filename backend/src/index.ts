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

import { createServer } from 'http';
import { NotificationService } from './services/notificationService.js';
import { authenticateWallet } from './api/authMiddleware.js';

const app = express();
const httpServer = createServer(app);

// Initialize Notification Service (WebSockets)
new NotificationService(httpServer);

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

// Enforce HTTPS in production
if (config.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(cors({ 
  origin: config.NODE_ENV === 'production' ? config.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/api', limiter);

// Apply wallet authentication to all sensitive API routes
app.use('/api/verify', authenticateWallet);
app.use('/api/contracts', authenticateWallet);
app.use('/api/proof', authenticateWallet);
app.use('/api/signals', authenticateWallet);
app.use('/api/stats', authenticateWallet);
app.use('/api/match', authenticateWallet);
app.use('/api/broadcast', authenticateWallet);
app.use('/api/scan/run', authenticateWallet);

// Apply strict limiter to sensitive routes
app.use('/api/scan', strictLimiter);
app.use('/api/broadcast', strictLimiter);

// API Routes
app.use('/api', routes);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
httpServer.listen(config.PORT, () => {
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

