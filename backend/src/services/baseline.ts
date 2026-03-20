import type { Signal } from '../types/index.js';
import { store } from '../utils/store.js';

export const detectAnomalies = async (signals: Signal[]): Promise<Signal[]> => {
  // Build rolling baselines per signal type:
  // - How many new DexScreener pairs on an average Tuesday?
  // - How many GitHub crypto repos trending on an average morning?
  // - How many RSS articles about exploits per day?

  // Use Z-scores. Fire anomaly alerts when current activity is >2 standard deviations from baseline.
  // Learning mode: first 7 days = data collection only, no anomaly alerts.
  // After 7 days: full anomaly detection active.

  // Mock anomaly detection logic
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hourBucket = now.getHours();
  
  const baselineKey = `baseline:${dayOfWeek}:${hourBucket}`;
  const baseline = await store.get<number>(baselineKey) || 10; // Default baseline 10 signals/hour

  const currentCount = signals.filter(s => new Date(s.timestamp).getHours() === hourBucket).length;

  const anomalies: Signal[] = [];

  if (currentCount > baseline * 2) { // Simple "2x baseline" trigger for now
    anomalies.push({
      id: `anomaly-temporal-${Date.now()}`,
      title: `TEMPORAL ANOMALY DETECTED: Spike in Signal Volume`,
      summary: `Current signal volume is ${currentCount} which is >2x the baseline of ${baseline} for this hour.`,
      category: 'anomaly',
      score: 78,
      confidence: 85,
      risk: 'medium',
      analysis: `A significant spike in signal activity was detected across multiple sources compared to the historical baseline for this time of day.`,
      tags: ['temporal-anomaly', 'volume-spike'],
      url: '#',
      timestamp: now.toISOString(),
      source: 'TemporalBaselineEngine',
      shouldSend: true,
    });
  }

  // Update baseline (moving average)
  await store.set(baselineKey, (baseline * 0.9) + (currentCount * 0.1));

  return anomalies;
};
