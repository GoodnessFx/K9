import { useState, useEffect, useCallback, useRef } from 'react'; 
import { toast } from 'sonner'; 
 
// ─── Types ─────────────────────────────────────────────────────────────────── 
 
export type SignalCategory = 
  | 'airdrop' | 'bounty' | 'job' | 'insider' | 'whale' 
  | 'defi' | 'polymarket' | 'security' | 'nft' | 'tradfi' | 'dev'; 
 
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'; 
 
export interface K9Signal { 
  id: string; 
  title: string; 
  summary: string; 
  category: SignalCategory; 
  risk: RiskLevel; 
  confidence: number;       // 0–100 
  source: string; 
  sourceUrl: string; 
  timestamp: Date; 
  tags: string[]; 
  chain?: string; 
  token?: string; 
  upvotes: number; 
  downvotes: number; 
  isNew: boolean;           // true for first 5 minutes 
  actionUrl?: string;       // direct link to act on signal 
  timeToAct?: string;       // "Today only", "3 days", "Right now" 
} 
 
// ─── Free APIs ─────────────────────────────────────────────────────────────── 
 
// CoinGecko — free, no key needed 
const COINGECKO = 'https://api.coingecko.com/api/v3'; 
 
// DexScreener — free, no key needed 
const DEXSCREENER = 'https://api.dexscreener.com/latest'; 
 
// DefiLlama — free, no key needed 
const DEFILLAMA = 'https://api.llama.fi'; 
 
// Polymarket — free, no key needed 
const POLYMARKET_GAMMA = 'https://gamma-api.polymarket.com'; 
 
// HackerNews — free, no key needed 
const HN_API = 'https://hn.algolia.com/api/v1'; 
 
// RSS to JSON proxy — converts RSS feeds to JSON 
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='; 
 
// ─── Individual scrapers ────────────────────────────────────────────────────── 
 
async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> { 
  const controller = new AbortController(); 
  const id = setTimeout(() => controller.abort(), ms); 
  try { 
    const res = await fetch(url, { signal: controller.signal }); 
    clearTimeout(id); 
    return res; 
  } catch (e) { 
    clearTimeout(id); 
    throw e; 
  } 
} 
 
// 1. DexScreener — new token pairs with real volume (potential early entries) 
async function scanDexScreener(): Promise<K9Signal[]> { 
  try { 
    const res = await fetchWithTimeout(`${DEXSCREENER}/dex/search?q=latest`); 
    if (!res.ok) return []; 
    const data = await res.json(); 
    const pairs = Array.isArray(data.pairs) ? data.pairs.slice(0, 20) : []; 
 
    return pairs 
      .filter((t: any) => { 
        const vol = t.volume?.h24 ?? 0; 
        const liq = t.liquidity?.usd ?? 0; 
        return vol > 50000 && liq > 10000; 
      }) 
      .map((t: any): K9Signal => ({ 
        id: `dex-${t.baseToken?.address ?? t.pairAddress ?? Date.now()}`, 
        title: `New momentum: ${t.baseToken?.symbol ?? 'Unknown'} on ${t.chainId ?? 'chain'}`, 
        summary: `$${((t.volume?.h24 ?? 0) / 1000).toFixed(0)}K volume in 24h. Liquidity: $${((t.liquidity?.usd ?? 0) / 1000).toFixed(0)}K. Price change: ${(t.priceChange?.h24 ?? 0).toFixed(1)}%`, 
        category: 'defi', 
        risk: Math.abs(t.priceChange?.h24 ?? 0) > 50 ? 'high' : 'medium', 
        confidence: Math.min(90, 50 + Math.floor((t.volume?.h24 ?? 0) / 10000)), 
        source: 'DexScreener', 
        sourceUrl: t.url ?? 'https://dexscreener.com', 
        timestamp: new Date(), 
        tags: ['new-pair', t.chainId ?? 'unknown', 'trending'], 
        chain: t.chainId, 
        token: t.baseToken?.symbol, 
        upvotes: 0, 
        downvotes: 0, 
        isNew: true, 
        actionUrl: t.url, 
        timeToAct: 'Act fast — early stage', 
      })); 
  } catch { 
    return []; 
  } 
} 
 
// 2. CoinGecko trending + top movers 
async function scanCoinGecko(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  try { 
    // Trending coins 
    const trendRes = await fetchWithTimeout(`${COINGECKO}/search/trending`); 
    if (trendRes.ok) { 
      const trendData = await trendRes.json(); 
      const coins = trendData.coins?.slice(0, 5) ?? []; 
 
      for (const { item } of coins) { 
        signals.push({ 
          id: `cg-trend-${item.id}`, 
          title: `Trending on CoinGecko: ${item.name} ($${item.symbol?.toUpperCase()})`, 
          summary: `Rank #${item.market_cap_rank ?? '?'} — trending across the entire market right now. High search volume indicates building attention.`, 
          category: 'defi', 
          risk: 'medium', 
          confidence: 72, 
          source: 'CoinGecko', 
          sourceUrl: `https://www.coingecko.com/en/coins/${item.id}`, 
          timestamp: new Date(), 
          tags: ['trending', item.symbol?.toLowerCase() ?? 'unknown'], 
          token: item.symbol?.toUpperCase(), 
          upvotes: 0, 
          downvotes: 0, 
          isNew: true, 
          actionUrl: `https://www.coingecko.com/en/coins/${item.id}`, 
          timeToAct: 'Trending now', 
        }); 
      } 
    } 
 
    // Top movers (gainers/losers) 
    const moversRes = await fetchWithTimeout( 
      `${COINGECKO}/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&price_change_percentage=24h` 
    ); 
    if (moversRes.ok) { 
      const movers = await moversRes.json(); 
      for (const coin of movers.filter((c: any) => Math.abs(c.price_change_percentage_24h ?? 0) > 15)) { 
        const isGainer = (coin.price_change_percentage_24h ?? 0) > 0; 
        signals.push({ 
          id: `cg-mover-${coin.id}`, 
          title: `${isGainer ? '📈' : '📉'} ${coin.name} ${isGainer ? 'up' : 'down'} ${Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(1)}% today`, 
          summary: `Price: $${coin.current_price?.toLocaleString() ?? '?'} | Market cap: $${((coin.market_cap ?? 0) / 1e6).toFixed(0)}M | Volume: $${((coin.total_volume ?? 0) / 1e6).toFixed(0)}M`, 
          category: 'defi', 
          risk: Math.abs(coin.price_change_percentage_24h ?? 0) > 30 ? 'high' : 'medium', 
          confidence: 78, 
          source: 'CoinGecko', 
          sourceUrl: `https://www.coingecko.com/en/coins/${coin.id}`, 
          timestamp: new Date(), 
          tags: ['mover', isGainer ? 'gainer' : 'loser', coin.symbol], 
          token: coin.symbol?.toUpperCase(), 
          upvotes: 0, 
          downvotes: 0, 
          isNew: true, 
          actionUrl: `https://www.coingecko.com/en/coins/${coin.id}`, 
          timeToAct: 'Happening now', 
        }); 
      } 
    } 
  } catch { 
    // Silently fail — other sources will still work 
  } 
 
  return signals; 
} 
 
// 3. DefiLlama — protocol TVL changes and yield opportunities 
async function scanDefiLlama(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  try { 
    // Protocols with big TVL movements 
    const protRes = await fetchWithTimeout(`${DEFILLAMA}/protocols`); 
    if (protRes.ok) { 
      const protocols = await protRes.json(); 
      const movers = protocols 
        .filter((p: any) => p.tvl > 1_000_000 && Math.abs(p.change_1d ?? 0) > 20) 
        .sort((a: any, b: any) => Math.abs(b.change_1d ?? 0) - Math.abs(a.change_1d ?? 0)) 
        .slice(0, 5); 
 
      for (const p of movers) { 
        const isInflow = (p.change_1d ?? 0) > 0; 
        signals.push({ 
          id: `llama-${p.slug ?? p.name}`, 
          title: `${isInflow ? 'Money flowing into' : 'Money leaving'} ${p.name}: ${Math.abs(p.change_1d ?? 0).toFixed(1)}% in 24h`, 
          summary: `Total money locked: $${(p.tvl / 1e6).toFixed(1)}M. ${isInflow ? 'Capital entering = growing confidence' : 'Capital leaving = investigate why'}. 7-day change: ${(p.change_7d ?? 0).toFixed(1)}%`, 
          category: 'defi', 
          risk: isInflow ? 'low' : 'medium', 
          confidence: 80, 
          source: 'DefiLlama', 
          sourceUrl: `https://defillama.com/protocol/${p.slug}`, 
          timestamp: new Date(), 
          tags: ['tvl', isInflow ? 'inflow' : 'outflow', ...( p.chains?.slice(0, 2) ?? [])], 
          upvotes: 0, 
          downvotes: 0, 
          isNew: true, 
          actionUrl: `https://defillama.com/protocol/${p.slug}`, 
          timeToAct: isInflow ? 'Opportunity window open' : 'Monitor closely', 
        }); 
      } 
    } 
 
    // High yield opportunities 
    const yieldRes = await fetchWithTimeout(`${DEFILLAMA}/pools`); 
    if (yieldRes.ok) { 
      const yieldData = await yieldRes.json(); 
      const hotPools = (yieldData.data ?? []) 
        .filter((p: any) => p.apy > 40 && p.tvlUsd > 500_000 && !p.stablecoin) 
        .sort((a: any, b: any) => b.apy - a.apy) 
        .slice(0, 3); 
 
      for (const pool of hotPools) { 
        signals.push({ 
          id: `yield-${pool.pool}`, 
          title: `High yield alert: ${pool.symbol} on ${pool.project} — ${pool.apy.toFixed(0)}% APY`, 
          summary: `Earn ${pool.apy.toFixed(0)}% yearly by depositing ${pool.symbol} into ${pool.project}. $${(pool.tvlUsd / 1e6).toFixed(1)}M already deposited. Chain: ${pool.chain}`, 
          category: 'defi', 
          risk: pool.apy > 200 ? 'high' : 'medium', 
          confidence: 75, 
          source: 'DefiLlama', 
          sourceUrl: `https://defillama.com/yields?project=${pool.project}`, 
          timestamp: new Date(), 
          tags: ['yield', 'passive-income', pool.project, pool.chain], 
          upvotes: 0, 
          downvotes: 0, 
          isNew: true, 
          actionUrl: `https://defillama.com/yields?project=${pool.project}`, 
          timeToAct: 'Yields change daily', 
        }); 
      } 
    } 
  } catch { 
    // Silent fail 
  } 
 
  return signals; 
} 
 
// 4. Polymarket — prediction market opportunities and insider detection 
async function scanPolymarket(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  try { 
    const res = await fetchWithTimeout( 
      `${POLYMARKET_GAMMA}/markets?active=true&closed=false&order=volume&ascending=false&limit=20` 
    ); 
    if (!res.ok) return []; 
    const markets = await res.json(); 
 
    for (const market of markets) { 
      const volume = parseFloat(market.volume ?? '0'); 
      if (volume < 5000) continue; 
 
      const outcomes = market.outcomes ? JSON.parse(market.outcomes) : []; 
      const prices = market.outcomePrices ? JSON.parse(market.outcomePrices) : []; 
 
      const formattedOutcomes = outcomes.map((o: string, i: number) => ({ 
        title: o, 
        probability: Math.round(parseFloat(prices[i] ?? '0') * 100), 
      })); 
 
      // Flag interesting markets: near 50/50 (high uncertainty) or extreme moves 
      const topOutcome = formattedOutcomes.sort((a: any, b: any) => b.probability - a.probability)[0]; 
      if (!topOutcome) continue; 
 
      const isInteresting = formattedOutcomes.some((o: any) => o.probability > 75 || (o.probability > 40 && o.probability < 60)); 
      if (!isInteresting) continue; 
 
      signals.push({ 
        id: `poly-${market.id ?? market.slug}`, 
        title: `Prediction market: ${market.question ?? market.title}`, 
        summary: `"${topOutcome.title}" has ${topOutcome.probability}% chance. Volume: $${(volume / 1000).toFixed(0)}K. If right, $100 bet returns ~$${(100 / (topOutcome.probability / 100)).toFixed(0)}`, 
        category: 'polymarket', 
        risk: topOutcome.probability > 80 ? 'low' : 'medium', 
        confidence: 82, 
        source: 'Polymarket', 
        sourceUrl: `https://polymarket.com/event/${market.slug ?? ''}`, 
        timestamp: new Date(), 
        tags: ['prediction', 'bet', market.category ?? 'markets'], 
        upvotes: 0, 
        downvotes: 0, 
        isNew: true, 
        actionUrl: `https://polymarket.com/event/${market.slug ?? ''}`, 
        timeToAct: market.endDate ? `Closes: ${new Date(market.endDate).toLocaleDateString()}` : 'Active market', 
      }); 
    } 
  } catch { 
    // Silent fail 
  } 
 
  return signals; 
} 
 
// 5. HackerNews — crypto/web3 tech news for developer signals 
async function scanHackerNews(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  try { 
    const CRYPTO_TERMS = ['ethereum', 'solana', 'bitcoin', 'defi', 'web3', 'blockchain', 'crypto', 'nft', 'dao', 'airdrop', 'zk', 'layer2']; 
     
    const res = await fetchWithTimeout(`${HN_API}/search?query=crypto+blockchain+defi&tags=story&numericFilters=points>50&hitsPerPage=10`); 
    if (!res.ok) return []; 
    const data = await res.json(); 
 
    for (const hit of data.hits ?? []) { 
      const titleLower = (hit.title ?? '').toLowerCase(); 
      const isRelevant = CRYPTO_TERMS.some(term => titleLower.includes(term)); 
      if (!isRelevant) continue; 
 
      const isHighPoints = (hit.points ?? 0) > 100; 
 
      signals.push({ 
        id: `hn-${hit.objectID}`, 
        title: hit.title, 
        summary: `${hit.points ?? 0} points on HackerNews. ${hit.num_comments ?? 0} comments. High-signal developer community attention.`, 
        category: 'dev', 
        risk: 'low', 
        confidence: isHighPoints ? 80 : 68, 
        source: 'HackerNews', 
        sourceUrl: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`, 
        timestamp: new Date(hit.created_at ?? Date.now()), 
        tags: ['dev', 'tech', 'community'], 
        upvotes: hit.points ?? 0, 
        downvotes: 0, 
        isNew: new Date(hit.created_at ?? 0).getTime() > Date.now() - 6 * 60 * 60 * 1000, 
        actionUrl: hit.url, 
        timeToAct: 'Developer signal', 
      }); 
    } 
  } catch { 
    // Silent fail 
  } 
 
  return signals; 
} 
 
// 6. RSS Feeds — crypto news from 4 sources 
async function scanRSSFeeds(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  const feeds = [ 
    { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'defi' as SignalCategory }, 
    { name: 'Decrypt',       url: 'https://decrypt.co/feed',       category: 'defi' as SignalCategory }, 
    { name: 'Rekt News',     url: 'https://rekt.news/rss/',         category: 'security' as SignalCategory }, 
    { name: 'The Defiant',   url: 'https://thedefiant.io/feed',     category: 'defi' as SignalCategory }, 
  ]; 
 
  const SIGNAL_KEYWORDS = ['exploit', 'hack', 'airdrop', 'launch', 'mainnet', 'funding', 'raise', 'series', 'upgrade', 'vulnerability', 'partnership', 'listing']; 
 
  await Promise.allSettled( 
    feeds.map(async (feed) => { 
      try { 
        const res = await fetchWithTimeout(`${RSS_PROXY}${encodeURIComponent(feed.url)}&count=5`); 
        if (!res.ok) return; 
        const data = await res.json(); 
         
        for (const item of data.items ?? []) { 
          const fullText = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase(); 
          const matchedKeywords = SIGNAL_KEYWORDS.filter(kw => fullText.includes(kw)); 
          if (matchedKeywords.length === 0) continue; 
 
          const isSecurity = feed.category === 'security' || matchedKeywords.some(k => ['exploit', 'hack', 'vulnerability'].includes(k)); 
 
          signals.push({ 
            id: `rss-${feed.name}-${item.guid ?? item.link ?? Date.now()}`, 
            title: item.title ?? 'News signal', 
            summary: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 250), 
            category: isSecurity ? 'security' : feed.category, 
            risk: isSecurity ? 'high' : 'low', 
            confidence: 70 + matchedKeywords.length * 5, 
            source: feed.name, 
            sourceUrl: item.link ?? '', 
            timestamp: item.pubDate ? new Date(item.pubDate) : new Date(), 
            tags: matchedKeywords, 
            upvotes: 0, 
            downvotes: 0, 
            isNew: item.pubDate ? Date.now() - new Date(item.pubDate).getTime() < 3 * 60 * 60 * 1000 : false, 
            actionUrl: item.link, 
            timeToAct: isSecurity ? 'Check now' : 'News signal', 
          }); 
        } 
      } catch { 
        // Individual feed failure doesn't break others 
      } 
    }) 
  ); 
 
  return signals; 
} 
 
// 7. Verified Airdrops — known current/recent high-value airdrop campaigns 
async function scanAirdrops(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  const VERIFIED_AIRDROPS = [ 
    { 
      id: 'zksync-zk', 
      title: 'zkSync (ZK) — Free tokens for network users', 
      summary: 'zkSync is distributing tokens to users who bridged or used apps on their network. Check if your wallet is eligible at claim.zksync.io. Zero cost to claim.', 
      actionUrl: 'https://claim.zksync.io', 
      confidence: 90, 
      timeToAct: 'Claim now', 
      tags: ['zksync', 'ethereum', 'l2', 'free'], 
    }, 
    { 
      id: 'layerzero-zro', 
      title: 'LayerZero (ZRO) — Bridge users may be eligible', 
      summary: 'LayerZero distributed ZRO tokens to users who bridged assets across chains. Check eligibility. Similar users received $500–$5,000 in free tokens.', 
      actionUrl: 'https://layerzero.network', 
      confidence: 85, 
      timeToAct: 'Check eligibility', 
      tags: ['layerzero', 'bridge', 'multi-chain', 'free'], 
    }, 
    { 
      id: 'earnifi-checker', 
      title: 'Free tool: Check ALL your airdrop eligibility in one place', 
      summary: 'Earnifi checks your wallet against every known airdrop automatically. Takes 30 seconds. Many people have unclaimed tokens worth hundreds or thousands of dollars.', 
      actionUrl: 'https://earnifi.com', 
      confidence: 95, 
      timeToAct: 'Check right now — takes 30 seconds', 
      tags: ['airdrop', 'free', 'checker', 'all-chains'], 
    }, 
  ]; 
 
  for (const airdrop of VERIFIED_AIRDROPS) { 
    signals.push({ 
      id: `airdrop-${airdrop.id}`, 
      title: airdrop.title, 
      summary: airdrop.summary, 
      category: 'airdrop', 
      risk: 'low', 
      confidence: airdrop.confidence, 
      source: 'Verified Airdrop', 
      sourceUrl: airdrop.actionUrl, 
      timestamp: new Date(), 
      tags: airdrop.tags, 
      upvotes: 0, 
      downvotes: 0, 
      isNew: false, 
      actionUrl: airdrop.actionUrl, 
      timeToAct: airdrop.timeToAct, 
    }); 
  } 
 
  return signals; 
} 
 
// 8. Crypto Jobs — scrape live from web3.career 
async function scanCryptoJobs(): Promise<K9Signal[]> { 
  const signals: K9Signal[] = []; 
 
  try { 
    const res = await fetchWithTimeout(`${RSS_PROXY}${encodeURIComponent('https://web3.career/rss')}&count=8`); 
    if (res.ok) { 
      const data = await res.json(); 
      for (const item of data.items?.slice(0, 5) ?? []) { 
        const title = item.title ?? ''; 
        const isNoExp = /community|moderator|social|writer|translator|intern|junior/i.test(title); 
         
        signals.push({ 
          id: `job-${item.guid ?? item.link ?? Date.now()}`, 
          title: `Job: ${title}`, 
          summary: `${item.description?.replace(/<[^>]*>/g, '').slice(0, 200) ?? 'Crypto industry job opportunity'}. ${isNoExp ? 'May not require prior crypto experience.' : ''}`, 
          category: 'job', 
          risk: 'low', 
          confidence: 85, 
          source: 'web3.career', 
          sourceUrl: item.link ?? 'https://web3.career', 
          timestamp: item.pubDate ? new Date(item.pubDate) : new Date(), 
          tags: ['job', 'remote', isNoExp ? 'no-experience' : 'technical'], 
          upvotes: 0, 
          downvotes: 0, 
          isNew: item.pubDate ? Date.now() - new Date(item.pubDate).getTime() < 24 * 60 * 60 * 1000 : false, 
          actionUrl: item.link, 
          timeToAct: 'Apply before it closes', 
        }); 
      } 
    } 
  } catch { 
    // RSS failed — show static job boards as fallback signals 
    const JOB_BOARDS = [ 
      { title: 'Job: Browse 500+ remote crypto jobs — many need no experience', url: 'https://web3.career', summary: 'Community managers ($3K–$8K/month), Discord moderators, content writers, translators. Most remote. Many need no prior crypto experience.' }, 
      { title: 'Bounties: Earn crypto completing specific tasks on Gitcoin', url: 'https://gitcoin.co/explorer', summary: 'Writing, testing, code, design — get paid in crypto per completed task. Start with small bounties, build reputation.' }, 
      { title: 'Bug Bounties: Up to $1M for finding security issues — Immunefi', url: 'https://immunefi.com/bounties/', summary: 'Security researchers earn $500 to $1,000,000 per bug found. Requires technical skills but extremely high reward potential.' }, 
    ]; 
 
    for (const job of JOB_BOARDS) { 
      signals.push({ 
        id: `jobboard-${job.url}`, 
        title: job.title, 
        summary: job.summary, 
        category: 'job', 
        risk: 'low', 
        confidence: 88, 
        source: 'Job Board', 
        sourceUrl: job.url, 
        timestamp: new Date(), 
        tags: ['job', 'remote', 'gig', 'bounty'], 
        upvotes: 0, 
        downvotes: 0, 
        isNew: false, 
        actionUrl: job.url, 
        timeToAct: 'Apply now', 
      }); 
    } 
  } 
 
  return signals; 
} 
 
// ─── Deduplication ──────────────────────────────────────────────────────────── 
 
function deduplicate(signals: K9Signal[]): K9Signal[] { 
  const seen = new Set<string>(); 
  return signals.filter(s => { 
    const key = s.title.toLowerCase().slice(0, 60); 
    if (seen.has(key)) return false; 
    seen.add(key); 
    return true; 
  }); 
} 
 
function score(signal: K9Signal): number { 
  let base = signal.confidence; 
  if (signal.isNew) base += 5; 
  if (signal.risk === 'low') base += 3; 
  if (signal.category === 'airdrop') base += 8;       // Free money ranks high 
  if (signal.category === 'job') base += 5;           // Jobs always useful 
  if (signal.category === 'polymarket') base += 6;    // Prediction markets 
  if (signal.category === 'security') base += 10;     // Safety first 
  return Math.min(99, base); 
} 
 
// ─── Master hook ───────────────────────────────────────────────────────────── 
 
export function useK9DataEngine() { 
  const [signals, setSignals] = useState<K9Signal[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); 
  const [sourceStatus, setSourceStatus] = useState<Record<string, 'ok' | 'error'>>({}); 
  const prevSignalIds = useRef<Set<string>>(new Set()); 
 
  const fetchAll = useCallback(async (isRefresh = false) => { 
    if (isRefresh) setLoading(true); 
 
    const results = await Promise.allSettled([ 
      scanDexScreener(), 
      scanCoinGecko(), 
      scanDefiLlama(), 
      scanPolymarket(), 
      scanHackerNews(), 
      scanRSSFeeds(), 
      scanAirdrops(), 
      scanCryptoJobs(), 
    ]); 
 
    const sourceNames = ['DexScreener', 'CoinGecko', 'DefiLlama', 'Polymarket', 'HackerNews', 'News Feeds', 'Airdrops', 'Jobs']; 
    const newStatus: Record<string, 'ok' | 'error'> = {}; 
    const all: K9Signal[] = []; 
 
    results.forEach((result, i) => { 
      if (result.status === 'fulfilled') { 
        all.push(...result.value); 
        newStatus[sourceNames[i]] = 'ok'; 
      } else { 
        newStatus[sourceNames[i]] = 'error'; 
      } 
    }); 
 
    const unique = deduplicate(all); 
    const sorted = unique.sort((a, b) => score(b) - score(a)); 
    const top50 = sorted.slice(0, 50); 
 
    // Find genuinely new signals 
    const newOnes = top50.filter(s => !prevSignalIds.current.has(s.id)); 
    newOnes.forEach(s => prevSignalIds.current.add(s.id)); 
 
    if (newOnes.length > 0 && !loading) { 
      const best = newOnes[0]; 
      toast.success(`K9 found ${newOnes.length} new signal${newOnes.length > 1 ? 's' : ''}`, { 
        description: best.title, 
        duration: 5000, 
        action: { label: 'View', onClick: () => document.getElementById('dispatch-top')?.scrollIntoView({ behavior: 'smooth' }) }, 
      }); 
    } 
 
    setSignals(top50); 
    setSourceStatus(newStatus); 
    setLastUpdated(new Date()); 
    setLoading(false); 
  }, [loading]); 
 
  // Initial load 
  useEffect(() => { 
    fetchAll(false); 
  }, [fetchAll]); 
 
  // Auto-refresh every 90 seconds 
  useEffect(() => { 
    const interval = setInterval(() => fetchAll(false), 90_000); 
    return () => clearInterval(interval); 
  }, [fetchAll]); 
 
  function refreshNow() { 
    toast.info('Scanning all sources...'); 
    fetchAll(true); 
  } 
 
  return { 
    signals, 
    loading, 
    lastUpdated, 
    sourceStatus, 
    refreshNow, 
    totalSources: Object.keys(sourceStatus).length, 
    activeSources: Object.values(sourceStatus).filter(s => s === 'ok').length, 
  }; 
} 
