/**
 * @file authMiddleware.ts
 * @description Middleware for authenticating requests via wallet signatures.
 * Part of the K9 Security module.
 */
import { Request, Response, NextFunction } from 'express';
export declare const authenticateWallet: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map