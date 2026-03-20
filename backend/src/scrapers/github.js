import axios from 'axios';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';
export const scrapeGitHub = async () => {
    try {
        const headers = config.GITHUB_TOKEN ? { Authorization: `token ${config.GITHUB_TOKEN}` } : {};
        // Search for trending Web3/Solidity repos created recently or with high star growth
        const response = await axios.get('https://api.github.com/search/repositories?q=topic:web3+topic:solidity+pushed:>2026-03-01&sort=stars&order=desc', { headers });
        const repos = response.data.items || [];
        return repos.slice(0, 10).map((repo) => ({
            id: `github-${repo.id}`,
            title: `Trending Repo: ${repo.full_name}`,
            summary: `Repo ${repo.name} with ${repo.stargazers_count} stars and ${repo.forks_count} forks. Description: ${repo.description || 'No description available.'}`,
            category: 'developer',
            source: 'GitHub',
            url: repo.html_url,
            timestamp: new Date().toISOString(),
            metadata: {
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                owner: repo.owner.login,
            },
        }));
    }
    catch (error) {
        logger.error('Error scraping GitHub:', error);
        return [];
    }
};
//# sourceMappingURL=github.js.map