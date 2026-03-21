# K9 
  
 Find opportunities before anyone else. Get them on your phone. In plain English. 
  
 K9 watches crypto markets, airdrops, prediction markets, whale wallets,  
 and blockchain jobs 24/7. The moment it finds something worth your attention,  
 it sends a plain-English message to your WhatsApp or Telegram. 
  
 No technical knowledge needed. Just your phone number. 
  
 --- 
  
 ## Live Feed: Dispatch 
  
 When K9 picks up a signal, it goes straight to **Dispatch** — the live feed  
 where every opportunity appears the moment it's found, ranked by confidence. 
  
 Like a police dispatch that routes every call to the right unit — K9 Dispatch  
 routes every signal straight to your phone. 
  
 --- 
  
 ## What K9 Finds 
  
 | Category | What It Is | 
 |----------|-----------| 
 | **Free Money / Airdrop** | Projects giving free tokens. Past examples: Uniswap ($16K/person), Arbitrum ($8K/person). Zero investment. | 
 | **Jobs / Gigs / Bounty** | Remote crypto jobs, task-based bounties, community roles. Many need no experience. | 
 | **Insider Signals** | New wallets placing large bets before major events. The pattern that predicted Maduro's capture. | 
 | **Prediction Markets** | Odds spiking 15%+ in under 2 hours = informed money moving. | 
 | **Big Money Moves** | Large wallet transfers with no public news = possible insider accumulation. | 
 | **Market Moves** | New tokens early, stablecoin depegs, chain health drops. | 
 | **Safety Alerts** | Exploits, scams, rug pulls — know before you lose money. | 
  
 --- 
  
 ## Architecture 
  
 ``` 
 ┌─────────────────────────────────────────────────────────────────┐ 
 │                         K9 System                               │ 
 └─────────────────────────────────────────────────────────────────┘ 
  
 DATA SOURCES (scanned every 5 minutes) 
 ├── Polymarket CLOB API      → Insider bets, probability spikes 
 ├── DexScreener              → New token pairs, whale transactions 
 ├── DefiLlama                → TVL changes, yield opportunities, airdrops 
 ├── CoinGecko                → Market data, trending tokens 
 ├── GitHub API               → Protocol activity, developer signals 
 ├── Twitter/X (Nitter RSS)   → @WhaleAlert, @lookonchain, @AirdropAlert 
 ├── Airdrops.io              → Verified upcoming airdrops 
 ├── Immunefi                 → Bug bounties 
 ├── web3.career              → Crypto job listings 
 ├── Layer3 / Galxe           → Learn-to-earn campaigns 
 └── 6 RSS news feeds         → CoinTelegraph, Decrypt, Rekt, TheBlock, Defiant, CoinDesk 
       ↓ raw signals 
 SIGNAL ENGINE (backend/src/services/signalEngine.ts) 
 ├── Deduplication            → Remove duplicate signals 
 ├── Keyword pre-filter       → Remove obvious noise before AI scoring 
 ├── Velocity scoring         → How fast is this story spreading? 
 ├── Convergence detection    → 3+ sources on same topic = priority 
 └── Claude AI scoring        → Score 0–100, generate plain-English brief 
       ↓ scored signals (65+) 
 DELIVERY 
 ├── Telegram Bot             → Instant to all Telegram users 
 ├── WhatsApp (Green API)     → Instant to all WhatsApp users 
 └── REST API → Frontend      → Updates Dispatch (live feed) in real-time 
       ↓ 
 USER EXPERIENCE 
 ├── Dispatch (live feed)     → All signals, newest first, real-time 
 ├── Hunt                     → Filter by category, chain, confidence 
 ├── Verify                   → Paste any contract address, get safety report 
 ├── Saved                    → Bookmarked signals with notes 
 ├── Dev Intel                → GitHub activity, protocol updates 
 └── Community                → Leaderboards, shared alpha 
 FRONTEND ────────────────────────────────────────── 
 ├── React 18 + TypeScript 
 ├── Vite (build tool) 
 ├── Tailwind CSS (styling) 
 ├── shadcn/ui (components) 
 ├── Framer Motion (animations) 
 ├── TanStack React Query (data fetching + caching) 
 └── Server-Sent Events (real-time signal updates) 
 BACKEND ─────────────────────────────────────────── 
 ├── Node.js + Express 
 ├── TypeScript (strict mode) 
 ├── Telegraf (Telegram bot) 
 ├── node-cron (scheduled scanning) 
 ├── Claude AI via @anthropic-ai/sdk 
 ├── Zod (input validation) 
 ├── Helmet + CORS + Rate limiting (security) 
 └── In-memory store → Upstash Redis (when scaling) 
 ``` 
  
 --- 
  

  
 ### Prerequisites 
 - Node.js 18+ 
 - Anthropic API key (for AI scoring) 
 - Green API account (for WhatsApp — free tier) 
 - Telegram bot token (for Telegram — free) 

  
  
 ## License 
 MIT 
