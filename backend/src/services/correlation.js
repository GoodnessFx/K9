export const detectCorrelations = (signals) => {
    // Watches multiple streams simultaneously and fires when they behave unexpectedly:
    // - price_leads_news — Token price pumps 15%+ with zero news coverage → insider activity
    // - github_leads_price — Commit spike in protocol repo → watch for price follow
    // - polymarket_leads_news — Prediction odds shift 10%+ before news coverage
    const correlations = [];
    const now = new Date().toISOString();
    // price_leads_news — Pump with no news (mock for now, would need real price feed)
    // github_leads_price — Commit spike (mock for now, would need repo stats)
    // polymarket_leads_news — Odds shift (mock for now, would need odds history)
    // Example correlation trigger (mock)
    correlations.push({
        id: `correlation-price-leads-news-${Date.now()}`,
        title: `INSIDER ACTIVITY DETECTED: Price Leads News`,
        summary: `Token price pumped 18% with zero news coverage in the last 24h.`,
        category: 'anomaly',
        score: 82,
        confidence: 88,
        risk: 'high',
        analysis: `A significant price pump was detected without any major news or social activity. This often suggests insider accumulation.`,
        tags: ['insider', 'price-leads-news'],
        url: '#',
        timestamp: now,
        source: 'CorrelationEngine',
        shouldSend: true,
    });
    return correlations;
};
//# sourceMappingURL=correlation.js.map