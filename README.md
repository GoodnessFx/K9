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
  
 ## Setup 
  
 ### Prerequisites 
 - Node.js 18+ 
 - Anthropic API key (for AI scoring) 
 - Green API account (for WhatsApp — free tier) 
 - Telegram bot token (for Telegram — free) 
  
 ### Clone and install 
 ```bash 
 git clone https://github.com/GoodnessFx/K9.git 
 cd K9 
  
 # Frontend dependencies 
 npm install 
  
 # Backend dependencies  
 cd backend && npm install 
 ``` 
  
 ### Environment variables 
  
 **Backend:** Copy `backend/.env.example` to `backend/.env` 
 ```env 
 # Required — AI signal scoring 
 ANTHROPIC_API_KEY=sk-ant-... 
  
 # WhatsApp delivery — free at greenapi.com 
 # greenapi.com → create account → create instance → scan QR → copy these 
 GREEN_API_INSTANCE_ID=1101234567 
 GREEN_API_TOKEN=your_token_here 
 MY_WHATSAPP_NUMBER=2348012345678 
 # Format: country code + number, no + or spaces 
  
 # Telegram delivery — free 
 # Telegram → @BotFather → /newbot → copy token 
 TELEGRAM_BOT_TOKEN=your_bot_token 
  
 # Server 
 PORT=3001 
 NODE_ENV=development 
 FRONTEND_URL=http://localhost:5173 
 ``` 
  
 **Frontend:** Copy `.env.example` to `.env.local` 
 ```env 
 VITE_API_URL=http://localhost:3001 
 ``` 
  
 ### Run 
 ```bash 
 # Terminal 1 — Backend 
 cd backend && npm run dev 
  
 # Terminal 2 — Frontend 
 npm run dev 
 ``` 
  
 - App: http://localhost:5173 
 - API: http://localhost:3001 
 - Health: http://localhost:3001/api/health 
  
 ### Deploy 
  
 Frontend: Deploy to Vercel (connect GitHub repo, auto-deploys on push) 
 Backend: Deploy to Railway or Hetzner VPS ($5/month) 
  
 --- 
  
 ## WhatsApp Setup (3 minutes, free) 
  
 1. Go to `https://greenapi.com`  → create free account 
 2. Click "Create Instance" 
 3. Scan the QR code with WhatsApp on your phone 
    *(WhatsApp → Settings → Linked Devices → Link a Device)* 
 4. Copy **Instance ID** and **API Token** 
 5. Add to `backend/.env` 
 6. Set `MY_WHATSAPP_NUMBER` to your number (country code + number, no +) 
    - Nigeria: `2348012345678` 
    - UK: `447911123456` 
    - US: `12025551234` 
  
 Free tier: 1,500 messages/day. No Meta approval needed. 
  
 --- 
  
 ## Telegram Setup (2 minutes, free, unlimited) 
  
 1. Open Telegram → search **@BotFather** 
 2. Send `/newbot` 
 3. Choose a name (e.g. "K9 Alert Bot")  
 4. Choose a username (e.g. `k9alertbot`) 
 5. Copy the token → add to `backend/.env` as `TELEGRAM_BOT_TOKEN` 
 6. Restart backend 
  
 Users start the bot by opening Telegram and searching `@k9alertbot` → `/start` 
  
 --- 
  
 ## Sample Alert 
 K9 found something 
 ────────────────── 
 FREE MONEY / AIRDROP 
 Arbitrum is giving away free tokens to anyone who used 
 their network before March 2024. Average claim worth $2,400. 
 8 days to claim. 
 CONFIDENCE: 94/100 
 TIME TO ACT: 8 days remaining 
 WHAT YOU CAN DO 
 ① Claim at arbitrum.foundation/airdrop → connect wallet → 
 check eligibility → claim. 5 minutes. Zero cost. 
 ② Check every wallet you own — each eligible address claims 
 separately. 
 ③ Tell friends who used Arbitrum — they can claim too. 
 HOW RISKY? 
 Zero risk — you are not spending any money. 
 FIRST TO KNOW 
 You're seeing this 45 minutes before major crypto news sites. 
 SOURCE: DefiLlama airdrop tracker 
 ────────────────── 
 K9 · Find it first 
  
 --- 
  
 ## Security 
  
 - All API keys stored in `.env` — never committed to GitHub 
 - Helmet.js security headers on all responses 
 - Rate limiting: 100 req/15min general, 5 req/min for sensitive routes 
 - CORS restricted to your frontend domain 
 - All inputs validated with Zod before processing 
 - No sensitive data in client-side code 
  
 --- 
  
 ## License 
 MIT 
