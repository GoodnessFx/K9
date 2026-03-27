import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  API_SECRET: z.string().min(32),

  // AI
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-', { 
    message: 'ANTHROPIC_API_KEY must start with sk-ant-' 
  }),

  // WhatsApp
  GREEN_API_INSTANCE_ID: z.string().optional(),
  GREEN_API_TOKEN: z.string().optional(),
  MY_WHATSAPP_NUMBER: z.string().optional(),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_WEBHOOK_URL: z.string().url().optional(),

  // Cache
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),

  // Optional data sources
  COINGECKO_API_KEY: z.string().optional(),
  ETHERSCAN_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  IMMUNEFI_API_KEY: z.string().optional(),
  BIRDEYE_API_KEY: z.string().optional(),
  GOPLUS_API_KEY: z.string().optional(),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // Signal engine config
  SIGNAL_SCAN_INTERVAL_MINUTES: z.string().default('5').transform(Number),
  MIN_SIGNAL_SCORE: z.string().default('65').transform(Number),
  MAX_SIGNALS_PER_BATCH: z.string().default('20').transform(Number),

  // Sniffer config
  PROXY_PROVIDER: z.enum(['brightdata', 'smartproxy', 'oxylabs']).optional(),
  PROXY_USERNAME: z.string().optional(),
  PROXY_PASSWORD: z.string().optional(),
  PROXY_ENDPOINT: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const config = parsedEnv.data;
