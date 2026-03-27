/**
 * @file validation.ts
 * @description Zod schemas for input validation on all API endpoints.
 * Part of the K9 Security module.
 */

import { z } from 'zod';

// --- AUTH SCHEMAS ---
export const authSchema = z.object({
  address: z.string().startsWith('0x'),
  signature: z.string().length(132),
  authMessage: z.any(), // Structured EIP-712 data
});

// --- VERIFY SCHEMAS ---
export const verifyCompanySchema = z.object({
  legalName: z.string().min(2).max(100),
  website: z.string().url(),
  linkedin: z.string().url().optional(),
  docs: z.array(z.string()).optional(), // Base64 or URL
});

export const verifyTalentSchema = z.object({
  username: z.string().min(1).max(39), // GitHub max username length
});

// --- MATCH SCHEMAS ---
export const matchSchema = z.object({
  talent: z.any(), // Replace with specific talent shape
  job: z.any(),    // Replace with specific job shape
  complexity: z.object({
    skillLevelRequired: z.enum(['Junior', 'Intermediate', 'Senior', 'Expert']),
    estimatedHours: z.number(),
    technicalStack: z.array(z.string()),
  }),
});

// --- SCAN SCHEMAS ---
export const scanSchema = z.object({
  address: z.string().startsWith('0x').or(z.string().length(44)), // ETH or SOL
  chain: z.enum(['ethereum', 'solana', 'base', 'arbitrum', 'optimism', 'polygon']),
});

// --- NOTIFICATION SCHEMAS ---
export const notificationStatusSchema = z.object({
  instanceId: z.string(),
  token: z.string(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/), // E.164
});

// --- LISTING SCHEMAS ---
export const listingQuerySchema = z.object({
  category: z.string().optional(),
  minScore: z.string().regex(/^\d+$/).transform(Number).optional(),
  risk: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  chain: z.string().optional(),
  limit: z.preprocess((val) => val ?? '20', z.string().regex(/^\d+$/).transform(Number)),
});
