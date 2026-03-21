import { useMemo, useState } from 'react'; 
import { motion } from 'framer-motion'; 
import { useK9DataEngine, K9Signal } from '../hooks/useK9DataEngine'; 
import { ExternalLink, RefreshCw, Bookmark, Send } from 'lucide-react'; 
import { toast } from 'sonner'; 
 
const C = { 
  card:  'rgba(255,255,255,0.03)', 
  elv:   'rgba(255,255,255,0.05)', 
  border:      'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
  green: '#22c55e', blue: '#5b8cf5', purple: '#8b5cf6', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
function timeAgo(d: Date) { 
  const s = Math.floor((Date.now() - d.getTime()) / 1000); 
  if (s < 60) return 'just now'; 
  if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
  return `${Math.floor(s / 86400)}d ago`; 
} 
 
function dotColor(category: string) { 
  if (category === 'airdrop') return C.green; 
  if (category === 'bounty')  return C.purple; 
  return C.blue; 
} 
 
function catLabel(category: string) { 
  if (category === 'airdrop') return 'Airdrop'; 
  if (category === 'bounty')  return 'Bounty'; 
  if (category === 'grant')   return 'Grant'; 
  return 'Free'; 
} 
 
export default function AirdropsPage() { 
  const { signals, loading, refreshNow, activeSources, totalSources } = useK9DataEngine(); 
  const [savedSignals, setSavedSignals] = useState<any[]>(() => { 
    try { return JSON.parse(localStorage.getItem('saved_opportunities') ?? '[]'); } 
    catch { return []; } 
  }); 
 
  const items = useMemo(() => 
    signals.filter(s => ['airdrop', 'bounty', 'grant', 'learn'].includes(s.category)) 
  , [signals]); 
 
  const stats = useMemo(() => ({ 
    total:  items.length, 
    high:   items.filter(s => s.confidence >= 85).length, 
    avg:    items.length ? Math.round(items.reduce((a, s) => a + s.confidence, 0) / items.length) : 0, 
  }), [items]); 
 
  function saveSignal(s: K9Signal) { 
    const isSaved = savedSignals.some(x => x.id === s.id); 
    let updated; 
    if (isSaved) { 
      updated = savedSignals.filter(x => x.id !== s.id); 
      toast.success('Removed from saved'); 
    } else { 
      updated = [...savedSignals, { ...s, savedAt: Date.now() }]; 
      toast.success('Saved'); 
    } 
    setSavedSignals(updated); 
    localStorage.setItem('saved_opportunities', JSON.stringify(updated)); 
  } 
 
  async function sendToPhone(s: K9Signal) { 
    const phone = localStorage.getItem('k9_user_phone'); 
    const ch    = localStorage.getItem('k9_user_channel') ?? 'whatsapp'; 
    if (!phone) { toast.error('No phone connected', { description: 'Go to Settings → Alert Preferences' }); return; } 
    const msg = `K9 found something\n${s.title}\n${s.summary}\nConfidence: ${s.confidence}/100${s.actionUrl ? '\n→ ' + s.actionUrl : ''}\n\nK9 · Find it first`; 
    try { 
      await navigator.clipboard.writeText(msg); 
      toast.success('Copied', { description: `Paste into ${ch === 'whatsapp' ? 'WhatsApp' : 'Telegram'}` }); 
    } catch { toast.error('Copy failed'); } 
  } 
 
  return ( 
    <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
 
      {/* Header */} 
      <section style={{ marginBottom: 24 }}> 
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}> 
          <div> 
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 10 }}> 
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 4px ${C.green}` }} /> 
              <span style={{ fontSize: 10, fontFamily: C.m, color: C.green, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live scanning</span> 
            </div> 
            <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Airdrops</h1> 
            <p style={{ fontSize: 13, color: C.t2, margin: 0 }}> 
              {activeSources}/{totalSources} sources · {items.length} found · Zero cost to claim 
            </p> 
          </div> 
          <button onClick={refreshNow} disabled={loading} 
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.t2, fontSize: 13, cursor: 'pointer', fontFamily: C.f, marginTop: 4 }}> 
            <RefreshCw style={{ width: 13, height: 13 }} className={loading ? 'animate-spin' : ''} /> 
            Refresh 
          </button> 
        </div> 
      </section> 
 
      {/* Stats */} 
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, marginBottom: 20 }}> 
        {[ 
          { label: 'Found today',      value: stats.total, color: C.t1 }, 
          { label: 'High confidence',  value: stats.high,  color: C.green }, 
          { label: 'Avg confidence',   value: stats.avg,   color: C.t1 }, 
        ].map((st, i) => ( 
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px' }}> 
            <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{st.label}</p> 
            <p style={{ fontSize: 22, fontWeight: 600, color: st.color, margin: 0 }}>{st.value}</p> 
          </div> 
        ))} 
      </div> 
 
      {/* Signal list */} 
      {loading && items.length === 0 ? ( 
        <div style={{ textAlign: 'center', padding: '56px 0', color: C.t3, fontSize: 13 }}> 
          Sniffing for airdrops and bounties... 
        </div> 
      ) : items.length === 0 ? ( 
        <div style={{ textAlign: 'center', padding: '56px 0', color: C.t3, fontSize: 13 }}> 
          Nothing yet — K9 scans every 90 seconds. 
        </div> 
      ) : ( 
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
          {items.map((s, i) => { 
            const isSaved = savedSignals.some(x => x.id === s.id); 
            return ( 
              <motion.div key={s.id} 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                transition={{ delay: i * 0.03 }} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '8px 1fr auto', 
                  alignItems: 'center', 
                  gap: '0 12px', 
                  padding: '13px 16px', 
                  borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none', 
                  transition: 'background 0.1s', 
                }} 
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.elv; }} 
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }} 
              > 
                {/* Category dot */} 
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor(s.category), flexShrink: 0 }} /> 
 
                {/* Content */} 
                <div style={{ overflow: 'hidden', minWidth: 0 }}> 
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}> 
                    <span style={{ fontSize: 10, fontWeight: 600, color: dotColor(s.category), textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: C.m }}> 
                      {catLabel(s.category)} 
                    </span> 
                    <span style={{ fontSize: 10, color: C.t3 }}>· {timeAgo(s.timestamp)}</span> 
                    {s.isNew && <span style={{ fontSize: 9, fontFamily: C.m, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(34,197,94,0.1)', padding: '1px 5px', borderRadius: 3 }}>New</span>} 
                  </div> 
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
                    {s.title} 
                  </p> 
                  <p style={{ fontSize: 12, color: C.t2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
                    {s.summary} 
                  </p> 
                </div> 
 
                {/* Actions */} 
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}> 
                  <div style={{ textAlign: 'right' }}> 
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.confidence >= 85 ? C.green : C.t1 }}>{s.confidence}</div> 
                    <div style={{ fontSize: 9, color: C.t3, fontFamily: C.m, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CONF</div> 
                  </div> 
                  <button onClick={() => sendToPhone(s)} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.t3, padding: 3, display: 'flex' }} 
                    title="Send to phone" 
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
                    <Send style={{ width: 13, height: 13 }} /> 
                  </button> 
                  <button onClick={() => saveSignal(s)} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: isSaved ? C.blue : C.t3, padding: 3, display: 'flex' }} 
                    title="Save" 
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isSaved ? C.blue : C.t3; }}> 
                    <Bookmark style={{ width: 13, height: 13, fill: isSaved ? 'currentColor' : 'none' }} /> 
                  </button> 
                  {s.actionUrl && ( 
                    <a href={s.actionUrl} target="_blank" rel="noopener noreferrer" 
                      style={{ color: C.t3, display: 'flex' }} 
                      title="Open link" 
                      onClick={e => e.stopPropagation()} 
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
                      <ExternalLink style={{ width: 13, height: 13 }} /> 
                    </a> 
                  )} 
                </div> 
              </motion.div> 
            ); 
          })} 
        </div> 
      )} 
    </div> 
  ); 
} 
