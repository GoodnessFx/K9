import { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Bookmark, Trash2, ExternalLink } from 'lucide-react'; 

export default function SavedPage() { 
  const [savedSignals, setSavedSignals] = useState<any[]>(() => { 
    try { return JSON.parse(localStorage.getItem('saved_opportunities') ?? '[]'); } 
    catch { return []; } 
  }); 

  const removeSignal = (id: string) => { 
    const updated = savedSignals.filter((s: any) => s.id !== id); 
    setSavedSignals(updated); 
    localStorage.setItem('saved_opportunities', JSON.stringify(updated)); 
  }; 

  return ( 
    <div style={{ paddingBottom: 64 }}> 
      <section style={{ marginBottom: 24 }}> 
        <div className="page-badge"><div className="page-badge-dot"/><span className="page-badge-text">Saved</span></div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#E6EDF3', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Saved</h1> 
        <p style={{ fontSize: 13, color: '#8B949E', margin: 0 }}>Opportunities you've bookmarked for later.</p> 
      </section> 

      {savedSignals.length === 0 ? ( 
        <div style={{ textAlign: 'center', padding: '64px 0' }}> 
          <Bookmark style={{ width: 32, height: 32, color: '#484F58', margin: '0 auto 16px' }} /> 
          <p style={{ fontSize: 14, color: '#484F58' }}>Nothing saved yet.</p> 
          <p style={{ fontSize: 13, color: '#484F58', marginTop: 4 }}>Bookmark signals from Dispatch to find them here.</p> 
        </div> 
      ) : ( 
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', background: '#161B22' }}> 
          <AnimatePresence mode="popLayout"> 
            {savedSignals.map((s, i) => ( 
              <motion.div key={s.id} 
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.04 }} 
                style={{ 
                  display: 'grid', gridTemplateColumns: '8px 1fr auto', 
                  alignItems: 'center', gap: '0 12px', 
                  padding: '13px 16px', 
                  borderBottom: i < savedSignals.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', 
                }} 
              > 
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#BC8CFF' }} /> 
                <div style={{ overflow: 'hidden' }}> 
                  <div style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'center' }}> 
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#BC8CFF', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}> 
                      {s.category} 
                    </span> 
                    <span style={{ fontSize: 10, color: '#484F58' }}> 
                      · {new Date(s.timestamp).toLocaleDateString()} 
                    </span> 
                  </div> 
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#E6EDF3', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
                    {s.title} 
                  </p> 
                  <p style={{ fontSize: 12, color: '#8B949E', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> 
                    {s.summary} 
                  </p> 
                </div> 
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}> 
                  {s.actionUrl && ( 
                    <a href={s.actionUrl} target="_blank" rel="noopener noreferrer" 
                      style={{ color: '#484F58', display: 'flex' }} 
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E6EDF3'; }} 
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#484F58'; }} 
                    > 
                      <ExternalLink style={{ width: 13, height: 13 }} /> 
                    </a> 
                  )} 
                  <button onClick={() => removeSignal(s.id)} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#484F58', padding: 3 }} 
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F85149'; }} 
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#484F58'; }} 
                  > 
                    <Trash2 style={{ width: 13, height: 13 }} /> 
                  </button> 
                </div> 
              </motion.div> 
            ))} 
          </AnimatePresence> 
        </div> 
      )} 
    </div> 
  ); 
} 
