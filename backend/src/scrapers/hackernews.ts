import axios from 'axios';
import type { RawSignal } from '../types/index.js';
import logger from '../utils/logger.js';

export const scrapeHackerNews = async (): Promise<RawSignal[]> => {
  try {
    // HN Algolia API for 'crypto' search in top stories
    const response = await axios.get('https://hn.algolia.com/api/v1/search?query=crypto+blockchain+web3&tags=story&hitsPerPage=5&numericFilters=created_at_i>1740000000');
    const hits = response.data.hits || [];

    return hits.map((hit: any) => ({
      id: `hn-${hit.objectID}`,
      title: `HackerNews: ${hit.title}`,
      summary: `${hit.points} points and ${hit.num_comments} comments. Posted by ${hit.author}.`,
      category: 'developer',
      source: 'HackerNews',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      timestamp: hit.created_at || new Date().toISOString(),
      metadata: {
        points: hit.points,
        comments: hit.num_comments,
        author: hit.author,
      },
    }));
  } catch (error) {
    logger.error('Error scraping HackerNews:', error);
    return [];
  }
};
