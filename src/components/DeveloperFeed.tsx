import { useMemo } from 'react'; 
import { useK9DataEngine } from '../hooks/useK9DataEngine'; 
import { ExternalLink, RefreshCw } from 'lucide-react'; 
 
const C = { 
  card: 'rgba(255,255,255,0.03)', 
  border: 'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
  blue: '#5b8cf5', green: '#22c55e', red: '#ef4444', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
function ago(d: Date) { 
  const s = Math.floor((Date.now() - d.getTime()) / 1000); 
  if (s < 60) return 'just now'; 
  if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
  return `${Math.floor(s / 86400)}d ago`; 
} 
 
export function DeveloperFeed() { 
  const { signals, loading, refreshNow } = useK9DataEngine(); 
  const items = useMemo(() => 
    signals.filter(s => ['dev', 'security'].includes(s.category)).slice(0, 20) 
  , [signals]); 
 
  return ( 
    <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
      <section style={{ marginBottom: 24 }}> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(91,140,245,0.1)', border: '1px solid rgba(91,140,245,0.2)', marginBottom: 10 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live feed</span> 
        </div> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}> 
          <div> 
            <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Tech News</h1> 
            <p style={{ fontSize: 14, color: C.t2, margin: 0 }}>Developer updates, protocol upgrades, and security alerts.</p> 
          </div> 
          <button onClick={refreshNow} disabled={loading} 
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.t2, fontSize: 13, cursor: 'pointer', fontFamily: C.f }}> 
            <RefreshCw style={{ width: 13, height: 13 }} /> 
            Refresh 
          </button> 
        </div> 
      </section> 
 
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
        {loading && items.length === 0 && ( 
          <div style={{ padding: '48px 24px', textAlign: 'center', color: C.t3, fontSize: 13 }}>Loading...</div> 
        )} 
        {!loading && items.length === 0 && ( 
          <div style={{ padding: '48px 24px', textAlign: 'center', color: C.t3, fontSize: 13 }}>Nothing yet — scans every 90 seconds.</div> 
        )} 
        {items.map((s, i) => ( 
          <div key={s.id} 
            style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', alignItems: 'center', gap: '0 12px', padding: '13px 16px', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.1s' }} 
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }} 
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }} 
          > 
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.category === 'security' ? C.red : C.blue, flexShrink: 0 }} /> 
            <div style={{ overflow: 'hidden' }}> 
              <div style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'center' }}> 
                <span style={{ fontSize: 10, fontWeight: 600, color: s.category === 'security' ? C.red : C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: C.m }}> 
                  {s.category === 'security' ? 'Security Alert' : 'Dev Update'} 
                </span> 
                <span style={{ fontSize: 10, color: C.t3 }}>· {ago(s.timestamp)}</span> 
              </div> 
              <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p> 
              <p style={{ fontSize: 12, color: C.t2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.summary}</p> 
            </div> 
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}> 
              <div> 
                <div style={{ fontSize: 13, fontWeight: 700, color: s.confidence >= 85 ? C.green : C.t1, textAlign: 'right' }}>{s.confidence}</div> 
                <div style={{ fontSize: 9, color: C.t3, fontFamily: C.m, textAlign: 'right' }}>CONF</div> 
              </div> 
              {s.actionUrl && ( 
                <a href={s.actionUrl} target="_blank" rel="noopener noreferrer" 
                  style={{ color: C.t3, display: 'flex' }} onClick={e => e.stopPropagation()} 
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
                  <ExternalLink style={{ width: 13, height: 13 }} /> 
                </a> 
              )} 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
} 
