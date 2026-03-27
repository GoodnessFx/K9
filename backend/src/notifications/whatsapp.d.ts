import type { Signal } from '../types/index.js';
export declare function getWhatsAppStatus(): Promise<{
    connected: boolean;
    phone?: string;
    messagesUsed?: number;
    messagesLimit: number;
    error?: string;
}>;
export declare function sendWhatsApp(chatId: string, message: string): Promise<boolean>;
export declare function sendTestMessage(): Promise<boolean>;
export declare function sendSignalToWhatsApp(signal: Signal): Promise<boolean>;
//# sourceMappingURL=whatsapp.d.ts.map