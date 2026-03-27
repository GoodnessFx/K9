import { useMemo, useState } from 'react'; 
import { motion } from 'framer-motion'; 
import { useK9DataEngine, K9Signal } from '../hooks/useK9DataEngine'; 
import { ExternalLink, RefreshCw, Bookmark, Send, ShieldCheck } from 'lucide-react'; 
import { toast } from 'sonner'; 
 
const C = { 
  card:  'var(--card)', 
  elv:   'var(--accent)', 
  border:      'var(--border)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: 'var(--foreground)', t2: 'var(--muted-foreground)', t3: '#555', 
  green: '#00C87A', blue: '#8B5CF6', 
  f: "var(--font-sans)", 
  m: "var(--font-mono)", 
}; 
 
function timeAgo(d: Date) { 
  const s = Math.floor((Date.now() - d.getTime()) / 1000); 
  if (s < 60) return 'just now'; 
  if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
  return `${Math.floor(s / 86400)}d ago`; 
} 
 
function isNoExp(s: K9Signal) { 
  return /community|moderator|social|writer|translator|content|discord/i.test(s.title + ' ' + (s.summary ?? '')); 
} 

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--color-safe)' : score >= 60 ? 'var(--color-medium)' : 'var(--color-critical)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, background: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` }}>
      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color, fontWeight: 600 }}>{score}% MATCH</span>
    </div>
  );
}

function VerifiedBadge() {
  const color = 'var(--color-safe)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      <ShieldCheck style={{ width: 10, height: 10, color }} />
      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color, fontWeight: 600 }}>VERIFIED</span>
    </div>
  );
}
 
export default function JobsPage() { 
  const { signals, loading, refreshNow, activeSources, totalSources } = useK9DataEngine(); 
  const [savedSignals, setSavedSignals] = useState<any[]>(() => { 
    try { return JSON.parse(localStorage.getItem('saved_opportunities') ?? '[]'); } 
    catch { return []; } 
  }); 
 
  const items = useMemo(() => 
    signals.filter(s => s.category === 'job') 
  , [signals]); 
 
  const stats = useMemo(() => ({ 
    total:  items.length, 
    remote: items.filter(s => /remote/i.test(s.summary ?? '')).length, 
    noExp:  items.filter(isNoExp).length, 
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
    const msg = `K9 found a job\n${s.title}\n${s.summary}\nConfidence: ${s.confidence}/100${s.actionUrl ? '\n→ ' + s.actionUrl : ''}\n\nK9 · Find it first`; 
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(91,140,245,0.1)', border: '1px solid rgba(91,140,245,0.2)', marginBottom: 10 }}> 
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 4px ${C.green}` }} /> 
              <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trust-First Marketplace</span> 
            </div> 
            <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Jobs</h1> 
            <p style={{ fontSize: 13, color: C.t2, margin: 0 }}> 
              {activeSources}/{totalSources} sources · Real work, verified people 
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
          { label: 'Verified roles', value: stats.total,  color: C.t1 }, 
          { label: 'Remote gigs',    value: stats.remote, color: C.t1 }, 
          { label: 'No experience',  value: stats.noExp,  color: C.t1 }, 
        ].map((s, i) => ( 
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px' }}> 
            <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p> 
            <p style={{ fontSize: 18, fontWeight: 600, color: s.color, margin: 0 }}>{s.value}</p> 
          </div> 
        ))} 
      </div> 
 
      {/* Signal list */} 
      {loading && items.length === 0 ? ( 
        <div style={{ textAlign: 'center', padding: '56px 0', color: C.t3, fontSize: 13 }}> 
          Sniffing for jobs... 
        </div> 
      ) : items.length === 0 ? ( 
        <div style={{ textAlign: 'center', padding: '56px 0', color: C.t3, fontSize: 13 }}> 
          No jobs right now — K9 scans every 90 seconds. 
        </div> 
      ) : ( 
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
          {items.map((s, i) => { 
            const isSaved  = savedSignals.some(x => x.id === s.id); 
            const noExpTag = isNoExp(s); 
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
                {/* Dot */} 
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.blue, flexShrink: 0 }} /> 
 
                {/* Content */} 
                <div style={{ overflow: 'hidden', minWidth: 0 }}> 
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}> 
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: C.m }}> 
                      {s.source} 
                    </span> 
                    <span style={{ fontSize: 10, color: C.t3 }}>· {timeAgo(s.timestamp)}</span> 
                    {s.confidence >= 80 && <VerifiedBadge />}
                    <MatchBadge score={s.confidence} />
                    {noExpTag && ( 
                      <span style={{ fontSize: 9, fontFamily: C.m, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(34,197,94,0.1)', padding: '1px 5px', borderRadius: 3 }}> 
                        No exp 
                       </span> 
                    )} 
                    {s.isNew && ( 
                      <span style={{ fontSize: 9, fontFamily: C.m, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(91,140,245,0.1)', padding: '1px 5px', borderRadius: 3 }}> 
                        New 
                       </span> 
                    )} 
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
                  {s.confidence >= 70 && (
                    <div style={{ textAlign: 'right' }}> 
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.confidence >= 85 ? C.green : C.t1 }}>{s.confidence}</div> 
                      <div style={{ fontSize: 9, color: C.t3, fontFamily: C.m, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CONF</div> 
                    </div> 
                  )}
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
                      title="Apply" 
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
