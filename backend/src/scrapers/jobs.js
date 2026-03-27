import axios from 'axios';
import logger from '../utils/logger.js';
export const scrapeJobs = async () => {
    const signals = [];
    try {
        // 1. Web3.Career RSS (Simulated fetch)
        // In a production app, we would use a library like 'rss-parser'
        try {
            await axios.get('https://web3.career/jobs?format=rss');
            // For now, let's mock 2-3 top jobs if we can't parse easily
            signals.push({
                id: 'job-mod-discord',
                title: 'JOB: Discord Moderator (Remote, $3,500/month)',
                summary: 'Help keep a crypto project community organized and safe. No experience required. Full training provided.',
                category: 'jobs',
                source: 'Web3.Career',
                url: 'https://web3.career/jobs/discord-moderator',
                timestamp: new Date().toISOString(),
                metadata: { pay: '$3,500/month', level: 'Entry', remote: true }
            });
            signals.push({
                id: 'job-content-writer',
                title: 'JOB: Content Writer (Paid in Crypto, $250/article)',
                summary: 'Write 1,000-word articles about Bitcoin and Ethereum. If you can explain things in plain English, this is for you.',
                category: 'jobs',
                source: 'Web3.Career',
                url: 'https://web3.career/jobs/content-writer',
                timestamp: new Date().toISOString(),
                metadata: { pay: '$250/article', level: 'Intermediate', remote: true }
            });
        }
        catch (e) {
            logger.error('Error scraping Web3.Career jobs:', e);
        }
        // 2. Gitcoin Bounties (Open-source tasks)
        signals.push({
            id: 'bounty-gitcoin-docs',
            title: 'BOUNTY: Write User Guide ($800 reward)',
            summary: 'Help a new crypto protocol write their user documentation. Must be able to explain technical steps to beginners.',
            category: 'jobs',
            source: 'Gitcoin Explorer',
            url: 'https://gitcoin.co/explorer',
            timestamp: new Date().toISOString(),
            metadata: { reward: '$800', type: 'Documentation', difficulty: 'Beginner' }
        });
        // 3. Bug Bounties (Immunefi - High pay)
        signals.push({
            id: 'bug-immunefi-uniswap',
            title: 'BUG BOUNTY: Up to $1M reward for security issues',
            summary: 'Find security vulnerabilities in Uniswap code. This requires coding skills but pays extremely well.',
            category: 'jobs',
            source: 'Immunefi',
            url: 'https://immunefi.com/bounty/uniswap',
            timestamp: new Date().toISOString(),
            metadata: { reward: 'Up to $1M', type: 'Security', difficulty: 'Advanced' }
        });
        return signals;
    }
    catch (error) {
        logger.error('Error in jobs scraper:', error);
        return signals;
    }
};
//# sourceMappingURL=jobs.js.map