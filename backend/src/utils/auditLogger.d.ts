/**
 * @file auditLogger.ts
 * @description Centralized audit logging for sensitive system actions.
 * Part of the K9 Security module.
 */
export declare enum AuditAction {
    VERIFICATION_APPROVED = "VERIFICATION_APPROVED",
    VERIFICATION_REVOKED = "VERIFICATION_REVOKED",
    ESCROW_CREATED = "ESCROW_CREATED",
    ESCROW_RELEASED = "ESCROW_RELEASED",
    DISPUTE_OPENED = "DISPUTE_OPENED",
    DISPUTE_RESOLVED = "DISPUTE_RESOLVED",
    BADGE_ISSUED = "BADGE_ISSUED",
    BADGE_REVOKED = "BADGE_REVOKED",
    AUTH_SUCCESS = "AUTH_SUCCESS",
    AUTH_FAILURE = "AUTH_FAILURE"
}
export interface AuditEntry {
    id: string;
    timestamp: string;
    action: AuditAction;
    actor: string;
    targetId?: string;
    details: any;
    ipAddress?: string;
}
export declare class AuditLogService {
    /**
     * Log a sensitive action
     */
    static log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void>;
    /**
     * Get audit logs for a specific target or actor
     */
    static getLogs(filter: {
        targetId?: string;
        actor?: string;
    }): Promise<AuditEntry[]>;
}
//# sourceMappingURL=auditLogger.d.ts.map