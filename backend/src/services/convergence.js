export const detectConvergence = (signals) => {
    // When 3+ independent data sources light up around the same protocol/token/ecosystem
    // in a 2-hour window — fire a CONVERGENCE signal.
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const recent = signals.filter(s => new Date(s.timestamp).getTime() > twoHoursAgo);
    // Group by entity (protocol/token name extracted from title)
    const clusters = new Map(); // entity -> Set of sources
    recent.forEach(s => {
        // Very basic entity extraction (can be improved with NLP/AI)
        const words = s.title.split(' ');
        const entity = words.find(w => w.startsWith('$')) || words[0] || 'unknown'; // Simple heuristic
        if (!clusters.has(entity)) {
            clusters.set(entity, new Set());
        }
        clusters.get(entity).add(s.source);
    });
    const convergenceSignals = [];
    for (const [entity, sources] of clusters.entries()) {
        if (sources.size >= 3) {
            // Create a convergence signal
            convergenceSignals.push({
                id: `convergence-${entity}-${Date.now()}`,
                title: `CONVERGENCE DETECTED: ${entity}`,
                summary: `Multi-source activity around ${entity} from ${Array.from(sources).join(', ')}.`,
                category: 'convergence',
                score: 95, // Convergence signals auto-score at 85+ (user requested 85+, I'll use 95 for max impact)
                confidence: 95,
                risk: 'medium',
                analysis: `Three or more independent sources (${Array.from(sources).join(', ')}) have reported on ${entity} in the last 2 hours. This indicates high probability alpha.`,
                tags: ['convergence', entity.toLowerCase()],
                url: '#', // Aggregated URL
                timestamp: new Date().toISOString(),
                source: 'ConvergenceEngine',
                shouldSend: true,
                isConvergence: true,
            });
        }
    }
    return convergenceSignals;
};
//# sourceMappingURL=convergence.js.map