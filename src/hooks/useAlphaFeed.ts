import { useState, useEffect, useCallback, useRef } from 'react'; 
import { toast } from 'sonner'; 
import { AlphaSignal } from '../types'; 
 
const COINGECKO = 'https://api.coingecko.com/api/v3'; 
const POLYMARKET = 'https://gamma-api.polymarket.com'; 
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='; 
 
async function safeFetch(url: string): Promise<any> { 
  try { 
    const ctrl = new AbortController(); 
    const id = setTimeout(() => ctrl.abort(), 8000); 
    const res = await fetch(url, { signal: ctrl.signal }); 
    clearTimeout(id); 
    if (!res.ok) return null; 
    return res.json(); 
  } catch { 
    return null; 
  } 
} 
 
async function fetchTrending(): Promise<AlphaSignal[]> { 
  const data = await safeFetch(`${COINGECKO}/search/trending`); 
  if (!data?.coins) return []; 
  return data.coins.slice(0, 4).map(({ item }: any) => ({ 
    id: `cg-${item.id}`, 
    title: `Trending: ${item.name} ($${item.symbol?.toUpperCase()})`, 
    description: `Rank #${item.market_cap_rank ?? '?'} — gaining attention across the market. High search volume indicates building momentum.`, 
    source: 'CoinGecko', 
    category: 'defi' as const, 
    risk: 'medium' as const, 
    confidence: 72, 
    timestamp: new Date(), 
    tags: ['trending', item.symbol?.toLowerCase()], 
    verified: true, 
    upvotes: 0, 
    downvotes: 0, 
    timeframe: 'Trending now', 
    blockchain: 'multiple', 
  })); 
} 
 
async function fetchMovers(): Promise<AlphaSignal[]> { 
  const data = await safeFetch( 
    `${COINGECKO}/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=8&price_change_percentage=24h` 
  ); 
  if (!Array.isArray(data)) return []; 
  return data 
    .filter((c: any) => Math.abs(c.price_change_percentage_24h ?? 0) > 12) 
    .map((c: any) => ({ 
      id: `mover-${c.id}`, 
      title: `${(c.price_change_percentage_24h ?? 0) > 0 ? '📈' : '📉'} ${c.name} ${(c.price_change_percentage_24h ?? 0).toFixed(1)}% today`, 
      description: `Price: $${c.current_price?.toLocaleString()}. Volume: $${((c.total_volume ?? 0) / 1e6).toFixed(0)}M. Market cap: $${((c.market_cap ?? 0) / 1e6).toFixed(0)}M.`, 
      source: 'CoinGecko', 
      category: 'defi' as const, 
      risk: Math.abs(c.price_change_percentage_24h ?? 0) > 30 ? 'high' as const : 'medium' as const, 
      confidence: 75, 
      timestamp: new Date(), 
      tags: ['mover', c.symbol], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      priceTarget: undefined, 
      timeframe: '24h move', 
      blockchain: 'multiple', 
    })); 
} 
 
async function fetchAirdrops(): Promise<AlphaSignal[]> { 
  // Verified, always-relevant airdrop opportunities 
  return [ 
    { 
      id: 'earnifi-checker', 
      title: 'Free: Check all your unclaimed airdrops in 30 seconds', 
      description: 'Earnifi scans your wallet against every known airdrop automatically. Many people have hundreds or thousands of dollars in unclaimed free tokens right now.', 
      source: 'Verified Airdrop', 
      category: 'airdrop' as const, 
      risk: 'low' as const, 
      confidence: 95, 
      timestamp: new Date(), 
      tags: ['free', 'airdrop', 'checker'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Check now — takes 30 seconds', 
      blockchain: 'multiple', 
    }, 
    { 
      id: 'layer3-quests', 
      title: 'Earn crypto completing short tasks — Layer3 quests', 
      description: 'Layer3 pays crypto for completing tasks like following projects, using apps, and answering questions. New quests added daily. No investment required.', 
      source: 'Learn & Earn', 
      category: 'airdrop' as const, 
      risk: 'low' as const, 
      confidence: 90, 
      timestamp: new Date(), 
      tags: ['free', 'earn', 'tasks'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Ongoing', 
      blockchain: 'multiple', 
    }, 
  ]; 
} 
 
async function fetchPolymarket(): Promise<AlphaSignal[]> { 
  const data = await safeFetch( 
    `${POLYMARKET}/markets?active=true&closed=false&order=volume&ascending=false&limit=10` 
  ); 
  if (!Array.isArray(data)) return []; 
  return data 
    .filter((m: any) => parseFloat(m.volume ?? '0') > 10000) 
    .slice(0, 3) 
    .map((m: any) => { 
      const outcomes = m.outcomes ? JSON.parse(m.outcomes) : []; 
      const prices = m.outcomePrices ? JSON.parse(m.outcomePrices) : []; 
      const top = outcomes.map((o: string, i: number) => ({ 
        title: o, 
        prob: Math.round(parseFloat(prices[i] ?? '0') * 100), 
      })).sort((a: any, b: any) => b.prob - a.prob)[0]; 
      return { 
        id: `poly-${m.id}`, 
        title: `Prediction: ${m.question ?? m.title}`, 
        description: top ? `"${top.title}" has ${top.prob}% probability. Volume: $${(parseFloat(m.volume ?? '0') / 1000).toFixed(0)}K.` : 'Active prediction market.', 
        source: 'Polymarket', 
        category: 'defi' as const, 
        risk: 'medium' as const, 
        confidence: 80, 
        timestamp: new Date(), 
        tags: ['prediction', 'polymarket'], 
        verified: true, 
        upvotes: 0, 
        downvotes: 0, 
        timeframe: m.endDate ? `Closes ${new Date(m.endDate).toLocaleDateString()}` : 'Active', 
        blockchain: 'polygon', 
      }; 
    }); 
} 
 
async function fetchJobs(): Promise<AlphaSignal[]> { 
  const data = await safeFetch(`${RSS_PROXY}${encodeURIComponent('https://web3.career/rss')}&count=5`); 
  const items = data?.items ?? []; 
 
  if (items.length === 0) { 
    return [{ 
      id: 'jobs-web3career', 
      title: 'Browse 500+ live remote crypto jobs — web3.career', 
      description: 'Community managers ($3–8K/mo), Discord moderators, content writers, translators. Most remote. Many require no prior crypto experience.', 
      source: 'web3.career', 
      category: 'dev' as const, 
      risk: 'low' as const, 
      confidence: 88, 
      timestamp: new Date(), 
      tags: ['job', 'remote', 'no-experience'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Apply now', 
      blockchain: 'multiple', 
    }]; 
  } 
 
  return items.slice(0, 3).map((item: any) => ({ 
    id: `job-${item.guid ?? item.link}`, 
    title: `Job: ${item.title}`, 
    description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) ?? 'Crypto industry opportunity.', 
    source: 'web3.career', 
    category: 'dev' as const, 
    risk: 'low' as const, 
    confidence: 85, 
    timestamp: new Date(item.pubDate ?? Date.now()), 
    tags: ['job', 'remote'], 
    verified: true, 
    upvotes: 0, 
    downvotes: 0, 
    timeframe: 'Apply before it closes', 
    blockchain: 'multiple', 
  })); 
} 
 
export function useAlphaFeed() { 
  const [signals, setSignals] = useState<AlphaSignal[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [filters, setFilters] = useState({ category: 'all', risk: 'all', minConfidence: 0 }); 
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); 
  const prevIds = useRef<Set<string>>(new Set()); 
 
  const loadSignals = useCallback(async () => { 
    try { 
      const results = await Promise.allSettled([ 
        fetchTrending(), 
        fetchMovers(), 
        fetchAirdrops(), 
        fetchPolymarket(), 
        fetchJobs(), 
      ]); 
 
      const all: AlphaSignal[] = []; 
      results.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value); }); 
 
      // Deduplicate by id 
      const seen = new Set<string>(); 
      const unique = all.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; }); 
 
      // Sort by confidence desc 
      unique.sort((a, b) => b.confidence - a.confidence); 
 
      // Toast for new signals 
      const newOnes = unique.filter(s => !prevIds.current.has(s.id)); 
      newOnes.forEach(s => prevIds.current.add(s.id)); 
      if (newOnes.length > 0 && !loading) { 
        toast.success(`${newOnes.length} new signal${newOnes.length > 1 ? 's' : ''} found`, { 
          description: newOnes[0].title, 
          duration: 4000, 
        }); 
      } 
 
      setSignals(unique.slice(0, 40)); 
      setLastUpdated(new Date()); 
      setError(null); 
    } catch { 
      setError('Failed to load signals. Check your connection.'); 
    } finally { 
      setLoading(false); 
    } 
  }, [loading]); 
 
  useEffect(() => { loadSignals(); }, [loadSignals]); 
 
  useEffect(() => { 
    const interval = setInterval(loadSignals, 90_000); 
    return () => clearInterval(interval); 
  }, [loadSignals]); 
 
  const filteredSignals = signals.filter(s => { 
    if (filters.category !== 'all' && s.category !== filters.category) return false; 
    if (filters.risk !== 'all' && s.risk !== filters.risk) return false; 
    if (s.confidence < filters.minConfidence) return false; 
    return true; 
  }); 
 
  const refreshFeed = () => { 
    setLoading(true); 
    loadSignals(); 
  }; 
 
  const upvoteSignal = (id: string) => setSignals(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)); 
  const downvoteSignal = (id: string) => setSignals(prev => prev.map(s => s.id === id ? { ...s, downvotes: s.downvotes + 1 } : s)); 
 
  return { signals: filteredSignals, loading, error, lastUpdated, filters, setFilters, refreshFeed, upvoteSignal, downvoteSignal }; 
} 
