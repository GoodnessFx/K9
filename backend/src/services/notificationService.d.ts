/**
 * @file notificationService.ts
 * @description Real-time notifications via WebSockets and push (WhatsApp).
 * Part of the K9 Matching & Notifications module.
 */
import { Server } from 'http';
export declare class NotificationService {
    private wss;
    private clients;
    constructor(server: Server);
    private init;
    private broadcast;
    private sendPushNotification;
}
//# sourceMappingURL=notificationService.d.ts.map