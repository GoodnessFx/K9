/**
 * @file auditLogger.ts
 * @description Centralized audit logging for sensitive system actions.
 * Part of the K9 Security module.
 */
import logger from './logger.js';
import { store } from './store.js';
export var AuditAction;
(function (AuditAction) {
    AuditAction["VERIFICATION_APPROVED"] = "VERIFICATION_APPROVED";
    AuditAction["VERIFICATION_REVOKED"] = "VERIFICATION_REVOKED";
    AuditAction["ESCROW_CREATED"] = "ESCROW_CREATED";
    AuditAction["ESCROW_RELEASED"] = "ESCROW_RELEASED";
    AuditAction["DISPUTE_OPENED"] = "DISPUTE_OPENED";
    AuditAction["DISPUTE_RESOLVED"] = "DISPUTE_RESOLVED";
    AuditAction["BADGE_ISSUED"] = "BADGE_ISSUED";
    AuditAction["BADGE_REVOKED"] = "BADGE_REVOKED";
    AuditAction["AUTH_SUCCESS"] = "AUTH_SUCCESS";
    AuditAction["AUTH_FAILURE"] = "AUTH_FAILURE";
})(AuditAction || (AuditAction = {}));
export class AuditLogService {
    /**
     * Log a sensitive action
     */
    static async log(entry) {
        const fullEntry = {
            id: `audit-${Math.random().toString(36).substring(2, 11)}`,
            timestamp: new Date().toISOString(),
            ...entry,
        };
        // Log to standard logger (stdout/files)
        logger.info(`[AUDIT] ${fullEntry.action} by ${fullEntry.actor}: ${JSON.stringify(fullEntry.details)}`);
        // Persist to store (In a real app, this would be a dedicated DB table)
        try {
            const logs = await store.get('audit_logs') || [];
            logs.push(fullEntry);
            // Keep only last 1000 logs in the store for performance
            await store.set('audit_logs', logs.slice(-1000));
        }
        catch (error) {
            logger.error('Failed to persist audit log:', error);
        }
    }
    /**
     * Get audit logs for a specific target or actor
     */
    static async getLogs(filter) {
        const logs = await store.get('audit_logs') || [];
        return logs.filter(log => {
            if (filter.targetId && log.targetId !== filter.targetId)
                return false;
            if (filter.actor && log.actor !== filter.actor)
                return false;
            return true;
        });
    }
}
//# sourceMappingURL=auditLogger.js.map