export const calculateVelocity = (signals) => {
    // Measures how fast a story is spreading across sources.
    // Calculate sourcesPerHour for any signal cluster.
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentSignals = signals.filter(s => new Date(s.timestamp).getTime() > oneHourAgo);
    // Group by title similarity (simple clustering)
    const clusters = new Map();
    recentSignals.forEach(s => {
        const key = s.title.toLowerCase().split(' ').slice(0, 3).join(' '); // Simple cluster key
        clusters.set(key, (clusters.get(key) || 0) + 1);
    });
    const maxSourcesPerHour = Math.max(...Array.from(clusters.values()), 0);
    // normal = <3 sources/hour
    // elevated = 3–5 sources/hour
    // spike = 6+ sources/hour
    if (maxSourcesPerHour >= 6)
        return 1.3;
    if (maxSourcesPerHour >= 3)
        return 1.15;
    return 1.0;
};
//# sourceMappingURL=velocity.js.map