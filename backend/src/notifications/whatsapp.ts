import axios, { AxiosError } from 'axios';
import type { Signal } from '../types/index.js';
import logger from '../utils/logger.js';

const BASE = 'https://api.green-api.com';

function getCfg() {
  const id = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  const number = process.env.MY_WHATSAPP_NUMBER;
  if (!id || !token) return null;
  return { id, token, number };
}

export async function getWhatsAppStatus(): Promise<{
  connected: boolean;
  phone?: string;
  messagesUsed?: number;
  messagesLimit: number;
  error?: string;
}> {
  const c = getCfg();
  if (!c) return { 
    connected: false, 
    messagesLimit: 1500, 
    error: 'Add GREEN_API_INSTANCE_ID and GREEN_API_TOKEN to .env' 
  };

  try {
    const [stateRes, infoRes] = await Promise.allSettled([
      axios.get(`${BASE}/waInstance${c.id}/getStateInstance/${c.token}`, { timeout: 8000 }),
      axios.get(`${BASE}/waInstance${c.id}/getDeviceInfo/${c.token}`, { timeout: 8000 }),
    ]);

    const state = stateRes.status === 'fulfilled' ? stateRes.value.data?.stateInstance : null;
    const phone = infoRes.status === 'fulfilled' ? infoRes.value.data?.deviceInfo?.phone : undefined;

    return {
      connected: state === 'authorized',
      phone,
      messagesLimit: 1500,
      error: state !== 'authorized' ? `Instance: ${state}` : undefined,
    } as any;
  } catch (e) {
    return {
      connected: false,
      messagesLimit: 1500,
      error: e instanceof AxiosError ? e.response?.data?.message || e.message : 'Request failed',
    };
  }
}

export async function sendWhatsApp(chatId: string, message: string): Promise<boolean> {
  const c = getCfg();
  if (!c) { logger.warn('WhatsApp: not configured'); return false; }

  try {
    const res = await axios.post(
      `${BASE}/waInstance${c.id}/sendMessage/${c.token}`,
      { chatId, message },
      { timeout: 12000 }
    );
    logger.info('WhatsApp sent', { chatId, idMessage: res.data?.idMessage });
    return true;
  } catch (e) {
    logger.error('WhatsApp send failed', { chatId, error: e instanceof AxiosError ? e.message : e });
    return false;
  }
}

export async function sendTestMessage(): Promise<boolean> {
  const c = getCfg();
  if (!c || !c.number) return false;
  return sendWhatsApp(`${c.number}@c.us`, '🐶 K9 Test Message: Your WhatsApp alerts are now connected!');
}

export async function sendSignalToWhatsApp(signal: Signal): Promise<boolean> {
  const c = getCfg();
  if (!c || !c.number) return false;
  const message = formatSignalForWhatsApp(signal);
  return sendWhatsApp(`${c.number}@c.us`, message);
}

function formatSignalForWhatsApp(signal: Signal): string {
  const categoryLabel: Record<string, string> = {
    free: 'FREE MONEY ALERT',
    jobs: 'CRYPTO JOB — No Experience Needed',
    insider: 'INSIDER ALERT — Someone Knows Something',
    market: 'MARKET OPPORTUNITY',
    prediction: 'PREDICTION MARKET ALERT',
  };

  const header = categoryLabel[signal.category] || 'K9 FOUND SOMETHING';

  const lines = [
    `K9 found something for you`,
    `─────────────────────────────────`,
    ``,
    header,
    ``,
    `WHAT K9 FOUND`,
    signal.intelligenceBrief || signal.summary,
    ``,
    `CONFIDENCE: ${signal.score}/100`,
    `TIME TO ACT: ${signal.timeframe || 'Today only'}`,
    ``,
    `HOW RISKY IS THIS?`,
    `${signal.risk.toUpperCase()} RISK — ${signal.analysis}`,
    ``,
    `WHY YOU'RE SEEING THIS EARLY`,
    `K9 found this ${signal.source} signal before it trended.`,
    ``,
    `SOURCE: ${signal.source}`,
    `─────────────────────────────────`,
    `K9 · k9.app`
  ];

  return lines.join('\n');
}
