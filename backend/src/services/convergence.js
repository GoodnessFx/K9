export const detectConvergence = (signals) => {
    // When 3+ independent data sources light up around the same protocol/token/ecosystem
    // in a 2-hour window — fire a CONVERGENCE signal.
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const recent = signals.filter(s => new Date(s.timestamp).getTime() > twoHoursAgo);
    // Group by entity (protocol/token name extracted from title)
    const clusters = new Map(); // entity -> Set of sources
    recent.forEach(s => {
        // Basic entity extraction (e.g. token symbols, protocol names)
        const entity = s.tokenSymbol || s.title.split(' ')[0] || 'unknown';
        if (!clusters.has(entity)) {
            clusters.set(entity, new Set());
        }
        clusters.get(entity).add(s.source);
    });
    const convergenceSignals = [];
    for (const [entity, sources] of clusters.entries()) {
        if (sources.size >= 2) {
            const isHighConviction = sources.size >= 3;
            convergenceSignals.push({
                id: `convergence-${entity}-${Date.now()}`,
                title: `${isHighConviction ? 'HIGH CONVICTION' : 'CONVERGED'}: ${entity}`,
                summary: `${sources.size} independent sources agreed on ${entity}. Sources: ${Array.from(sources).join(', ')}.`,
                category: 'convergence',
                score: isHighConviction ? 98 : 85,
                confidence: isHighConviction ? 95 : 80,
                risk: 'medium',
                analysis: `${sources.size} independent sources reported on ${entity} within a 2-hour window. This kills noise and confirms high signal.`,
                tags: ['convergence', entity.toLowerCase()],
                url: '#',
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