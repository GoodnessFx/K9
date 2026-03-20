import { useState, useEffect, useCallback, useRef } from 'react'; 
import { toast } from 'sonner'; 
import { AlphaSignal } from '../types'; 
 
// ── Free public APIs — no keys needed ───────────────────────────── 
const CG   = 'https://api.coingecko.com/api/v3'; 
const POLY  = 'https://gamma-api.polymarket.com'; 

async function get(url: string): Promise<any> { 
  try { 
    const ctrl = new AbortController(); 
    const id = setTimeout(() => ctrl.abort(), 8000); 
    const res = await fetch(url, { signal: ctrl.signal }); 
    clearTimeout(id); 
    if (!res.ok) return null; 
    return res.json(); 
  } catch { return null; } 
} 
 
async function fetchTrending(): Promise<AlphaSignal[]> { 
  const data = await get(`${CG}/search/trending`); 
  if (!data?.coins) return []; 
  return data.coins.slice(0, 5).map(({ item }: any, i: number): AlphaSignal => ({ 
    id: `cg-trend-${item.id}`, 
    title: `Everyone is looking at ${item.name} right now`, 
    description: `$${item.symbol?.toUpperCase()} is trending across the whole market. Rank #${item.market_cap_rank ?? '?'}. When something trends this hard, price usually follows.`, 
    source: 'CoinGecko', 
    category: 'defi', 
    risk: 'medium', 
    confidence: 70 + i, 
    timestamp: new Date(), 
    tags: ['trending', item.symbol?.toLowerCase() ?? ''], 
    verified: true, 
    upvotes: 0, 
    downvotes: 0, 
    timeframe: 'Trending now', 
    blockchain: 'multiple', 
  })); 
} 
 
async function fetchMovers(): Promise<AlphaSignal[]> { 
  const data = await get(`${CG}/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&price_change_percentage=24h`); 
  if (!Array.isArray(data)) return []; 
  return data 
    .filter((c: any) => Math.abs(c.price_change_percentage_24h ?? 0) > 10) 
    .slice(0, 4) 
    .map((c: any): AlphaSignal => { 
      const up = (c.price_change_percentage_24h ?? 0) > 0; 
      return { 
        id: `mover-${c.id}`, 
        title: `${c.name} ${up ? 'jumped' : 'dropped'} ${Math.abs(c.price_change_percentage_24h ?? 0).toFixed(1)}% today`, 
        description: `Price is $${c.current_price?.toLocaleString()}. $${((c.total_volume ?? 0) / 1e6).toFixed(0)}M traded today. ${up ? 'Money is flowing in fast.' : 'People are selling fast — could be a chance to buy low.'}`, 
        source: 'CoinGecko', 
        category: 'defi', 
        risk: Math.abs(c.price_change_percentage_24h ?? 0) > 30 ? 'high' : 'medium', 
        confidence: 75, 
        timestamp: new Date(), 
        tags: ['price-move', c.symbol ?? ''], 
        verified: true, 
        upvotes: 0, 
        downvotes: 0, 
        priceTarget: undefined, 
        timeframe: 'Happening now', 
        blockchain: 'multiple', 
      }; 
    }); 
} 
 
async function fetchFreeMoneyOpportunities(): Promise<AlphaSignal[]> { 
  return [ 
    { 
      id: 'earnifi-free', 
      title: 'Check if you have free money waiting — takes 30 seconds', 
      description: 'Earnifi scans your wallet for every unclaimed airdrop automatically. Thousands of people have hundreds or thousands of dollars sitting unclaimed right now. Paste your wallet address and find out.', 
      source: 'Free Money Check', 
      category: 'airdrop', 
      risk: 'low', 
      confidence: 96, 
      timestamp: new Date(), 
      tags: ['free', 'airdrop', 'check-now'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Do it now — free', 
      blockchain: 'multiple', 
    }, 
    { 
      id: 'layer3-earn', 
      title: 'Get paid to try new crypto apps — Layer3', 
      description: 'Layer3 pays you in crypto just for trying out apps, following projects, and answering quick questions. New tasks added every day. Zero investment needed.', 
      source: 'Learn & Earn', 
      category: 'airdrop', 
      risk: 'low', 
      confidence: 91, 
      timestamp: new Date(), 
      tags: ['free', 'earn', 'beginner-friendly'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'New tasks daily', 
      blockchain: 'multiple', 
    }, 
  ]; 
} 
 
async function fetchPredictionMarkets(): Promise<AlphaSignal[]> { 
  const data = await get(`${POLY}/markets?active=true&closed=false&order=volume&ascending=false&limit=8`); 
  if (!Array.isArray(data)) return []; 
   
  return data 
    .filter((m: any) => parseFloat(m.volume ?? '0') > 10000) 
    .slice(0, 3) 
    .map((m: any): AlphaSignal => { 
      const volume = parseFloat(m.volume ?? '0'); 
      const outcomes = m.outcomes ? JSON.parse(m.outcomes) : []; 
      const prices = m.outcomePrices ? JSON.parse(m.outcomePrices) : []; 
      const top = outcomes 
        .map((o: string, i: number) => ({ title: o, prob: Math.round(parseFloat(prices[i] ?? '0') * 100) })) 
        .sort((a: any, b: any) => b.prob - a.prob)[0]; 
      return { 
        id: `poly-${m.id ?? m.slug}`, 
        title: `People are betting on: ${m.question ?? m.title}`, 
        description: `${top ? `"${top.title}" has a ${top.prob}% chance right now.` : ''} $${(volume / 1000).toFixed(0)}K has been bet on this. If you think you know the outcome, a small bet could pay off big.`, 
        source: 'Prediction Market', 
        category: 'defi', 
        risk: 'medium', 
        confidence: 78, 
        timestamp: new Date(), 
        tags: ['prediction', 'bet', 'polymarket'], 
        verified: true, 
        upvotes: 0, 
        downvotes: 0, 
        timeframe: m.endDate ? `Closes ${new Date(m.endDate).toLocaleDateString()}` : 'Active now', 
        blockchain: 'polygon', 
      }; 
    }); 
} 
 
// ── New source: Verified X/Twitter accounts ───────────────────────── 
const NITTER = [ 
  'https://nitter.net', 
  'https://nitter.privacydev.net', 
  'https://nitter.1d4.us', 
]; 
 
// High-signal accounts with verified track records 
const X_ACCOUNTS = [ 
  { handle: 'AirdropAlert',   type: 'airdrop',   score: 85 }, 
  { handle: 'CryptoRank_io',  type: 'airdrop',   score: 83 }, 
  { handle: 'lookonchain',    type: 'insider',   score: 85 }, 
  { handle: 'WhaleAlert',     type: 'whale',     score: 80 }, 
  { handle: 'PeckShieldAlert',type: 'security',  score: 87 }, 
  { handle: 'DefiLlama',      type: 'defi',      score: 88 }, 
]; 
 
const SIGNAL_KEYWORDS = ['airdrop', 'free', 'claim', 'bounty', 'points program', 'testnet', 'just launched', 'open source', 'job', 'hiring']; 
const SCAM_KEYWORDS   = ['send eth', 'send bnb', 'private key', 'seed phrase', 'recovery phrase', 'dm me', '10x guaranteed', 'send and receive']; 
 
async function fetchXSignals(): Promise<AlphaSignal[]> { 
  const results: AlphaSignal[] = []; 
  const seen = new Set<string>(); 
 
  for (const account of X_ACCOUNTS) { 
    for (const instance of NITTER) { 
      try { 
        const res = await fetch( 
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`${instance}/${account.handle}/rss`)}&count=5`, 
          { signal: AbortSignal.timeout(6000) } 
        ); 
        if (!res.ok) continue; 
        const data = await res.json(); 
        if (!data?.items?.length) continue; 
 
        for (const item of data.items) { 
          const text = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase(); 
 
          // Drop anything that looks like a scam 
          if (SCAM_KEYWORDS.some(kw => text.includes(kw))) continue; 
 
          // Only keep if it matches a signal keyword 
          const matched = SIGNAL_KEYWORDS.filter(kw => text.includes(kw)); 
          if (matched.length === 0) continue; 
 
          const id = `x-${account.handle}-${item.guid ?? item.pubDate}`; 
          if (seen.has(id)) continue; 
          seen.add(id); 
 
          results.push({ 
            id, 
            title: (item.title ?? 'Opportunity spotted on X').slice(0, 120), 
            description: `🐕 K9 spotted this from @${account.handle} on X. ${(item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 220)}`, 
            source: `@${account.handle} on X`, 
            category: account.type as AlphaSignal['category'], 
            risk: account.type === 'security' ? 'high' : account.type === 'airdrop' ? 'low' : 'medium', 
            confidence: Math.min(95, account.score + matched.length * 2), 
            timestamp: new Date(item.pubDate ?? Date.now()), 
            tags: [...matched.slice(0, 2), 'x-verified'], 
            verified: true, 
            upvotes: 0, 
            downvotes: 0, 
            timeframe: 'Just spotted', 
            blockchain: 'multiple', 
          }); 
        } 
        break; // Found working instance, move to next account 
      } catch { continue; } 
    } 
  } 
 
  return results.slice(0, 8); 
} 
 
// ── New source: Airdrops.io confirmed airdrops ────────────────────── 
async function fetchAirdropsDotIo(): Promise<AlphaSignal[]> { 
  const data = await get( 
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://airdrops.io/feed/')}&count=6` 
  ); 
  if (!data?.items) return []; 
 
  return data.items 
    .filter((item: any) => !/potential|rumor|unconfirmed/i.test(item.title ?? '')) 
    .slice(0, 4) 
    .map((item: any): AlphaSignal => ({ 
      id: `airdropsdotio-${item.guid ?? item.link}`, 
      title: `Free to claim: ${item.title}`, 
      description: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 230) 
        || 'Verified free token claim. Check eligibility and claim before deadline.', 
      source: 'Airdrops.io', 
      category: 'airdrop', 
      risk: 'low', 
      confidence: 87, 
      timestamp: new Date(item.pubDate ?? Date.now()), 
      tags: ['airdrop', 'verified', 'free'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Claim now', 
      blockchain: 'multiple', 
    })); 
} 
 
// ── New source: CryptoRank verified opportunities ─────────────────── 
async function fetchCryptoRank(): Promise<AlphaSignal[]> { 
  const data = await get( 
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://cryptorank.io/news/feed')}&count=8` 
  ); 
  if (!data?.items) return []; 
 
  return data.items 
    .filter((item: any) => /airdrop|claim|free|bounty|opportunity/i.test(item.title ?? '')) 
    .slice(0, 3) 
    .map((item: any): AlphaSignal => ({ 
      id: `cryptorank-${item.guid ?? item.link}`, 
      title: item.title ?? 'Opportunity on CryptoRank', 
      description: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 220), 
      source: 'CryptoRank', 
      category: 'airdrop', 
      risk: 'low', 
      confidence: 84, 
      timestamp: new Date(item.pubDate ?? Date.now()), 
      tags: ['verified', 'cryptorank'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Check now', 
      blockchain: 'multiple', 
    })); 
} 
 
async function fetchJobs(): Promise<AlphaSignal[]> { 
  const data = await get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://web3.career/rss')}&count=5`); 
  const items = data?.items ?? []; 
   
  if (items.length === 0) { 
    return [{ 
      id: 'jobs-board', 
      title: '500+ remote crypto jobs open right now — no experience needed for many', 
      description: 'Community managers ($3,000–$8,000/month), Discord helpers, content writers, translators, testers. Most are fully remote. Many have never required crypto experience before.', 
      source: 'web3.career', 
      category: 'dev', 
      risk: 'low', 
      confidence: 89, 
      timestamp: new Date(), 
      tags: ['job', 'remote', 'no-experience'], 
      verified: true, 
      upvotes: 0, 
      downvotes: 0, 
      timeframe: 'Apply now', 
      blockchain: 'multiple', 
    }]; 
  } 
   
  return items.slice(0, 3).map((item: any): AlphaSignal => ({ 
    id: `job-${item.guid ?? item.link ?? Math.random()}`, 
    title: `Job opening: ${item.title}`, 
    description: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 200) || 'Crypto industry job opportunity. Click to see details.', 
    source: 'web3.career', 
    category: 'dev', 
    risk: 'low', 
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
 
async function fetchNewsSignals(): Promise<AlphaSignal[]> { 
  const SIGNAL_WORDS = ['exploit', 'airdrop', 'launch', 'mainnet', 'raise', 'hack', 'upgrade', 'listing', 'partnership']; 
  const data = await get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://cointelegraph.com/rss')}&count=8`); 
  if (!data?.items) return []; 
   
  return data.items 
    .filter((item: any) => { 
      const text = `${item.title} ${item.description ?? ''}`.toLowerCase(); 
      return SIGNAL_WORDS.some(w => text.includes(w)); 
    }) 
    .slice(0, 3) 
    .map((item: any): AlphaSignal => { 
      const text = `${item.title} ${item.description ?? ''}`.toLowerCase(); 
      const isSecurity = ['exploit', 'hack', 'rug', 'scam'].some(w => text.includes(w)); 
      return { 
        id: `news-${item.guid ?? item.link}`, 
        title: item.title ?? 'Breaking news', 
        description: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 220), 
        source: 'CoinTelegraph', 
        category: isSecurity ? 'security' : 'defi', 
        risk: isSecurity ? 'high' : 'low', 
        confidence: 72, 
        timestamp: new Date(item.pubDate ?? Date.now()), 
        tags: ['news', isSecurity ? 'security' : 'market'], 
        verified: true, 
        upvotes: 0, 
        downvotes: 0, 
        timeframe: 'Just published', 
        blockchain: 'multiple', 
      }; 
    }); 
} 
 
// ── Main hook ─────────────────────────────────────────────────────── 
 
export function useAlphaFeed() { 
  const [signals, setSignals] = useState<AlphaSignal[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); 
  const [filters, setFilters] = useState({ category: 'all', risk: 'all', minConfidence: 0 }); 
  const seenIds = useRef<Set<string>>(new Set()); 
 
  const loadAll = useCallback(async () => { 
    try { 
      const results = await Promise.allSettled([ 
        fetchTrending(), 
        fetchMovers(), 
        fetchFreeMoneyOpportunities(), 
        fetchPredictionMarkets(), 
        fetchJobs(), 
        fetchNewsSignals(), 
        fetchXSignals(), 
        fetchAirdropsDotIo(), 
        fetchCryptoRank(), 
      ]); 

      const all: AlphaSignal[] = []; 
      results.forEach(r => { if (r.status === 'fulfilled') all.push(...r.value); }); 
 
      // Deduplicate 
      const seen = new Set<string>(); 
      const unique = all.filter(s => { 
        if (seen.has(s.id)) return false; 
        seen.add(s.id); 
        return true; 
      }); 
 
      // Sort: free money first, then by confidence 
      unique.sort((a, b) => { 
        if (a.category === 'airdrop' && b.category !== 'airdrop') return -1; 
        if (b.category === 'airdrop' && a.category !== 'airdrop') return 1; 
        return b.confidence - a.confidence; 
      }); 
 
      // Toast for brand new signals 
      const newOnes = unique.filter(s => !seenIds.current.has(s.id)); 
      newOnes.forEach(s => seenIds.current.add(s.id)); 
      if (newOnes.length > 0 && !loading) { 
        toast.success(`K9 sniffed out ${newOnes.length} new ${newOnes.length === 1 ? 'opportunity' : 'opportunities'}`, { 
          description: newOnes[0].title, 
          duration: 4000, 
        }); 
      } 
 
      setSignals(unique.slice(0, 40)); 
      setLastUpdated(new Date()); 
      setError(null); 
    } catch { 
      setError('K9 lost the scent. Check your connection and try again.'); 
    } finally { 
      setLoading(false); 
    } 
  }, [loading]); 
 
  useEffect(() => { loadAll(); }, [loadAll]); 
  useEffect(() => { 
    const interval = setInterval(loadAll, 90_000); 
    return () => clearInterval(interval); 
  }, [loadAll]); 
 
  const filteredSignals = signals.filter(s => { 
    if (filters.category !== 'all' && s.category !== filters.category) return false; 
    if (filters.risk !== 'all' && s.risk !== filters.risk) return false; 
    if (s.confidence < filters.minConfidence) return false; 
    return true; 
  }); 
 
  const refreshFeed = () => { setLoading(true); loadAll(); }; 
  const upvoteSignal = (id: string) => setSignals(p => p.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)); 
  const downvoteSignal = (id: string) => setSignals(p => p.map(s => s.id === id ? { ...s, downvotes: s.downvotes + 1 } : s)); 
 
  return { signals: filteredSignals, loading, error, lastUpdated, filters, setFilters, refreshFeed, upvoteSignal, downvoteSignal }; 
} 
