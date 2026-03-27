/**
 * @file OpportunityWorker.ts
 * @description Background worker for running scrapers, verification, and notifications in isolation using BullMQ.
 * Part of the K9 Workers module.
 */
import { Queue } from 'bullmq';
export declare const snifferQueue: Queue<any, any, string, any, any, string>;
export declare const verifyQueue: Queue<any, any, string, any, any, string>;
export declare const notifyQueue: Queue<any, any, string, any, any, string>;
export declare class OpportunityWorker {
    private sniffer;
    private filter;
    private matching;
    private vetting;
    private snifferWorker;
    private verifyWorker;
    private notifyWorker;
    constructor();
    private setupListeners;
    /**
     * Run a single sniffing and processing job
     */
    processSniffJob(url: string): Promise<void>;
    /**
     * Public methods to enqueue jobs
     */
    enqueueSniff(url: string): Promise<void>;
    enqueueVerify(type: 'company' | 'talent', data: any): Promise<void>;
    enqueueNotify(channel: 'whatsapp' | 'telegram', recipient: string, message: string): Promise<void>;
}
//# sourceMappingURL=OpportunityWorker.d.ts.map