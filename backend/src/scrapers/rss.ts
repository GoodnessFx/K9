import Parser from 'rss-parser';
import type { RawSignal, SignalCategory } from '../types/index.js';
import logger from '../utils/logger.js';

const parser = new Parser();

const RSS_FEEDS = [
  { url: 'https://cointelegraph.com/rss', name: 'CoinTelegraph', category: 'defi' as SignalCategory },
  { url: 'https://decrypt.co/feed', name: 'Decrypt', category: 'defi' as SignalCategory },
  { url: 'https://www.theblock.co/rss.xml', name: 'TheBlock', category: 'defi' as SignalCategory },
  { url: 'https://defiant.io/feed', name: 'TheDefiant', category: 'defi' as SignalCategory },
  { url: 'https://rekt.news/rss/', name: 'Rekt News', category: 'security' as SignalCategory },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', category: 'defi' as SignalCategory },
];

export const scrapeRSS = async (): Promise<RawSignal[]> => {
  const allSignals: RawSignal[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items.slice(0, 5); // Only take latest 5

      items.forEach((item) => {
        allSignals.push({
          id: `rss-${item.guid || item.link}`,
          title: item.title || 'Untitled',
          summary: item.contentSnippet?.slice(0, 200) || 'No summary available.',
          category: feed.category,
          source: feed.name,
          url: item.link || '',
          timestamp: item.isoDate || new Date().toISOString(),
          metadata: {
            author: item.creator || item.author,
            categories: item.categories,
          },
        });
      });
    } catch (error) {
      logger.error(`Error scraping RSS feed ${feed.name}:`, error);
    }
  }

  return allSignals;
};
