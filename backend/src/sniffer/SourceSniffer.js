/**
 * @file SourceSniffer.ts
 * @description Universal job parser using LLM-vision and CSS fallback.
 * Part of the K9 Stealth Sniffer module.
 */
import pkg from 'playwright-extra';
const { chromium } = pkg;
import stealthPlugin from 'playwright-stealth';
import Anthropic from '@anthropic-ai/sdk';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
// Apply stealth plugin
const playwright = chromium;
playwright.use(stealthPlugin());
export class SourceSniffer {
    browser = null;
    anthropic;
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: config.ANTHROPIC_API_KEY,
        });
    }
    /**
     * Main entry point to sniff a URL
     */
    async sniff(url) {
        try {
            await this.initBrowser();
            const page = await this.browser.newPage();
            // Apply stealth behaviors
            await this.applyStealthBehaviors(page);
            logger.info(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            // Check if it's a known high-volume source for CSS fallback
            const domain = new URL(url).hostname;
            if (this.isHighVolumeSource(domain)) {
                const listing = await this.parseWithCSS(page, domain, url);
                if (listing)
                    return listing;
            }
            // Fallback to LLM-vision
            return await this.parseWithVision(page, url);
        }
        catch (error) {
            logger.error(`Sniffer failed for ${url}:`, error);
            return null;
        }
        finally {
            if (this.browser)
                await this.browser.close();
            this.browser = null;
        }
    }
    async initBrowser() {
        if (!this.browser) {
            const proxy = config.PROXY_ENDPOINT ? {
                server: config.PROXY_ENDPOINT,
                username: config.PROXY_USERNAME,
                password: config.PROXY_PASSWORD,
            } : undefined;
            this.browser = await playwright.launch({
                headless: true,
                proxy,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled',
                ],
            });
        }
    }
    async applyStealthBehaviors(page) {
        // Randomized Viewport
        const viewports = [
            { width: 1920, height: 1080 },
            { width: 1440, height: 900 },
            { width: 1366, height: 768 },
        ];
        const vp = viewports[Math.floor(Math.random() * viewports.length)];
        await page.setViewportSize(vp);
        // Human-like typing delay function
        const typeLikeHuman = async (page, selector, text) => {
            await page.focus(selector);
            for (const char of text) {
                await page.type(selector, char, { delay: Math.floor(Math.random() * 150) + 50 });
            }
        };
        // Human-like mouse movements
        const moveMouseHumanly = async (page) => {
            const { width, height } = page.viewportSize() || { width: 1280, height: 720 };
            for (let i = 0; i < 5; i++) {
                await page.mouse.move(Math.floor(Math.random() * width), Math.floor(Math.random() * height), { steps: Math.floor(Math.random() * 10) + 5 });
            }
        };
        await moveMouseHumanly(page);
        // Human-like scroll
        await page.evaluate(async () => {
            const delay = (ms) => new Promise(res => setTimeout(res, ms));
            const totalHeight = document.body.scrollHeight;
            let currentPosition = 0;
            while (currentPosition < totalHeight) {
                const scrollAmount = Math.floor(Math.random() * 500) + 200;
                window.scrollBy(0, scrollAmount);
                currentPosition += scrollAmount;
                await delay(Math.floor(Math.random() * 1000) + 500);
            }
        });
        // Randomize headers and TLS fingerprint evasion via playwright-extra-plugin-stealth
        // This is handled by playwright.use(stealthPlugin()) but we can add more
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        });
    }
    isHighVolumeSource(domain) {
        const highVolume = ['linkedin.com', 'indeed.com', 'remoteok.com', 'weworkremotely.com'];
        return highVolume.some(d => domain.includes(d));
    }
    async parseWithCSS(page, domain, url) {
        // Logic for specific high-volume sites goes here
        // Example for RemoteOK (hypothetical)
        if (domain.includes('remoteok.com')) {
            // Implementation...
        }
        return null; // Fallback to vision if CSS parsing not implemented or fails
    }
    async parseWithVision(page, url) {
        logger.info(`Attempting LLM-vision parse for ${url}`);
        const screenshot = await page.screenshot({ fullPage: true });
        const base64Screenshot = screenshot.toString('base64');
        const prompt = `
      Extract job details from this screenshot of a job posting.
      Respond ONLY with a JSON object in this format:
      {
        "role": "Job Title",
        "company": "Company Name",
        "location": "Location or Remote",
        "type": "Full-time/Part-time/Contract",
        "pay_range": "Salary or Hourly Rate",
        "contact_info": "Email or Link",
        "apply_url": "Direct Apply URL"
      }
      If any field is missing, use "N/A".
    `;
        try {
            const response = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: "image/png",
                                    data: base64Screenshot,
                                },
                            },
                            {
                                type: "text",
                                text: prompt,
                            },
                        ],
                    },
                ],
            });
            const content = response.content[0];
            if (content.type === 'text') {
                const parsed = JSON.parse(content.text);
                return {
                    ...parsed,
                    source: new URL(url).hostname,
                    scraped_at: new Date().toISOString(),
                    raw_url: url,
                    vision_parsed: true,
                };
            }
        }
        catch (e) {
            logger.error('Vision parsing failed:', e);
        }
        return null;
    }
}
//# sourceMappingURL=SourceSniffer.js.map