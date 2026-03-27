/**
 * @file OpportunityWorker.ts
 * @description Background worker for running scrapers, verification, and notifications in isolation using BullMQ.
 * Part of the K9 Workers module.
 */
import { Worker, Queue } from 'bullmq';
import { SourceSniffer } from '../sniffer/SourceSniffer.js';
import { FilterService } from '../filter/FilterService.js';
import { MatchingService } from '../matching/MatchingService.js';
import { VettingService } from '../verify/VettingService.js';
import { sendWhatsApp } from '../notifications/whatsapp.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
import { Redis } from 'ioredis';
const connection = new Redis(config.UPSTASH_REDIS_REST_URL, {
    maxRetriesPerRequest: null,
});
// Queues for different pipelines
export const snifferQueue = new Queue('sniffer-queue', { connection });
export const verifyQueue = new Queue('verify-queue', { connection });
export const notifyQueue = new Queue('notify-queue', { connection });
export class OpportunityWorker {
    sniffer;
    filter;
    matching;
    vetting;
    snifferWorker;
    verifyWorker;
    notifyWorker;
    constructor() {
        this.sniffer = new SourceSniffer();
        this.filter = new FilterService();
        this.matching = new MatchingService();
        this.vetting = new VettingService();
        // 1. Sniffer Worker (Scraping Pipeline)
        this.snifferWorker = new Worker('sniffer-queue', async (job) => {
            await this.processSniffJob(job.data.url);
        }, { connection });
        // 2. Verification Worker (Trust Pipeline)
        this.verifyWorker = new Worker('verify-queue', async (job) => {
            const { type, data } = job.data;
            if (type === 'company') {
                return await this.vetting.verifyCompany(data);
            }
            else if (type === 'talent') {
                return await this.vetting.verifyTalentGitHub(data.username);
            }
        }, { connection });
        // 3. Notification Worker (Delivery Pipeline)
        this.notifyWorker = new Worker('notify-queue', async (job) => {
            const { channel, recipient, message } = job.data;
            if (channel === 'whatsapp') {
                await sendWhatsApp(recipient, message);
            }
            // Add telegram or other channels here
        }, { connection });
        this.setupListeners();
    }
    setupListeners() {
        [this.snifferWorker, this.verifyWorker, this.notifyWorker].forEach(worker => {
            worker.on('completed', (job) => {
                logger.info(`Job ${job.id} in ${worker.name} completed successfully`);
            });
            worker.on('failed', (job, err) => {
                logger.error(`Job ${job?.id} in ${worker.name} failed: ${err.message}`);
            });
        });
    }
    /**
     * Run a single sniffing and processing job
     */
    async processSniffJob(url) {
        logger.info(`Worker processing URL: ${url}`);
        try {
            // 1. Sniff (Stealth Scraping)
            const listing = await this.sniffer.sniff(url);
            if (!listing)
                return;
            // 2. Filter & Score
            const score = this.filter.scoreListing(listing);
            if (score < 50) {
                logger.info(`Listing from ${url} suppressed due to low score (${score})`);
                return;
            }
            // 3. Match & Store
            // In a real implementation, this would save to the DB and notify relevant users
            logger.info(`Listing from ${url} passed with score ${score}. Ready for matching.`);
        }
        catch (error) {
            logger.error(`Worker failed for URL ${url}:`, error);
            throw error;
        }
    }
    /**
     * Public methods to enqueue jobs
     */
    async enqueueSniff(url) {
        await snifferQueue.add('sniff-job', { url }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 }
        });
    }
    async enqueueVerify(type, data) {
        await verifyQueue.add('verify-job', { type, data }, {
            attempts: 2,
            backoff: { type: 'fixed', delay: 10000 }
        });
    }
    async enqueueNotify(channel, recipient, message) {
        await notifyQueue.add('notify-job', { channel, recipient, message }, {
            attempts: 5,
            backoff: { type: 'exponential', delay: 2000 }
        });
    }
}
//# sourceMappingURL=OpportunityWorker.js.map