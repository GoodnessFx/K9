/**
 * @file SourceSniffer.ts
 * @description Universal job parser using LLM-vision and CSS fallback.
 * Part of the K9 Stealth Sniffer module.
 */
export interface NormalizedListing {
    role: string;
    company: string;
    location: string;
    type: string;
    pay_range: string;
    source: string;
    scraped_at: string;
    raw_url: string;
    vision_parsed: boolean;
    contact_info?: string;
    apply_url?: string;
}
export declare class SourceSniffer {
    private browser;
    private anthropic;
    constructor();
    /**
     * Main entry point to sniff a URL
     */
    sniff(url: string): Promise<NormalizedListing | null>;
    private initBrowser;
    private applyStealthBehaviors;
    private isHighVolumeSource;
    private parseWithCSS;
    private parseWithVision;
}
//# sourceMappingURL=SourceSniffer.d.ts.map