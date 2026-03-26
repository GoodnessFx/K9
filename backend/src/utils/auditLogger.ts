/**
 * @file auditLogger.ts
 * @description Centralized audit logging for sensitive system actions.
 * Part of the K9 Security module.
 */

import logger from './logger.js';
import { store } from './store.js';

export enum AuditAction {
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED',
  VERIFICATION_REVOKED = 'VERIFICATION_REVOKED',
  ESCROW_CREATED = 'ESCROW_CREATED',
  ESCROW_RELEASED = 'ESCROW_RELEASED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  BADGE_ISSUED = 'BADGE_ISSUED',
  BADGE_REVOKED = 'BADGE_REVOKED',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  actor: string; // Wallet address or 'SYSTEM'
  targetId?: string; // e.g., companyId, talentId, escrowId
  details: any;
  ipAddress?: string;
}

export class AuditLogService {
  /**
   * Log a sensitive action
   */
  static async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    const fullEntry: AuditEntry = {
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
    } catch (error) {
      logger.error('Failed to persist audit log:', error);
    }
  }

  /**
   * Get audit logs for a specific target or actor
   */
  static async getLogs(filter: { targetId?: string; actor?: string }) {
    const logs: AuditEntry[] = await store.get('audit_logs') || [];
    return logs.filter(log => {
      if (filter.targetId && log.targetId !== filter.targetId) return false;
      if (filter.actor && log.actor !== filter.actor) return false;
      return true;
    });
  }
}
