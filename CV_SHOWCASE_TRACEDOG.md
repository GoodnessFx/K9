# K9 — AI Alpha Hunter (Portfolio Showcase)

An AI-powered, production-ready platform that hunts trading opportunities, analyzes smart contract risk, and aggregates market intelligence across DeFi and TradFi — all in an elegant, high-performance React app.

## Why This Stands Out
- Real-time alpha scanning with confidence scoring and risk context
- Security-first approach with honeypot/rug-pull analysis and audit signals
- Social and community features with leaderboards and challenges
- Developer intelligence feed tracking tools, protocols, and security updates
- Personal “Alpha Vault” for saving insights and reviewing performance
- Polished UI/UX, responsive design, dark mode, animations, and notifications
- Production-grade bundling, code splitting, error boundaries, and edge server ready

## Feature Overview
- AI Alpha Feed
  - Streams trading signals with confidence, tags, timeframes, and blockchain context
  - Interactive filters: by category (`defi`, `tradfi`, `nft`), confidence threshold, risk
  - Voting system: upvote/downvote signals to surface quality
  - One-click save to “Alpha Vault” with success toasts
  - Manual refresh and simulated real-time generation for demo purposes

- Opportunity Radar
  - Advanced, multi-dimensional scanner (pause/resume, advanced filters UI)
  - Actionable filters: risk tolerance, confidence, timeframe, exchanges, tokens, strategies
  - Designed for scanning sources and surfacing low-risk opportunities
  - Built with interactive cards, badges, granular options, and animated transitions

- Security Scanner
  - Contract address scanning workflow with progress steps and animated feedback
  - Key metrics: rug pull risk, liquidity lock status, dev wallet movement, honeypot detection
  - Audit status badges (`verified`, `pending`, `unaudited`) and findings list
  - Recent scans grid with severity coloring and quick drill-down
  - Explorer links and last-updated context

- Notification Center
  - Real-time alert simulation for: opportunities, security, developer updates, and market news
  - Priority-aware badges (`low` → `critical`) and time-ago display
  - Mark-one and mark-all-as-read interactions
  - High-confidence alpha events fire celebratory toasts with quick navigation

- Community Hub
  - Leaderboards with alpha score, streaks, reputation, and verification badges
  - Social feed with posts, likes, shares, tags, and categories
  - Active challenges with prizes and participation metrics
  - Follow system with curated list of followed hunters

- Developer Feed
  - Categorized updates: frameworks, tools, protocols, security, SDKs
  - Trending topics, releases, and overnight “AI Developer Digest” summary
  - Quick actions: submit new tool, join dev Discord, report vulnerability

- Alpha Vault
  - Saved insights and strategies organized with tabs
  - Analytics callouts for tracking success rate, returns, and source performance

- Settings & Personalization
  - Profile: username, email, avatar, bio
  - Notifications: email, push, sound, Telegram/Discord toggles, priorities
  - Trading: risk tolerance, min-confidence, max-risk level, refresh cadence
  - Appearance: dark/light/system theme, accents, compact mode, animations
  - Data sources: toggle popular sources (TradingView, DefiLlama, CoinGecko, Uniswap, Etherscan)
  - Advanced: API key, webhooks, custom filters; AI options with confidence threshold

- Application Shell & Layout
  - Sidebar navigation (Feed, Radar, Scanner, Vault, Dev Feed, Community)
  - Global Toaster, Notification Center, Settings modal
  - “AI Hunter Active” status with live-scanning indicator

- Error Handling & Reliability
  - Error boundary with user-friendly fallback, dev diagnostics, and recovery actions
  - Ready for external error reporting (e.g., Sentry) in production

## Security & Trust
- Rug Pull Detection: liquidity locks, dev wallet activity, owner privileges
- Honeypot Scanning: selling-disabled pattern detection
- Audit Awareness: verified/pending/unaudited signals
- Source Whitelisting mindset and conservative risk-first filtering philosophy

## Architecture & Code Organization
- Components
  - `Dashboard`, `OpportunityRadar`, `SecurityScanner`, `AlphaVault`, `DeveloperFeed`, `CommunityHub`
  - `Layout`, `NotificationCenter`, `Settings`, `ErrorBoundary`
- Hooks
  - `useAlphaFeed` (generate/refresh/filter signals; voting; high-confidence toasts)
  - `useNotifications` (alerts, priorities, real-time simulation, toasts)
- Types
  - Strong TypeScript models for `User`, `Alert`, `MarketData`, `NewsItem`, and security analysis
- Utilities
  - `cn` helper (class merging), formatting helpers for numbers/currency/percentages, debounce, id generation
- Supabase Edge Function (ready)
  - Hono server with CORS and logging; health endpoint; Deno-compatible

## Tech Stack
- Frontend
  - React 18 + TypeScript
  - Vite 5 with React plugin and manual chunking for code splitting
  - Tailwind CSS v4 (utility-first, modern color system and theming)
  - Radix UI primitives and shadcn-style patterns for accessible components
  - Motion (Framer Motion for React) for polished animations
  - Lucide React icons for consistent iconography
  - Recharts for data visualization (dependency configured, ready for use)
- Data & Integrations (ready hooks)
  - Supabase JS client, real-time/auth ready
  - Viem for on-chain interactions (configured dependency)
  - Axios for HTTP requests
  - TanStack React Query (dependency present for future data fetching)
- Quality & Tooling
  - ESLint + TypeScript ESLint, React hooks rules, React refresh plugin
  - Vitest for unit testing
  - Sentry React dependency available for production error tracking

## Performance & DX
- Code Splitting: vendor chunking (`react-vendor`, `ui-vendor`, `motion-vendor`, `chart-vendor`)
- Sourcemaps for debuggability
- OptimizeDeps includes core libs for faster dev startup
- Responsive design with mobile-first layout and dark mode
- Toast-driven feedback, animated transitions, and accessible controls

## Meta & SEO
- `index.html` includes SEO meta tags, Open Graph, and Twitter cards
- Favicon and descriptive titles for shareability

## Deployment & Commands
- Scripts: `dev`, `build`, `preview`, `lint`, `test`
- Vite dev server on port 3000 with auto-open
- Build outputs to `dist` with sourcemaps
- Ready for modern hosts (Vercel, Netlify, AWS Amplify) and self-hosting

## What You Can Talk About On Your CV
- Built an AI-forward trading intelligence app with modular React components and TypeScript, featuring real-time signal simulation, confidence scoring, and security analysis.
- Implemented risk-aware scanning UX with honeypot and rug-pull metrics, plus audit status tracking.
- Designed a community ecosystem with leaderboards, challenges, social posts, and follow mechanics.
- Created a developer intelligence feed with categorized updates and an AI digest.
- Engineered a comprehensive settings system: notifications, trading prefs, appearance, sources, and advanced AI controls.
- Ensured reliability via ErrorBoundary, priority notifications, and robust UI patterns.
- Optimized performance with code splitting, vendor chunking, and responsive, accessible design.
- Prepared the platform for real backend integration via Supabase and edge functions (Hono/Deno), plus on-chain interactions via Viem.

## Quick Links
- App entry: `src/App.tsx`
- UI entry point: `src/main.tsx`, `src/index.html`
- Styles: `src/index.css`, `src/styles/globals.css`
- Key components: `src/components/*`
- Hooks: `src/hooks/*`
- Config: `vite.config.ts`, `package.json`

---

K9 — your loyal AI companion that never sleeps, always hunting for the next alpha opportunity.