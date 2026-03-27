/**
 * @file validation.ts
 * @description Zod schemas for input validation on all API endpoints.
 * Part of the K9 Security module.
 */
import { z } from 'zod';
export declare const authSchema: z.ZodObject<{
    address: z.ZodString;
    signature: z.ZodString;
    authMessage: z.ZodAny;
}, z.core.$strip>;
export declare const verifyCompanySchema: z.ZodObject<{
    legalName: z.ZodString;
    website: z.ZodString;
    linkedin: z.ZodOptional<z.ZodString>;
    docs: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const verifyTalentSchema: z.ZodObject<{
    username: z.ZodString;
}, z.core.$strip>;
export declare const matchSchema: z.ZodObject<{
    talent: z.ZodAny;
    job: z.ZodAny;
    complexity: z.ZodObject<{
        skillLevelRequired: z.ZodEnum<{
            Intermediate: "Intermediate";
            Junior: "Junior";
            Senior: "Senior";
            Expert: "Expert";
        }>;
        estimatedHours: z.ZodNumber;
        technicalStack: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const scanSchema: z.ZodObject<{
    address: z.ZodUnion<[z.ZodString, z.ZodString]>;
    chain: z.ZodEnum<{
        ethereum: "ethereum";
        solana: "solana";
        base: "base";
        arbitrum: "arbitrum";
        optimism: "optimism";
        polygon: "polygon";
    }>;
}, z.core.$strip>;
export declare const notificationStatusSchema: z.ZodObject<{
    instanceId: z.ZodString;
    token: z.ZodString;
    phoneNumber: z.ZodString;
}, z.core.$strip>;
export declare const listingQuerySchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    minScore: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    risk: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        critical: "critical";
    }>>;
    chain: z.ZodOptional<z.ZodString>;
    limit: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strip>;
//# sourceMappingURL=validation.d.ts.map