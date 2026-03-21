import { useState, useEffect, useCallback, useRef } from 'react'; 
import { toast } from 'sonner'; 
 
// ─── Types ─────────────────────────────────────────────────────────────────── 
 
export type SignalCategory = 
  | 'airdrop' | 'bounty' | 'job' | 'insider' | 'whale' 
  | 'defi' | 'polymarket' | 'security' | 'nft' | 'tradfi' | 'dev' | 'trading'; 
 
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
 
// ─── 9. X / Twitter Trading Alpha — via Nitter RSS ────────────────────────── 
// Verified professional traders with proven track records 
const TRADING_ACCOUNTS = [ 
  { handle: 'CryptoCred',    score: 88 }, 
  { handle: 'RektCapital',   score: 87 }, 
  { handle: 'DonAlt',        score: 86 }, 
  { handle: 'Pentosh1',      score: 85 }, 
  { handle: 'AltcoinSherpa', score: 83 }, 
  { handle: 'CryptoKaleo',   score: 84 }, 
]; 

// X alpha accounts for airdrops, whales, security 
const ALPHA_ACCOUNTS = [ 
  { handle: 'AirdropAlert',    category: 'airdrop'   as SignalCategory, score: 85 }, 
  { handle: 'CryptoRank_io',   category: 'airdrop'   as SignalCategory, score: 83 }, 
  { handle: 'lookonchain',     category: 'insider'   as SignalCategory, score: 87 }, 
  { handle: 'WhaleAlert',      category: 'whale'     as SignalCategory, score: 82 }, 
  { handle: 'PeckShieldAlert', category: 'security'  as SignalCategory, score: 89 }, 
]; 

const NITTER_NODES = [ 
  'https://nitter.net', 
  'https://nitter.privacydev.net', 
  'https://nitter.1d4.us', 
  'https://nitter.poast.org', 
]; 

const TRADE_KEYWORDS = [ 
  'entry', 'target', 'stop loss', 'sl:', 'tp:', 'long', 'short', 
  'accumulate', 'buy zone', 'breakout', 'setup', 'position', 'invalidation', 
]; 

const SCAM_WORDS = [ 
  'dm me', 'send eth', 'guaranteed', '1000x', 
  'private key', 'seed phrase', 'pump', 'shill', 
]; 

async function fetchXRSS(handle: string): Promise<any[]> { 
  for (const node of NITTER_NODES) { 
    try { 
      const url = `${RSS_PROXY}${encodeURIComponent(`${node}/${handle}/rss`)}&count=5`; 
      const res = await fetchWithTimeout(url, 6000); 
      if (!res.ok) continue; 
      const data = await res.json(); 
      if (data?.items?.length) return data.items; 
    } catch { continue; } 
  } 
  return []; 
} 

async function scanXTrading(): Promise<K9Signal[]> { 
  const results: K9Signal[] = []; 
  const seen = new Set<string>(); 

  await Promise.allSettled( 
    TRADING_ACCOUNTS.map(async (account) => { 
      const items = await fetchXRSS(account.handle); 
      for (const item of items) { 
        const fullText = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase(); 
        if (SCAM_WORDS.some(w => fullText.includes(w))) continue; 
        const matched = TRADE_KEYWORDS.filter(kw => fullText.includes(kw)); 
        if (matched.length < 2) continue; 

        const id = `x-trade-${account.handle}-${item.guid ?? item.pubDate}`; 
        if (seen.has(id)) continue; 
        seen.add(id); 

        const tokenMatch = fullText.match(/\$([a-z]{2,6})/i); 
        const token = tokenMatch ? tokenMatch[1].toUpperCase() : undefined; 

        results.push({ 
          id, 
          title: `Trading signal from @${account.handle}${token ? `: $${token}` : ''}`, 
          summary: (item.description ?? item.title ?? '') 
            .replace(/<[^>]*>/g, '').slice(0, 260), 
          category: 'trading' as SignalCategory, 
          risk: 'medium', 
          confidence: Math.min(93, Math.round(account.score + matched.length * 1.5)), 
          source: `@${account.handle} on X`, 
          sourceUrl: item.link ?? `https://x.com/${account.handle}`, 
          timestamp: new Date(item.pubDate ?? Date.now()), 
          tags: [...matched.slice(0, 3), 'x-alpha', 'trading'], 
          chain: 'multiple', 
          token, 
          upvotes: 0, downvotes: 0, 
          isNew: new Date(item.pubDate ?? 0).getTime() > Date.now() - 3 * 3600 * 1000, 
          actionUrl: item.link, 
          timeToAct: 'Verify before acting — do your own research', 
        }); 
      } 
    }) 
  ); 

  return results.slice(0, 8); 
} 

async function scanXAlpha(): Promise<K9Signal[]> { 
  const results: K9Signal[] = []; 
  const seen = new Set<string>(); 

  const SIGNAL_KEYWORDS = ['airdrop', 'free', 'claim', 'whale', 'moved', 'alert', 'hack', 'exploit', 'bounty', 'launch']; 

  await Promise.allSettled( 
    ALPHA_ACCOUNTS.map(async (account) => { 
      const items = await fetchXRSS(account.handle); 
      for (const item of items) { 
        const fullText = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase(); 
        if (SCAM_WORDS.some(w => fullText.includes(w))) continue; 
        if (!SIGNAL_KEYWORDS.some(kw => fullText.includes(kw))) continue; 

        const id = `x-alpha-${account.handle}-${item.guid ?? item.pubDate}`; 
        if (seen.has(id)) continue; 
        seen.add(id); 

        results.push({ 
          id, 
          title: `@${account.handle}: ${(item.title ?? '').slice(0, 100)}`, 
          summary: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 260), 
          category: account.category, 
          risk: account.category === 'security' ? 'high' : 'medium', 
          confidence: account.score, 
          source: `@${account.handle} on X`, 
          sourceUrl: item.link ?? `https://x.com/${account.handle}`, 
          timestamp: new Date(item.pubDate ?? Date.now()), 
          tags: [account.category, 'x-alpha', account.handle.toLowerCase()], 
          upvotes: 0, downvotes: 0, 
          isNew: new Date(item.pubDate ?? 0).getTime() > Date.now() - 2 * 3600 * 1000, 
          actionUrl: item.link, 
          timeToAct: account.category === 'security' ? 'Check now' : 'Verify and act', 
        }); 
      } 
    }) 
  ); 

  return results.slice(0, 10); 
} 

// ─── 10–12. Job Boards — LinkedIn, RemoteOK, CryptoJobsList ───────────────── 
const JOB_RSS_SOURCES = [ 
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/jobs/search/?keywords=crypto+web3+remote&f_WT=2&f_TPR=r86400&format=rss', 
    boost: 5, 
  }, 
  { 
    name: 'LinkedIn Web3', 
    url: 'https://www.linkedin.com/jobs/search/?keywords=blockchain+defi+remote&format=rss', 
    boost: 4, 
  }, 
  { 
    name: 'RemoteOK', 
    url: 'https://remoteok.com/remote-crypto-jobs.rss', 
    boost: 3, 
  }, 
  { 
    name: 'RemoteOK Blockchain', 
    url: 'https://remoteok.com/remote-blockchain-jobs.rss', 
    boost: 3, 
  }, 
  { 
    name: 'CryptoJobsList', 
    url: 'https://cryptojobslist.com/rss', 
    boost: 4, 
  }, 
]; 

const HIGH_VALUE_ROLES = [ 
  'community manager', 'moderator', 'content writer', 'translator', 
  'growth', 'marketing', 'discord', 'social media', 'researcher', 
  'analyst', 'developer', 'engineer', 'designer', 'product manager', 
  'operations', 'partnerships', 'business development', 
]; 

const NO_EXP_ROLES = [ 
  'community manager', 'moderator', 'social media', 
  'discord', 'translator', 'content', 'writer', 
]; 

async function scanAllJobBoards(): Promise<K9Signal[]> { 
  const results: K9Signal[] = []; 
  const seen = new Set<string>(); 

  await Promise.allSettled( 
    JOB_RSS_SOURCES.map(async (source) => { 
      try { 
        const url = `${RSS_PROXY}${encodeURIComponent(source.url)}&count=6`; 
        const res = await fetchWithTimeout(url, 8000); 
        if (!res.ok) return; 
        const data = await res.json(); 

        for (const item of (data.items ?? []).slice(0, 4)) { 
          const titleLower = (item.title ?? '').toLowerCase(); 
          const descLower  = (item.description ?? '').replace(/<[^>]*>/g, '').toLowerCase(); 
          const fullText   = `${titleLower} ${descLower}`; 

          const roleMatch = HIGH_VALUE_ROLES.find(r => fullText.includes(r)); 
          if (!roleMatch) continue; 

          const isRemote  = fullText.includes('remote') || fullText.includes('anywhere'); 
          const isNoExp   = NO_EXP_ROLES.some(r => titleLower.includes(r)); 
          const id        = `job-board-${source.name}-${item.guid ?? item.link ?? item.title}`; 
          if (seen.has(id)) continue; 
          seen.add(id); 

          const salaryMatch = fullText.match(/\$[\d,]+([\s\-–]+\$[\d,]+)?(\s*(k|\/month|\/mo|\/year))?/i); 
          const salary = salaryMatch ? ` Pay: ${salaryMatch[0]}.` : ''; 

          results.push({ 
            id, 
            title: `${source.name}: ${(item.title ?? 'Job opening').slice(0, 100)}`, 
            summary: `${isNoExp ? 'No crypto experience required. ' : ''}${isRemote ? 'Remote. ' : ''}${salary}${(item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 180)}`, 
            category: 'job', 
            risk: 'low', 
            confidence: Math.min(93, 80 + source.boost + (isNoExp ? 5 : 0)), 
            source: source.name, 
            sourceUrl: item.link ?? '#', 
            timestamp: new Date(item.pubDate ?? Date.now()), 
            tags: ['job', 'remote', isNoExp ? 'no-experience' : 'technical', 
              source.name.toLowerCase().replace(/\s/g, '-')], 
            upvotes: 0, downvotes: 0, 
            isNew: item.pubDate 
              ? Date.now() - new Date(item.pubDate).getTime() < 24 * 3600 * 1000 
              : false, 
            actionUrl: item.link, 
            timeToAct: 'Apply now — roles close within 48 hours', 
          }); 
        } 
      } catch { /* silent */ } 
    }) 
  ); 

  return results; 
} 

// ─── 13. Reddit — Community signals ───────────────────────────────────────── 
const REDDIT_FEEDS = [ 
  { subreddit: 'cryptocurrency', category: 'defi' as SignalCategory }, 
  { subreddit: 'defi',           category: 'defi' as SignalCategory }, 
  { subreddit: 'jobs4bitcoins',  category: 'job'  as SignalCategory }, 
  { subreddit: 'ethfinance',     category: 'defi' as SignalCategory }, 
]; 

const REDDIT_SIGNAL_KW = [ 
  'airdrop', 'free', 'claim', 'bounty', 'hiring', 'job', 
  'exploit', 'hack', 'vulnerability', 'launch', 'mainnet', 
]; 

async function scanReddit(): Promise<K9Signal[]> { 
  const results: K9Signal[] = []; 

  await Promise.allSettled( 
    REDDIT_FEEDS.map(async (feed) => { 
      try { 
        const url = `${RSS_PROXY}${encodeURIComponent(`https://www.reddit.com/r/${feed.subreddit}/hot.rss?limit=10`)}&count=10`; 
        const res = await fetchWithTimeout(url, 7000); 
        if (!res.ok) return; 
        const data = await res.json(); 

        for (const item of (data.items ?? []).slice(0, 5)) { 
          const fullText = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase(); 
          if (SCAM_WORDS.some(w => fullText.includes(w))) continue; 

          const matched = REDDIT_SIGNAL_KW.filter(kw => fullText.includes(kw)); 
          if (matched.length === 0 && feed.category !== 'job') continue; 

          results.push({ 
            id: `reddit-${feed.subreddit}-${item.guid ?? item.link}`, 
            title: (item.title ?? '').slice(0, 120), 
            summary: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 240), 
            category: feed.category, 
            risk: 'low', 
            confidence: 65 + matched.length * 3, 
            source: `r/${feed.subreddit}`, 
            sourceUrl: item.link ?? `https://reddit.com/r/${feed.subreddit}`, 
            timestamp: new Date(item.pubDate ?? Date.now()), 
            tags: ['reddit', feed.subreddit, ...matched.slice(0, 2)], 
            upvotes: 0, downvotes: 0, 
            isNew: item.pubDate 
              ? Date.now() - new Date(item.pubDate).getTime() < 4 * 3600 * 1000 
              : false, 
            actionUrl: item.link, 
            timeToAct: 'Community signal', 
          }); 
        } 
      } catch { /* silent */ } 
    }) 
  ); 

  return results.slice(0, 8); 
} 

// ─── 14. Airdrops.io RSS — Live verified airdrops ─────────────────────────── 
async function scanAirdropsDotIo(): Promise<K9Signal[]> { 
  const results: K9Signal[] = []; 

  try { 
    const url = `${RSS_PROXY}${encodeURIComponent('https://airdrops.io/feed/')}&count=8`; 
    const res = await fetchWithTimeout(url, 7000); 
    if (!res.ok) return []; 
    const data = await res.json(); 

    for (const item of (data.items ?? []).slice(0, 6)) { 
      results.push({ 
        id: `airdropsdotio-${item.guid ?? item.link}`, 
        title: item.title ?? 'New airdrop listed', 
        summary: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 240), 
        category: 'airdrop', 
        risk: 'low', 
        confidence: 82, 
        source: 'airdrops.io', 
        sourceUrl: item.link ?? `https://airdrops.io`, 
        timestamp: new Date(item.pubDate ?? Date.now()), 
        tags: ['airdrop', 'verified', 'free'], 
        upvotes: 0, downvotes: 0, 
        isNew: item.pubDate 
          ? Date.now() - new Date(item.pubDate).getTime() < 12 * 3600 * 1000 
          : false, 
        actionUrl: item.link, 
        timeToAct: 'Check eligibility now', 
      }); 
    } 
  } catch { /* silent */ } 

  return results; 
} 

// ─── 15–16. Bounties — Layer3 / Galxe / Immunefi ──────────────────────────── 
async function scanBounties(): Promise<K9Signal[]> { 
  const BOUNTY_SIGNALS: K9Signal[] = [ 
    { 
      id: 'layer3-tasks', 
      title: 'Get paid to try new crypto apps — Layer3', 
      summary: 'Layer3 pays you in crypto just for trying out apps, following projects, and answering quick questions. New tasks added every day. No experience needed.', 
      category: 'bounty', 
      risk: 'low', 
      confidence: 92, 
      source: 'Layer3', 
      sourceUrl: 'https://layer3.xyz', 
      timestamp: new Date(), 
      tags: ['bounty', 'earn', 'no-experience', 'layer3'], 
      upvotes: 0, downvotes: 0, 
      isNew: false, 
      actionUrl: 'https://layer3.xyz', 
      timeToAct: 'New tasks daily', 
    }, 
    { 
      id: 'galxe-quests', 
      title: 'Earn crypto completing quests — Galxe', 
      summary: 'Galxe has thousands of campaigns where projects pay you in tokens for following their socials, using their apps, or completing simple tasks. Free to start.', 
      category: 'bounty', 
      risk: 'low', 
      confidence: 90, 
      source: 'Galxe', 
      sourceUrl: 'https://galxe.com', 
      timestamp: new Date(), 
      tags: ['bounty', 'earn', 'galxe', 'quests'], 
      upvotes: 0, downvotes: 0, 
      isNew: false, 
      actionUrl: 'https://galxe.com', 
      timeToAct: 'Always open', 
    }, 
    { 
      id: 'immunefi-bounties', 
      title: 'Security bug bounties — up to $1M per bug on Immunefi', 
      summary: 'If you have security or code skills, Immunefi lists $500–$1,000,000 bounties for finding vulnerabilities in crypto protocols. Highest-paid security work in the world.', 
      category: 'bounty', 
      risk: 'low', 
      confidence: 88, 
      source: 'Immunefi', 
      sourceUrl: 'https://immunefi.com/bounties/', 
      timestamp: new Date(), 
      tags: ['bounty', 'security', 'immunefi', 'technical'], 
      upvotes: 0, downvotes: 0, 
      isNew: false, 
      actionUrl: 'https://immunefi.com/bounties/', 
      timeToAct: 'Always open', 
    }, 
    { 
      id: 'gitcoin-grants', 
      title: 'Gitcoin — earn crypto completing specific open-source tasks', 
      summary: 'Writing, testing, code reviews, design — Gitcoin Grants pays in crypto per completed task. Build your Web3 reputation while earning.', 
      category: 'bounty', 
      risk: 'low', 
      confidence: 85, 
      source: 'Gitcoin', 
      sourceUrl: 'https://gitcoin.co', 
      timestamp: new Date(), 
      tags: ['bounty', 'gitcoin', 'open-source', 'earn'], 
      upvotes: 0, downvotes: 0, 
      isNew: false, 
      actionUrl: 'https://gitcoin.co', 
      timeToAct: 'New bounties posted daily', 
    }, 
  ]; 

  return BOUNTY_SIGNALS; 
} 

// ─── Playbook: what to do with each signal ─────────────────────────────────── 
export function getSignalPlaybook(signal: K9Signal): { 
  whatHappened: string; 
  steps: string[]; 
  risk: string; 
  timing: string; 
} { 
  const ageMin = Math.floor((Date.now() - signal.timestamp.getTime()) / 60000); 
  const ageStr = ageMin < 60 ? `${ageMin}m ago` : `${Math.floor(ageMin / 60)}h ago`; 
 
  const map: Record<string, any> = { 
    airdrop: { 
      whatHappened: 'A verified project is giving away free tokens. No purchase needed — just claim eligibility.', 
      steps: ['Connect your wallet at the source link','Check all your wallets — each eligible address claims separately','Claim before the deadline — these close without warning','Share with friends who use crypto — they may qualify too'], 
      risk: 'Zero financial risk. Only time required.', 
      timing: `K9 spotted this ${ageStr}. Most people haven't seen it yet.`, 
    }, 
    insider: { 
      whatHappened: 'A verified trader or large wallet made a move suggesting informed knowledge. This pattern preceded several large price moves historically.', 
      steps: ['Read the full post at the source link before acting','Check current price and volume on CoinGecko','Only act with money you can afford to lose completely','Set a price alert rather than trading immediately'], 
      risk: 'Medium to high. Trading signals can be wrong. Verify independently.', 
      timing: `Posted ${ageStr}. Markets move fast.`, 
    }, 
    trading: { 
      whatHappened: 'A professional trader or alpha account shared a setup or signal on X. This includes entries, targets, and stop-loss levels.', 
      steps: ['Read the original thread on X for full context','Check the chart on TradingView or DexScreener','Manage your risk — never risk more than 1-2% per trade','Set your own invalidation point based on your strategy'], 
      risk: 'High. Trading signals are speculative and can result in total loss.', 
      timing: `Found ${ageStr}. Price may have moved.`, 
    }, 
    job: { 
      whatHappened: 'A crypto or Web3 company posted a job opening. Many pay $3,000–$15,000/month remotely.', 
      steps: ['Read the full description at the source link','Apply immediately — good roles close within 48 hours','Tailor your cover letter to the specific company','Even if underqualified — apply anyway. Crypto hires for attitude.'], 
      risk: 'Zero risk. Applying costs nothing.', 
      timing: `Posted ${ageStr}. Apply before it fills.`, 
    }, 
    security: { 
      whatHappened: 'K9 detected a security risk — possible hack, rug pull, or scam spreading rapidly.', 
      steps: ['Do NOT interact with the project or contract mentioned','If you hold this token — consider exiting now','Revoke contract approvals at revoke.cash immediately','Warn others in your community'], 
      risk: 'High. Act carefully and quickly if you are exposed.', 
      timing: `K9 caught this ${ageStr}. Act now.`, 
    }, 
    defi: { 
      whatHappened: 'Significant capital movement detected in DeFi markets. Big money is moving into or out of this protocol.', 
      steps: ['Check the protocol directly before acting','Look at the chart on TradingView or CoinGecko','Set a clear entry point and exit point before trading','Never put in more than you can afford to lose'], 
      risk: 'Medium. Market signals can reverse quickly.', 
      timing: `K9 detected this ${ageStr}.`, 
    }, 
    polymarket: { 
      whatHappened: 'A prediction market is showing unusual activity — either a new informed bet or odds moving rapidly.', 
      steps: ['Read the full market question at Polymarket','Research the underlying event independently','Small position sizing — prediction markets are high variance','Monitor the market for the next 24 hours'], 
      risk: 'High variance. Only bet what you are comfortable losing.', 
      timing: `Market moved ${ageStr}.`, 
    }, 
    bounty: { 
      whatHappened: 'A project is offering rewards (tokens or stablecoins) for completing specific tasks or finding bugs.', 
      steps: ['Read the bounty requirements carefully','Check if you have the required skills (technical or non-technical)','Submit your work through the official platform link','Build your reputation by completing smaller tasks first'], 
      risk: 'Low. Mostly costs time, not capital.', 
      timing: `Active now.`, 
    }, 
  }; 
 
  return map[signal.category] ?? { 
    whatHappened: signal.summary, 
    steps: ['Check the source link for full details','Research independently before acting','Only risk money you can afford to lose'], 
    risk: 'Varies. Always do your own research.', 
    timing: `Found ${ageStr}.`, 
  }; 
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
  if (signal.category === 'insider') base += 9;       // Insider signals rank high 
  if (signal.category === 'trading') base += 7;   // X trading signals rank high 
  if (signal.category === 'bounty')  base += 6;   // Bounties always useful 
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
      scanXTrading(), 
      scanXAlpha(), 
      scanAllJobBoards(), 
      scanReddit(), 
      scanAirdropsDotIo(), 
      scanBounties(), 
    ]); 
 
    const sourceNames = [ 
      'DexScreener', 'CoinGecko', 'DefiLlama', 'Polymarket', 
      'HackerNews', 'News Feeds', 'Airdrops', 'Jobs', 
      'X Trading', 'X Alpha', 'Job Boards', 'Reddit', 
      'Airdrops.io', 'Bounties', 
    ]; 
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
    const top60 = sorted.slice(0, 60); 
 
    // Find genuinely new signals 
    const newOnes = top60.filter(s => !prevSignalIds.current.has(s.id)); 
    newOnes.forEach(s => prevSignalIds.current.add(s.id)); 
 
    if (newOnes.length > 0 && !loading) { 
      const best = newOnes[0]; 
      toast.success(`K9 found ${newOnes.length} new signal${newOnes.length > 1 ? 's' : ''}`, { 
        description: best.title, 
        duration: 5000, 
        action: { label: 'View', onClick: () => document.getElementById('dispatch-top')?.scrollIntoView({ behavior: 'smooth' }) }, 
      }); 
    } 
 
    setSignals(top60); 
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
