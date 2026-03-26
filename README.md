# K9

Find opportunities before anyone else. Get them on your phone. In plain English.

K9 watches crypto markets, airdrops, prediction markets, whale wallets, and blockchain jobs 24/7. The moment it finds something worth your attention, it sends a plain-English message to your WhatsApp or Telegram.

No technical knowledge needed. Just your phone number.

---

## What K9 Finds

| Category | What It Is | Sources Scanned |
|----------|------------|-----------------|
| **Free Money / Airdrops** | Projects giving free tokens. | Airdrops.io, DefiLlama, Layer3, Galxe |
| **Jobs & Bounties** | **Trust-first marketplace.** Verified crypto jobs and gigs. | LinkedIn, Upwork, Fiverr, X, FB Groups, Discord, Telegram |
| **Insider Signals** | Informed money moving before major events. | Polymarket (Spikes), WhaleAlert, lookonchain |
| **Trading Alpha** | Verified pro traders and unusual on-chain volume. | Twitter/X (Pro Traders), DexScreener (Momentum) |
| **Safety Alerts** | Exploits, scams, rug pulls — know before you lose. | Rekt, Security RSS, On-chain malicious patterns |

---

## Key Features

**Dispatch (Live Feed):** Real-time stream of every opportunity found, ranked by AI confidence.
- **K9 Pulse:** Immutable, hash-chained feed of successful outcomes and verified wins.
- **Trust Verification (Scanner):** Unified KYB (Company) and Talent Proof (Video/Portfolio) vetting.
- **Jobs (Trust-First):** Market-leading matching with Match % badges and Verified status.
- **Smart Escrow:** Secure, multi-sig payment release with admin arbitration.
- **Safety Audit:** Instant AI-powered report for any contract address.
- **Secure Auth:** EIP-712 typed data signing for wallet-based authentication.
- **Privacy:** Verification docs are AES-256 encrypted at rest.
- **Personalized Alerts:** Get notified via WhatsApp or Telegram based on your interests.
3. **TRUST & SECURITY (ESCROW):**
4. **DELIVERY:**


### **1. The Dispatch (Live Feed)**
- **What it does:** A real-time stream of every gig, airdrop, and signal K9 finds.
- **Simple English:** Think of it like a Twitter feed, but only for things that can make you money. Every post is ranked by AI so you know what's worth your time.

### **2. K9 Pulse (Immutable Proof)**
- **What it does:** A public, unchangeable record of successful work and payments.
- **Simple English:** It's a "wall of wins." When someone finishes a job and gets paid, it's recorded here forever using blockchain tech. You can't fake it, and you can't delete it.

### **3. Trust Verification (Scanner)**
- **What it does:** Checks if companies and workers are actually legit.
- **Simple English:** It's like a background check. It looks at a company's website and LinkedIn, and it scans a worker's GitHub or video proof to make sure they aren't lying about their skills.

### **4. Secure Escrow & Mediation**
- **What it does:** Safely holds money until the work is done.
- **Simple English:** K9 acts as a middleman. The boss puts the money in K9's vault. The worker does the job. K9 only gives the money to the worker once the boss says "good job." If they fight, K9 steps in to settle it fairly.

### **5. Match Score %**
- **What it does:** Tells you how well you fit a specific job.
- **Simple English:** Every job has a score (like 95%). The higher the score, the better you fit the job based on your skills. No more guessing.

### **6. Safety Audit**
- **What it does:** Scans crypto addresses for scams.
- **Simple English:** Paste any crypto address, and K9 tells you if it's a "honeypot" or a scam before you lose your money.

### **7. Secure Auth & Privacy**
- **What it does:** Keeps your account and documents safe.
- **Simple English:** You log in with your crypto wallet (no passwords to steal). Any private docs you upload (like IDs) are locked with military-grade encryption so no one else can read them.

### **8. Instant Phone Alerts**
- **What it does:** Sends the best opportunities straight to your phone.
- **Simple English:** Get a WhatsApp or Telegram message the second a high-paying gig is found. You don't even need to be at your computer.

### **9. Chain Risk Index (CRI)**
- **What it does:** Monitors the "health" of different blockchains (Base, Solana, etc.).
- **Simple English:** K9 checks if a network is safe to use or if there's a lot of scam activity happening right now.

### **10. Source Convergence**
- **What it does:** Confirms a signal is real when multiple sources agree.
- **Simple English:** If K9 finds the same job on LinkedIn, X, and Discord, it marks it as "High Signal" because multiple people are talking about it.

---

## Architecture

K9 scans **20+ sources** every 15-60 minutes using a distributed engine:

1. **SNIFFER MODULE:**
   - **Stealth:** Playwright-Stealth, residential proxies, human-jitter, TLS fingerprint evasion.
   - **SourceSniffer:** LLM-vision (screenshot-to-data) + DOM parsing fallback.
   - **Coverage:** Web3 boards, Upwork/Fiverr, Social (X, FB), Messaging (Discord, Telegram), Career Pages.

2. **SIGNAL ENGINE:**
   - **Deduplication:** Merges overlapping data from different sources (7-day window).
   - **Scoring:** Ranks signals (0-100) based on reliability, convergence, and verification status.
   - **AI Briefing:** Claude AI generates a plain-English summary and "Playbook" for every high-confidence signal.

3. TRUST & SECURITY (ESCROW):**
   - **Smart Contract:** Secure Solidity escrow on Base/Polygon/Arbitrum.
   - **Safety:** Checks-Effects-Interactions pattern, emergency pause, and K9 arbitration.
   - **Proof Layer:** Signed Outcome Records and live Pulse feed of verified wins.
   - **Audit Logs:** Every sensitive action (payments, approvals) is recorded for safety.

4. DELIVERY & RELIABILITY:**
   - **Isolation:** Scrapers and checks run in isolated queues (BullMQ). If one breaks, the app stays up.
   - **Frontend:** React 18 + Vite + Tailwind 4.0 (Claude's Visual Language).
   - **Alerts:** WhatsApp (Green API) and Telegram Bot integration.

---

