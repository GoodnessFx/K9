/**
 * @file FilterService.ts
 * @description Logic for filtering and scoring scraped job listings.
 * Part of the K9 Filter module.
 */
import { NormalizedListing } from '../sniffer/SourceSniffer.js';
export declare class FilterService {
    /**
     * Main Scoring Pipeline for a listing
     */
    scoreListing(listing: NormalizedListing): number;
    private detectGhostJob;
    private isVerifiedCompany;
}
//# sourceMappingURL=FilterService.d.ts.map