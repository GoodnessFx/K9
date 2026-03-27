/**
 * @file authMiddleware.ts
 * @description Middleware for authenticating requests via wallet signatures.
 * Part of the K9 Security module.
 */
import { SecurityService } from '../services/securityService.js';
import logger from '../utils/logger.js';
import { AuditLogService, AuditAction } from '../utils/auditLogger.js';
const securityService = new SecurityService();
export const authenticateWallet = async (req, res, next) => {
    const address = req.headers['x-wallet-address'];
    const signature = req.headers['x-wallet-signature'];
    // EIP-712 structured message — check both header (for GET) and body (for POST)
    const message = req.headers['x-wallet-auth-message']
        ? JSON.parse(req.headers['x-wallet-auth-message'])
        : req.body?.authMessage;
    if (!address || !signature || !message) {
        return res.status(401).json({ error: 'Unauthorized: Wallet signature required' });
    }
    const isValid = securityService.verifyWalletSignature(address, signature, message);
    if (!isValid) {
        logger.warn(`Failed authentication attempt for address: ${address}`);
        await AuditLogService.log({
            action: AuditAction.AUTH_FAILURE,
            actor: address || 'UNKNOWN',
            details: { ip: req.ip, userAgent: req.get('user-agent') }
        });
        return res.status(403).json({ error: 'Forbidden: Invalid wallet signature' });
    }
    // Inject wallet address into request for downstream use
    req.walletAddress = address;
    // Successful auth log
    await AuditLogService.log({
        action: AuditAction.AUTH_SUCCESS,
        actor: address,
        details: { ip: req.ip, userAgent: req.get('user-agent') }
    });
    next();
};
//# sourceMappingURL=authMiddleware.js.map