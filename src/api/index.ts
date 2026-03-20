import axios from 'axios';
import { 
  Signal, 
  ChainRiskIndex, 
  SecurityScanResult, 
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiInstance = axios.create({
  baseURL: API_BASE,
});

export const api = {
  // Signals
  getSignals: async (params?: Record<string, string>): Promise<Signal[]> => {
    const res = await apiInstance.get('/signals', { params });
    return res.data;
  },
  getSignal: async (id: string): Promise<Signal> => {
    const res = await apiInstance.get(`/signals/${id}`);
    return res.data;
  },
  getSignalBrief: async (id: string): Promise<{ brief: string }> => {
    const res = await apiInstance.get(`/signals/${id}/brief`);
    return res.data.data;
  },
  
  // Stats & CRI
  getStats: async () => {
    const res = await apiInstance.get('/stats');
    return res.data;
  },
  getCRI: async (): Promise<ChainRiskIndex[]> => {
    const res = await apiInstance.get('/cri');
    return res.data;
  },

  // Notifications
  getNotificationStatus: async () => {
    const res = await apiInstance.get('/notifications/status');
    return res.data.data;
  },
  connectWA: async (data: { instanceId: string; token: string; phoneNumber: string }) => {
    const res = await apiInstance.post('/notifications/whatsapp/connect', data);
    return res.data;
  },
  testWA: async () => {
    const res = await apiInstance.post('/test/whatsapp-opportunity');
    return res.data;
  },
  testTG: async () => {
    const res = await apiInstance.post('/notifications/telegram/test');
    return res.data;
  },
  broadcast: async (signalId: string, channels: string[]) => {
    const res = await apiInstance.post('/broadcast', { signalId, channels });
    return res.data;
  },

  // Security
  scanContract: async (address: string, chain: string): Promise<SecurityScanResult> => {
    const res = await apiInstance.post('/scan', { address, chain });
    return res.data;
  },

  // Auth
  logout: async () => {
    const res = await apiInstance.post('/auth/logout');
    return res.data;
  }
};

// Legacy exports for compatibility during migration
export const signalsApi = api;
export const criApi = api;
export const scannerApi = api;
export const telegramApi = {
  ...api,
  getStatus: async () => {
    const status = await api.getNotificationStatus();
    return status.telegram;
  },
  connect: async (_data: any) => {
    // This is handled by the new status check logic in settings
  },
  getMessages: async () => [],
  updateRules: async (_rules: any) => {
    // Mock for now
  },
  test: api.testTG,
  disconnect: async () => {}
};
