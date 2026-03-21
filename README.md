# K9

Find opportunities before anyone else. Get them on your phone. In plain English.

K9 watches crypto markets, airdrops, prediction markets, whale wallets, and blockchain jobs 24/7. The moment it finds something worth your attention, it sends a plain-English message to your WhatsApp or Telegram.

No technical knowledge needed. Just your phone number.

---

## What K9 Finds

| Category | What It Is | Sources Scanned |
|----------|------------|-----------------|
| **Free Money / Airdrops** | Projects giving free tokens. | Airdrops.io, DefiLlama, Layer3, Galxe |
| **Jobs & Bounties** | Remote crypto jobs and task-based bounties. | LinkedIn (Crypto), RemoteOK, web3.career, Immunefi, Gitcoin |
| **Insider Signals** | Informed money moving before major events. | Polymarket (Spikes), WhaleAlert, lookonchain |
| **Trading Alpha** | Verified pro traders and unusual on-chain volume. | Twitter/X (Pro Traders), DexScreener (Momentum) |
| **Safety Alerts** | Exploits, scams, rug pulls — know before you lose. | Rekt, Security RSS, On-chain malicious patterns |

---

## Key Features

- **Dispatch (Live Feed):** Real-time stream of every opportunity found, ranked by AI confidence.
- **Hunt:** Deep dive into market health and source convergence (when 3+ sources agree on a signal).
- **Verify (Safety Audit):** Paste any contract address to get an instant AI-powered safety report.
- **Saved:** Bookmark signals and manage your personal alpha library.
- **Personalized Alerts:** Get notified via WhatsApp or Telegram based on your interests.

---

## Architecture

K9 scans **14+ sources** every 90 seconds using a distributed engine:

1. **DATA SOURCES:**
   - **Market APIs:** DexScreener, DefiLlama, Polymarket, CoinGecko.
   - **Social & News:** Twitter/X (via Nitter RSS), HackerNews, 6+ Major News RSS.
   - **Opportunity Boards:** Airdrops.io, Immunefi, Gitcoin, Layer3, Galxe.
   - **Job Boards:** LinkedIn, RemoteOK, web3.career.

2. **SIGNAL ENGINE:**
   - **Deduplication:** Merges overlapping data from different sources.
   - **Scoring:** Ranks signals (0-100) based on source reliability and convergence.
   - **AI Briefing:** Claude AI generates a plain-English summary and "Playbook" for every high-confidence signal.

3. **DELIVERY:**
   - **Frontend:** React 18 + Vite + Tailwind 4.0 (Claude's Visual Language).
   - **Alerts:** WhatsApp (Green API) and Telegram Bot integration.

---

### Prerequisites
- Node.js 18+
- npm or yarn
