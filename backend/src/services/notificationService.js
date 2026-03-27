/**
 * @file notificationService.ts
 * @description Real-time notifications via WebSockets and push (WhatsApp).
 * Part of the K9 Matching & Notifications module.
 */
import { WebSocketServer, WebSocket } from 'ws';
import { emitter } from '../utils/events.js';
import { sendWhatsApp } from '../notifications/whatsapp.js';
import logger from '../utils/logger.js';
export class NotificationService {
    wss = null;
    clients = new Set();
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.init();
    }
    init() {
        this.wss?.on('connection', (ws) => {
            this.clients.add(ws);
            logger.info('New WebSocket client connected');
            ws.on('close', () => {
                this.clients.delete(ws);
                logger.info('WebSocket client disconnected');
            });
            // Send initial connection success
            ws.send(JSON.stringify({ type: 'AUTH', status: 'CONNECTED' }));
        });
        // Listen for new high-signal opportunities (from signalEngine/sniffer)
        emitter.on('newSignal', (signal) => {
            this.broadcast({ type: 'NEW_SIGNAL', data: signal });
            // High-Signal Push Notification (e.g., score > 80)
            if (signal.score >= 80) {
                this.sendPushNotification(signal);
            }
        });
        // Listen for new Pulse updates (from proofService)
        emitter.on('newPulse', (record) => {
            this.broadcast({ type: 'NEW_PULSE', data: record });
        });
    }
    broadcast(message) {
        const payload = JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
    async sendPushNotification(signal) {
        logger.info(`Sending high-signal push notification for: ${signal.title}`);
        // In a real scenario, we would iterate through subscribed users.
        // For now, we use the global WhatsApp notify if configured.
        const message = `🚨 HIGH SIGNAL DETECTED: ${signal.title}\nScore: ${signal.score}/100\n\n${signal.summary}\n\nAct now: ${signal.url}`;
        // This is a placeholder for the user's specific chatId
        const targetChatId = process.env.MY_WHATSAPP_NUMBER;
        if (targetChatId) {
            await sendWhatsApp(targetChatId, message);
        }
    }
}
//# sourceMappingURL=notificationService.js.map