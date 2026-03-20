import axios from 'axios';
import type { RawSignal } from '../types/index.js';
import logger from '../utils/logger.js';

export const scrapeGDELT = async (): Promise<RawSignal[]> => {
  try {
    // GDELT V2 API for global news monitoring
    // Example query for mentions of 'crypto' or 'blockchain' with sentiment/tone
    const query = 'crypto blockchain bitcoin ethereum';
    const response = await axios.get(`https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&format=json&maxrecords=5`);
    const articles = response.data.articles || [];

    return articles.map((article: any) => ({
      id: `gdelt-${article.url}`,
      title: `Global News Alert: ${article.title}`,
      summary: `News from ${article.source} with tone: ${article.tone}. Topic: ${article.topic}.`,
      category: 'macro',
      source: 'GDELT',
      url: article.url,
      timestamp: article.seendate || new Date().toISOString(),
      metadata: {
        source: article.source,
        tone: article.tone,
        topic: article.topic,
      },
    }));
  } catch (error) {
    logger.error('Error scraping GDELT:', error);
    return [];
  }
};
