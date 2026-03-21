import { useMemo } from 'react'; 
import { motion } from 'framer-motion'; 
import { useK9DataEngine } from '../hooks/useK9DataEngine'; 
import { Activity, TrendingUp, TrendingDown, Layers, ArrowRight, AlertTriangle, Zap, ChevronRight } from 'lucide-react'; 
 
const C = { 
  bg: '#1a1a1a', 
  card: 'rgba(255,255,255,0.03)', 
  cardHover: 'rgba(255,255,255,0.05)', 
  border: 'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', 
  t2: '#8a8a8a', 
  t3: '#555', 
  blue: '#5b8cf5', 
  green: '#22c55e', 
  red: '#ef4444', 
  amber: '#f59e0b', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
export default function HuntPage() { 
  const { signals, loading } = useK9DataEngine(); 
 
  const marketHealth = useMemo(() => { 
    return ['Ethereum', 'Solana', 'Bitcoin', 'Arbitrum', 'Base', 'Polygon'].map(chain => { 
      const cs = signals.filter(s => s.chain === chain || s.tags.includes(chain.toLowerCase())); 
      const score = cs.length 
        ? Math.round(cs.reduce((a, s) => a + s.confidence, 0) / cs.length) 
        : 70 + (chain.length % 15); 
      let status = 'Healthy'; 
      if (score > 85) status = 'Bullish'; 
      else if (score < 60) status = 'High Risk'; 
      else if (score < 75) status = 'Moderate'; 
      return { chain, score, status }; 
    }); 
  }, [signals]); 
 
  const convergence = useMemo(() => 
    signals.filter(s => s.confidence > 80).slice(0, 6).map(s => ({ 
      name: s.title, 
      sources: 2 + (s.tags.length % 3), 
      score: s.confidence, 
      up: s.risk === 'low', 
      url: s.actionUrl, 
    })) 
  , [signals]); 
 
  const anomalies = useMemo(() => 
    signals.filter(s => s.risk === 'critical' || s.confidence > 90).slice(0, 4).map(s => ({ 
      title: s.title, 
      sub: s.token || s.source, 
      risk: s.risk, 
      url: s.actionUrl, 
    })) 
  , [signals]); 
 
  const statusColor = (status: string) => { 
    if (status === 'Bullish')   return C.blue; 
    if (status === 'High Risk') return C.red; 
    if (status === 'Moderate')  return C.amber; 
    return C.green; 
  }; 
 
  return ( 
    <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
 
      {/* Header */} 
      <section style={{ marginBottom: 28 }}> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(91,140,245,0.1)', border: '1px solid rgba(91,140,245,0.2)', marginBottom: 10 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Market Intelligence</span> 
        </div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Hunt</h1> 
        <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6, maxWidth: 520 }}> 
          Market health, convergence signals, and unusual on-chain activity — all in one place. 
        </p> 
      </section> 
 
      {/* Market Health */} 
      <section style={{ marginBottom: 28 }}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}> 
          <Activity style={{ width: 14, height: 14, color: C.t3 }} /> 
          <span style={{ fontSize: 11, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Market Health Index</span> 
        </div> 
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}> 
          {loading && signals.length === 0 
            ? Array.from({ length: 6 }).map((_, i) => ( 
                <div key={i} style={{ height: 110, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }} /> 
              )) 
            : marketHealth.map((item, i) => ( 
                <motion.div key={item.chain} 
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.04 }} 
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.1s' }} 
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; }} 
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }} 
                > 
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}> 
                     <div> 
                       <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: '0 0 2px' }}>{item.chain}</p> 
                       <p style={{ fontSize: 10, fontFamily: C.m, color: statusColor(item.status), margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.status}</p> 
                     </div> 
                     <div style={{ textAlign: 'right' }}> 
                       <p style={{ fontSize: 20, fontWeight: 600, color: C.t1, margin: '0 0 1px', lineHeight: 1 }}>{item.score}</p> 
                       <p style={{ fontSize: 9, fontFamily: C.m, color: C.t3, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</p> 
                     </div> 
                  </div> 
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}> 
                     <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Momentum</span> 
                     <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: item.score > 75 ? C.green : C.red, fontSize: 11, fontFamily: C.m, fontWeight: 500 }}> 
                       {item.score > 75 
                         ? <TrendingUp style={{ width: 11, height: 11 }} /> 
                         : <TrendingDown style={{ width: 11, height: 11 }} />} 
                       {item.score}% 
                     </div> 
                  </div> 
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}> 
                     <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} 
                       style={{ height: '100%', background: statusColor(item.status), borderRadius: 2 }} /> 
                  </div> 
                </motion.div> 
              )) 
          } 
        </div> 
      </section> 
 
      {/* Convergence + Anomalies */} 
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}> 
 
         {/* Where Sources Agree */} 
         <div> 
           <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}> 
             <Layers style={{ width: 14, height: 14, color: C.t3 }} /> 
             <span style={{ fontSize: 11, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Where Sources Agree</span> 
           </div> 
           <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 56px 40px 36px', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}> 
               {['Opportunity', 'Sources', 'Conf', 'Trend', ''].map((h, i) => ( 
                 <span key={i} style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span> 
               ))} 
             </div> 
             {loading && signals.length === 0 
               ? Array.from({ length: 4 }).map((_, i) => ( 
                   <div key={i} style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, opacity: 0.3, background: C.card }} /> 
                 )) 
               : convergence.map((row, i) => ( 
                   <div key={i} 
                     style={{ display: 'grid', gridTemplateColumns: '1fr 80px 56px 40px 36px', alignItems: 'center', padding: '12px 16px', borderBottom: i < convergence.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 0.1s' }} 
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.cardHover; }} 
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }} 
                   > 
                     <p style={{ fontSize: 13, color: C.t1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{row.name}</p> 
                     <div style={{ display: 'flex', gap: 3 }}> 
                       {Array.from({ length: row.sources }).map((_, j) => ( 
                         <div key={j} style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(91,140,245,0.15)', border: '1px solid rgba(91,140,245,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: C.m, color: C.blue }}>S{j + 1}</div> 
                       ))} 
                     </div> 
                     <span style={{ fontSize: 13, fontFamily: C.m, fontWeight: 500, color: C.blue }}>{row.score}</span> 
                     <div style={{ color: row.up ? C.green : C.red }}> 
                       {row.up ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />} 
                     </div> 
                     <button onClick={() => row.url && window.open(row.url, '_blank')} 
                       style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.t3, padding: 2 }} 
                       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }} 
                     > 
                       <ArrowRight style={{ width: 14, height: 14 }} /> 
                     </button> 
                   </div> 
                 )) 
             } 
           </div> 
         </div> 
 
         {/* Unusual Activity */} 
         <div> 
           <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}> 
             <AlertTriangle style={{ width: 14, height: 14, color: C.t3 }} /> 
             <span style={{ fontSize: 11, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Unusual Activity</span> 
           </div> 
           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}> 
             {loading && signals.length === 0 
               ? Array.from({ length: 3 }).map((_, i) => ( 
                   <div key={i} style={{ height: 64, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }} /> 
                 )) 
               : anomalies.map((a, i) => ( 
                   <div key={i} 
                     style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'border-color 0.1s' }} 
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; }} 
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }} 
                     onClick={() => a.url && window.open(a.url, '_blank')} 
                   > 
                     <div style={{ width: 28, height: 28, borderRadius: 6, background: a.risk === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(91,140,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}> 
                       <Zap style={{ width: 13, height: 13, color: a.risk === 'critical' ? C.red : C.blue }} /> 
                     </div> 
                     <div style={{ flex: 1, overflow: 'hidden' }}> 
                       <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p> 
                       <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.sub}</p> 
                     </div> 
                     <ChevronRight style={{ width: 13, height: 13, color: C.t3, flexShrink: 0 }} /> 
                   </div> 
                 )) 
             } 
           </div> 
         </div> 
       </section> 
     </div> 
   ); 
 } 
