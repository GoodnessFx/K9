import { useState } from 'react'; 
import { motion, AnimatePresence } from 'motion/react'; 
import { useAlphaFeed } from '../hooks/useAlphaFeed'; 
import { toast } from 'sonner'; 
import { 
  RefreshCw, Search, X, ChevronRight, 
  ChevronLeft, Bookmark, ExternalLink, 
  AlertTriangle, TrendingUp, 
} from 'lucide-react'; 
import { AlphaSignal } from '../types'; 
import { K9Logo } from './K9Logo'; 
 
// ─── Config ────────────────────────────────────────────────────── 
 
const CAT: Record<string, { label: string; color: string }> = { 
  defi:     { label: 'DeFi',                 color: '#F59E0B' }, 
  airdrop:  { label: 'Airdrops',             color: '#00C87A' }, 
  bounty:   { label: 'Bounty',               color: '#00C87A' }, 
  dev:      { label: 'Jobs',                 color: '#6366F1' }, 
  tradfi:   { label: 'Market',               color: '#EC4899' }, 
  security: { label: 'Safety',               color: '#EF4444' }, 
  nft:      { label: 'NFT',                  color: '#06B6D4' }, 
  insider:  { label: 'Insider',              color: '#8B5CF6' }, 
  whale:    { label: 'Whale',                color: '#14B8A6' }, 
}; 
const RISK: Record<string, string> = { 
  low: '#00C87A', medium: '#F59E0B', high: '#EF4444', critical: '#FF0040', 
}; 
const cat  = (c: string) => CAT[c]  ?? { label: 'Opportunity', color: '#8B5CF6' }; 
const risk = (r: string) => RISK[r] ?? '#F59E0B'; 
 
function ago(d: Date): string { 
  const s = Math.floor((Date.now() - d.getTime()) / 1000); 
  if (s < 60) return 'just now'; 
  if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
  return `${Math.floor(s / 86400)}d ago`; 
} 
 
const TABS = [ 
  { id: 'all',     label: 'All'          }, 
  { id: 'free',    label: 'Free Money'   }, 
  { id: 'jobs',    label: 'Jobs'         }, 
  { id: 'insider', label: 'Insider'      }, 
  { id: 'market',  label: 'Market'       }, 
  { id: 'safety',  label: 'Safety'       }, 
]; 
 
function filterByTab(s: AlphaSignal, tab: string): boolean { 
  if (tab === 'free')    return ['airdrop','bounty','learn','grant'].includes(s.category); 
  if (tab === 'jobs')    return ['dev'].includes(s.category); 
  if (tab === 'insider') return ['insider','whale','polymarket'].includes(s.category); 
  if (tab === 'market')  return ['defi','tradfi','nft'].includes(s.category); 
  if (tab === 'safety')  return s.category === 'security'; 
  return true; 
} 
 
// ─── Stat Card ──────────────────────────────────────────────────── 
 
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) { 
  return ( 
    <div style={{ 
      padding: '12px 14px', border: '1px solid var(--border)', 
      borderRadius: 10, background: 'var(--card)', 
    }}> 
      <p style={{ fontSize: 10, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}> 
        {label} 
      </p> 
      <p style={{ fontSize: 24, fontWeight: 700, color: accent ?? 'var(--foreground)', margin: 0, lineHeight: 1 }}> 
        {value} 
      </p> 
    </div> 
  ); 
} 
 
// ─── Signal Row ─────────────────────────────────────────────────── 
 
function Row({ s, onClick, saved, onSave }: { 
  s: AlphaSignal; onClick: () => void; saved: boolean; onSave: (e: React.MouseEvent) => void; 
}) { 
  const c = cat(s.category); 
  return ( 
    <div 
      onClick={onClick} 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '10px 1fr 70px', 
        gap: '0 14px', 
        alignItems: 'center', 
        padding: '13px 16px', 
        borderBottom: '1px solid color-mix(in srgb, var(--border) 60%, transparent)', 
        cursor: 'pointer', 
        transition: 'background 0.1s', 
      }} 
      onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--muted) 40%, transparent)')} 
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} 
      className="group" 
    > 
      {/* Category dot */} 
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} /> 
 
      {/* Text */} 
      <div style={{ overflow: 'hidden' }}> 
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}> 
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: c.color, textTransform: 'uppercase' }}> 
            {c.label} 
          </span> 
          <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>· {ago(new Date(s.timestamp))}</span> 
        </div> 
        <p style={{ 
          fontSize: 13, fontWeight: 500, margin: '0 0 2px', 
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', 
        }}> 
          {s.title} 
        </p> 
        <p style={{ 
          fontSize: 12, color: 'var(--muted-foreground)', margin: 0, 
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', 
        }}> 
          {s.description} 
        </p> 
      </div> 
 
      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}> 
        <div style={{ textAlign: 'right' }}> 
          <p style={{ 
            fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1, 
            color: s.confidence >= 85 ? '#00C87A' : 'var(--foreground)', 
          }}> 
            {s.confidence} 
          </p> 
          <p style={{ fontSize: 9, color: 'var(--muted-foreground)', margin: 0, letterSpacing: '0.06em' }}> 
            CONF 
          </p> 
        </div> 
        <button 
          onClick={onSave} 
          style={{ 
            border: 'none', background: 'none', cursor: 'pointer', padding: 2, 
            color: saved ? '#8B5CF6' : 'var(--muted-foreground)', 
            opacity: 0.6, transition: 'opacity 0.1s', 
          }} 
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')} 
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')} 
        > 
          <Bookmark style={{ width: 13, height: 13, fill: saved ? '#8B5CF6' : 'none' }} /> 
        </button> 
        <ChevronRight style={{ width: 13, height: 13, color: 'var(--muted-foreground)', opacity: 0.5 }} /> 
      </div> 
    </div> 
  ); 
} 
 
// ─── Signal Detail ─────────────────────────── 
 
function Detail({ s, onBack, saved, onSave }: { 
  s: AlphaSignal; onBack: () => void; saved: boolean; onSave: () => void; 
}) { 
  const c = cat(s.category); 
  const r = risk(s.risk); 
 
  const actions = 
    ['airdrop','bounty'].includes(s.category) 
      ? ['Go to the source link below — check if your wallet is eligible', 'If eligible, claim before the deadline closes', 'Share with friends who use crypto — they may also qualify'] 
      : s.category === 'security' 
        ? ['Do NOT interact with this contract or project', 'If you hold this token, consider exiting your position now', 'Warn others in your community'] 
        : ['Research this before making any decision', 'Check the source link for the latest information', 'Set a reminder to follow up in 24 hours']; 
 
  return ( 
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', stiffness: 320, damping: 32 }} 
      style={{ 
        position: 'fixed', inset: 0, zIndex: 200, 
        background: 'var(--background)', 
        overflowY: 'auto', display: 'flex', flexDirection: 'column', 
      }} 
    > 
      {/* Top bar */} 
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 12, 
        padding: '14px 16px', 
        borderBottom: '1px solid var(--border)', 
        position: 'sticky', top: 0, background: 'var(--background)', zIndex: 1, 
      }}> 
        <button 
          onClick={onBack} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 4, 
            border: 'none', background: 'none', cursor: 'pointer', 
            color: 'var(--muted-foreground)', fontSize: 13, padding: '6px 0', 
          }} 
        > 
          <ChevronLeft style={{ width: 16, height: 16 }} /> 
          Back 
        </button> 
        <div style={{ flex: 1 }} /> 
        <button 
          onClick={onSave} 
          style={{ 
            border: 'none', background: 'none', cursor: 'pointer', 
            color: saved ? '#8B5CF6' : 'var(--muted-foreground)', padding: 6, 
          }} 
        > 
          <Bookmark style={{ width: 16, height: 16, fill: saved ? '#8B5CF6' : 'none' }} /> 
        </button> 
      </div> 
 
      {/* Content */} 
      <div style={{ padding: '20px 16px', maxWidth: 640, margin: '0 auto', width: '100%' }}> 
 
        {/* Category + time */} 
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}> 
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} /> 
          <span style={{ fontSize: 10, fontWeight: 600, color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}> 
            {c.label} 
          </span> 
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>· {ago(new Date(s.timestamp))}</span> 
        </div> 
 
        {/* Title */} 
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px' }}> 
          {s.title} 
        </h1> 
 
        {/* Stats strip */} 
        <div style={{ 
          display: 'flex', gap: 0, 
          border: '1px solid var(--border)', borderRadius: 10, 
          overflow: 'hidden', marginBottom: 20, 
        }}> 
          {[ 
            { label: 'Confidence', value: `${s.confidence}/100`, color: s.confidence >= 85 ? '#00C87A' : undefined }, 
            { label: 'Risk level', value: s.risk.charAt(0).toUpperCase() + s.risk.slice(1), color: r }, 
            ...(s.timeframe ? [{ label: 'Window', value: s.timeframe, color: undefined }] : []), 
          ].map((item, i, arr) => ( 
            <div key={i} style={{ 
              flex: 1, padding: '12px 14px', 
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', 
              background: 'var(--card)', 
            }}> 
              <p style={{ fontSize: 9, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}> 
                {item.label} 
              </p> 
              <p style={{ fontSize: 15, fontWeight: 700, color: item.color ?? 'var(--foreground)', margin: 0 }}> 
                {item.value} 
              </p> 
            </div> 
          ))} 
        </div> 
 
        {/* Description */} 
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted-foreground)', marginBottom: 24 }}> 
          {s.description} 
        </p> 
 
        {/* What you can do */} 
        <div style={{ marginBottom: 24 }}> 
          <p style={{ 
            fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', 
            color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: 12, 
          }}> 
            What you can do 
          </p> 
          {actions.map((a, i) => ( 
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}> 
              <div style={{ 
                width: 22, height: 22, borderRadius: '50%', 
                background: 'var(--muted)', flexShrink: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 11, fontWeight: 700, marginTop: 1, 
              }}> 
                {i + 1} 
              </div> 
              <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{a}</p> 
            </div> 
          ))} 
        </div> 
 
        {/* Source */} 
        <div style={{ 
          padding: '12px 14px', borderRadius: 8, 
          background: 'var(--muted)', marginBottom: 20, 
        }}> 
          <p style={{ fontSize: 10, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 3px' }}> 
            Where K9 found this 
          </p> 
          <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>
            {s.source?.includes('on X') ? '🐕 ' : ''}{s.source}
          </p> 
        </div> 
      </div> 
 
      {/* Sticky footer */} 
      <div style={{ 
        position: 'sticky', bottom: 0, 
        padding: '12px 16px', display: 'flex', gap: 10, 
        borderTop: '1px solid var(--border)', 
        background: 'var(--background)', 
      }}> 
        <a 
          href={ 
            s.source?.startsWith('http') 
              ? s.source 
              : `https://www.google.com/search?q=${encodeURIComponent(s.title)}` 
          } 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            flex: 1, padding: '11px 0', 
            background: '#8B5CF6', color: '#fff', 
            borderRadius: 9, fontSize: 14, fontWeight: 600, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, 
            textDecoration: 'none', 
          }} 
        > 
          <ExternalLink style={{ width: 14, height: 14 }} /> 
          View source 
        </a> 
        <button 
          onClick={onSave} 
          style={{ 
            padding: '11px 18px', 
            background: saved ? 'rgba(139,92,246,0.15)' : 'var(--muted)', 
            border: `1px solid ${saved ? '#8B5CF6' : 'var(--border)'}`, 
            borderRadius: 9, fontSize: 14, fontWeight: 500, 
            cursor: 'pointer', 
            color: saved ? '#8B5CF6' : 'var(--foreground)', 
          }} 
        > 
          {saved ? 'Saved ✓' : 'Save'} 
        </button> 
      </div> 
    </motion.div> 
  ); 
} 
 
// ─── Main Dashboard ─────────────────────────────────────────────── 
 
export function Dashboard() { 
  const { signals, loading, error, refreshFeed } = useAlphaFeed(); 
  const [tab,    setTab]    = useState('all'); 
  const [query,  setQuery]  = useState(''); 
  const [detail, setDetail] = useState<AlphaSignal | null>(null); 
  const [saved,  setSaved]  = useState<Set<string>>(() => { 
    try { return new Set(JSON.parse(localStorage.getItem('k9_saved') ?? '[]')); } 
    catch { return new Set(); } 
  }); 
 
  function toggleSave(id: string, e?: React.MouseEvent) { 
    e?.stopPropagation(); 
    setSaved(prev => { 
      const n = new Set(prev); 
      if (n.has(id)) { 
        n.delete(id); 
        toast('Removed from saves'); 
      } else { 
        n.add(id); 
        toast.success('Saved', { 
          description: ( 
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}> 
              <K9Logo size={28} /> 
              <span>K9 saved it for you</span> 
            </div> 
          ), 
        }); 
      } 
      localStorage.setItem('k9_saved', JSON.stringify([...n])); 
      return n; 
    }); 
  } 
 
  const shown = signals.filter(s => { 
    if (!filterByTab(s, tab)) return false; 
    if (query) { 
      const q = query.toLowerCase(); 
      return s.title.toLowerCase().includes(q) || (s.description?.toLowerCase().includes(q) ?? false); 
    } 
    return true; 
  }); 
 
  const highConf = signals.filter(s => s.confidence >= 85).length; 
  const avg      = signals.length 
    ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length) 
    : 0; 
  const alerts   = signals.filter(s => ['high','critical'].includes(s.risk)).length; 
 
  return ( 
    <> 
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 0 32px' }}> 
 
        {/* Header */} 
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          padding: '18px 0 14px', gap: 12, 
        }}> 
          <div> 
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}> 
              <div style={{ 
                width: 6, height: 6, borderRadius: '50%', background: '#00C87A', 
                boxShadow: '0 0 6px #00C87A', 
                animation: 'pulse 2s ease-in-out infinite', 
              }} /> 
              <span style={{ fontSize: 10, fontWeight: 700, color: '#00C87A', letterSpacing: '0.1em', textTransform: 'uppercase' }}> 
                Hunting live 
              </span> 
            </div> 
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.5px' }}> 
              Dispatch 
            </h1> 
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: 0 }}> 
              {signals.length} opportunities found · {loading ? 'Scanning…' : 'Updated just now'} 
            </p> 
          </div> 
          <button 
            onClick={refreshFeed} 
            disabled={loading} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6, 
              padding: '8px 14px', border: '1px solid var(--border)', 
              borderRadius: 8, background: 'transparent', cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: 13, color: 'var(--foreground)', opacity: loading ? 0.5 : 1, 
              transition: 'opacity 0.15s', 
            }} 
          > 
            <RefreshCw style={{ width: 13, height: 13 }} className={loading ? 'animate-spin' : ''} /> 
            Scan now 
          </button> 
        </div> 
 
        {/* Stats — 2 col mobile, 4 col desktop */} 
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 10, marginBottom: 16, 
        }} className="sm:grid-cols-4"> 
          <Stat label="Found today"     value={signals.length} /> 
          <Stat label="High confidence" value={highConf} accent="#00C87A" /> 
          <Stat label="Avg confidence"  value={avg} /> 
          <Stat label="Safety alerts"   value={alerts} accent={alerts > 0 ? '#EF4444' : undefined} /> 
        </div> 
 
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}> 
          <Search style={{ 
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', 
            width: 13, height: 13, color: 'var(--muted-foreground)', 
          }} /> 
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Search opportunities, tokens, projects…" 
            style={{ 
              width: '100%', padding: '9px 36px 9px 32px', 
              border: '1px solid var(--border)', borderRadius: 8, 
              background: 'var(--background)', color: 'var(--foreground)', 
              fontSize: 13, outline: 'none', boxSizing: 'border-box', 
            }} 
          /> 
          {query && ( 
            <button 
              onClick={() => setQuery('')} 
              style={{ 
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', 
                border: 'none', background: 'none', cursor: 'pointer', 
                color: 'var(--muted-foreground)', padding: 2, 
              }} 
            > 
              <X style={{ width: 13, height: 13 }} /> 
            </button> 
          )} 
        </div> 
 
        {/* Tabs — scroll on mobile */}
        <div style={{ 
          display: 'flex', gap: 6, overflowX: 'auto', 
          scrollbarWidth: 'none', paddingBottom: 2, marginBottom: 14, 
        }} className="filter-scroll"> 
          {TABS.map(t => ( 
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)} 
              style={{ 
                padding: '6px 14px', borderRadius: 20, fontSize: 12, 
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, 
                border: `1px solid ${tab === t.id ? '#8B5CF6' : 'var(--border)'}`, 
                background: tab === t.id ? 'rgba(139,92,246,0.12)' : 'transparent', 
                color: tab === t.id ? '#8B5CF6' : 'var(--muted-foreground)', 
                fontWeight: tab === t.id ? 600 : 400, 
                transition: 'all 0.12s', 
              }} 
            > 
              {t.label} 
            </button> 
          ))} 
        </div> 
 
        {/* Count */}
        <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: '0 0 8px' }}> 
          Showing {shown.length} of {signals.length} 
          {query && ` matching "${query}"`} 
        </p> 
 
        {/* Error */}
        {error && ( 
          <div style={{ 
            padding: '12px 16px', borderRadius: 8, marginBottom: 12, 
            border: '1px solid #EF4444', background: 'rgba(239,68,68,0.08)', 
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, 
          }}> 
            <AlertTriangle style={{ width: 13, height: 13, color: '#EF4444', flexShrink: 0 }} /> 
            <span style={{ flex: 1 }}>{error}</span> 
            <button 
              onClick={refreshFeed} 
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8B5CF6', fontSize: 12 }} 
            > 
              Retry 
            </button> 
          </div> 
        )} 
 
        {/* List */}
        <div style={{ 
          border: '1px solid var(--border)', borderRadius: 10, 
          overflow: 'hidden', background: 'var(--card)', 
        }}> 
          {loading && ( 
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}> 
              K9 is sniffing… 
            </div> 
          )} 
          {!loading && shown.length === 0 && ( 
            <div style={{ padding: '48px 20px', textAlign: 'center' }}> 
              <TrendingUp style={{ width: 28, height: 28, color: 'var(--muted-foreground)', margin: '0 auto 10px', display: 'block' }} /> 
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}> 
                {query ? `Nothing matches "${query}"` : 'K9 is scanning. Opportunities appear every 90 seconds.'} 
              </p> 
            </div> 
          )} 
          {shown.map(s => ( 
            <Row 
              key={s.id} 
              s={s} 
              onClick={() => setDetail(s)} 
              saved={saved.has(s.id)} 
              onSave={e => toggleSave(s.id, e)} 
            /> 
          ))} 
        </div> 
      </div> 
 
      {/* Detail overlay */}
      <AnimatePresence> 
        {detail && ( 
          <> 
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setDetail(null)} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} 
            /> 
            <Detail 
              s={detail} 
              onBack={() => setDetail(null)} 
              saved={saved.has(detail.id)} 
              onSave={() => toggleSave(detail.id)} 
            /> 
          </> 
        )} 
      </AnimatePresence> 
    </> 
  ); 
} 
 
