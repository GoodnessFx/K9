import { useState, useEffect } from 'react'; 
 import { motion, AnimatePresence } from 'framer-motion'; 
 import { Bookmark, Trash2, ExternalLink, Send, RefreshCw } from 'lucide-react'; 
 import { toast } from 'sonner'; 
 
 const C = { 
   bg:     '#1a1a1a', 
   card:   'rgba(255,255,255,0.03)', 
   elv:    'rgba(255,255,255,0.05)', 
   border: 'rgba(255,255,255,0.08)', 
   t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
   green: '#22c55e', blue: '#5b8cf5', purple: '#8b5cf6', 
   red: '#ef4444', amber: '#f59e0b', 
   f: "'Inter', -apple-system, sans-serif", 
   m: "'DM Mono', monospace", 
 }; 
 
 function catDot(category: string): string { 
   if (['airdrop','bounty','grant'].includes(category)) return C.green; 
   if (category === 'job')      return C.blue; 
   if (category === 'insider')  return C.purple; 
   if (category === 'security') return C.red; 
   if (['defi','tradfi','polymarket'].includes(category)) return C.amber; 
   return C.t3; 
 } 
 
 function catLabel(category: string): string { 
   const map: Record<string, string> = { 
     airdrop: 'Airdrop', bounty: 'Bounty', grant: 'Grant', 
     job: 'Job', insider: 'Insider Signal', whale: 'Whale Move', 
     defi: 'Market', tradfi: 'TradFi', polymarket: 'Prediction', 
     security: 'Security Alert', dev: 'Dev Update', nft: 'NFT', 
   }; 
   return map[category] ?? category; 
 } 
 
 function timeAgo(ts: number | string | undefined): string { 
   if (!ts) return ''; 
   const ms = typeof ts === 'string' ? new Date(ts).getTime() : ts; 
   const s = Math.floor((Date.now() - ms) / 1000); 
   if (s < 60) return 'just now'; 
   if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
   if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
   return `${Math.floor(s / 86400)}d ago`; 
 } 
 
 function loadSaved(): any[] { 
   try { return JSON.parse(localStorage.getItem('saved_opportunities') ?? '[]'); } 
   catch { return []; } 
 } 
 
 export default function SavedPage() { 
   const [items, setItems] = useState<any[]>(loadSaved); 
 
   // Re-sync whenever localStorage is written from another component 
   useEffect(() => { 
     const sync = () => setItems(loadSaved()); 
     window.addEventListener('storage', sync); 
     // Also poll every 2s in case same-tab saves aren't triggering storage event 
     const interval = setInterval(sync, 2000); 
     return () => { window.removeEventListener('storage', sync); clearInterval(interval); }; 
   }, []); 
 
   function remove(id: string) { 
     const updated = items.filter(s => s.id !== id); 
     setItems(updated); 
     localStorage.setItem('saved_opportunities', JSON.stringify(updated)); 
     toast.success('Removed'); 
   } 
 
   function clearAll() { 
     if (!confirm('Clear all saved opportunities?')) return; 
     setItems([]); 
     localStorage.setItem('saved_opportunities', '[]'); 
     toast.success('Cleared'); 
   } 
 
   async function sendToPhone(s: any) { 
     const phone = localStorage.getItem('k9_user_phone'); 
     const ch    = localStorage.getItem('k9_user_channel') ?? 'whatsapp'; 
     if (!phone) { 
       toast.error('No phone connected', { description: 'Go to Settings → Alert Preferences' }); 
       return; 
     } 
     const msg = `K9 saved opportunity\n\n${s.title}\n${s.summary ?? ''}\n${s.actionUrl ? '\n→ ' + s.actionUrl : ''}\n\nK9 · Find it first`; 
     try { 
       await navigator.clipboard.writeText(msg); 
       toast.success('Copied!', { description: `Paste into ${ch === 'whatsapp' ? 'WhatsApp' : 'Telegram'}` }); 
     } catch { 
       toast.error('Copy failed'); 
     } 
   } 
 
   // Group by category for overview 
   const groups = items.reduce((acc: Record<string, number>, s) => { 
     const cat = s.category ?? 'signal'; 
     acc[cat] = (acc[cat] ?? 0) + 1; 
     return acc; 
   }, {}); 
 
   return ( 
     <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
 
       {/* Header */} 
       <section style={{ marginBottom: 24 }}> 
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 10 }}> 
           <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.purple }} /> 
           <span style={{ fontSize: 10, fontFamily: C.m, color: C.purple, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your vault</span> 
         </div> 
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}> 
           <div> 
             <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Saved</h1> 
             <p style={{ fontSize: 13, color: C.t2, margin: 0 }}> 
               {items.length === 0 
                 ? 'Opportunities you bookmark appear here instantly.' 
                 : `${items.length} saved · Updated in real time`} 
             </p> 
           </div> 
           {items.length > 0 && ( 
             <div style={{ display: 'flex', gap: 8 }}> 
               <button onClick={() => setItems(loadSaved())} 
                 style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.t2, fontSize: 12, cursor: 'pointer', fontFamily: C.f }}> 
                 <RefreshCw style={{ width: 12, height: 12 }} /> 
                 Sync 
               </button> 
               <button onClick={clearAll} 
                 style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: C.red, fontSize: 12, cursor: 'pointer', fontFamily: C.f }}> 
                 Clear all 
               </button> 
             </div> 
           )} 
         </div> 
       </section> 
 
       {/* Category summary pills */} 
       {items.length > 0 && Object.keys(groups).length > 1 && ( 
         <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}> 
           {Object.entries(groups).map(([cat, count]) => ( 
             <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: C.card, border: `1px solid ${C.border}` }}> 
               <div style={{ width: 5, height: 5, borderRadius: '50%', background: catDot(cat) }} /> 
               <span style={{ fontSize: 11, color: C.t2, fontFamily: C.f }}>{catLabel(cat)}</span> 
               <span style={{ fontSize: 11, color: C.t3, fontFamily: C.m }}>{count}</span> 
             </div> 
           ))} 
         </div> 
       )} 
 
       {/* Empty state */} 
       {items.length === 0 ? ( 
         <div style={{ textAlign: 'center', padding: '64px 24px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}> 
           <Bookmark style={{ width: 32, height: 32, color: C.t3, margin: '0 auto 16px', display: 'block' }} /> 
           <p style={{ fontSize: 15, fontWeight: 500, color: C.t1, margin: '0 0 8px' }}>Nothing saved yet</p> 
           <p style={{ fontSize: 13, color: C.t3, margin: 0, lineHeight: 1.6 }}> 
             Tap the bookmark icon on any signal in Dispatch, Airdrops, or Jobs.<br /> 
             It shows up here immediately. 
           </p> 
         </div> 
       ) : ( 
         <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
           <AnimatePresence mode="popLayout"> 
             {items.map((s: any, i: number) => ( 
               <motion.div key={s.id} 
                 initial={{ opacity: 0, y: 6 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 exit={{ opacity: 0, height: 0, overflow: 'hidden' }} 
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
                 <div style={{ width: 7, height: 7, borderRadius: '50%', background: catDot(s.category ?? ''), flexShrink: 0 }} /> 
 
                 {/* Content */} 
                 <div style={{ overflow: 'hidden', minWidth: 0 }}> 
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}> 
                     <span style={{ fontSize: 10, fontWeight: 600, color: catDot(s.category ?? ''), textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: C.m }}> 
                       {catLabel(s.category ?? 'signal')} 
                     </span> 
                     <span style={{ fontSize: 10, color: C.t3 }}> 
                       · {s.savedAt ? timeAgo(s.savedAt) : (s.timestamp ? timeAgo(s.timestamp) : 'Saved')} 
                     </span> 
                     {s.source && ( 
                       <span style={{ fontSize: 10, color: C.t3 }}>· {s.source}</span> 
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
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}> 
                   {s.confidence && ( 
                     <div style={{ textAlign: 'right' }}> 
                       <div style={{ fontSize: 12, fontWeight: 700, color: Number(s.confidence) >= 85 ? C.green : C.t1 }}>{s.confidence}</div> 
                       <div style={{ fontSize: 9, color: C.t3, fontFamily: C.m, textTransform: 'uppercase' }}>CONF</div> 
                     </div> 
                   )} 
                   <button onClick={() => sendToPhone(s)} 
                     title="Send to phone" 
                     style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.t3, padding: 3, display: 'flex' }} 
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.blue; }} 
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
                     <Send style={{ width: 13, height: 13 }} /> 
                   </button> 
                   {s.actionUrl && ( 
                     <a href={s.actionUrl} target="_blank" rel="noopener noreferrer" 
                       title="Open" 
                       style={{ color: C.t3, display: 'flex' }} 
                       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.t1; }} 
                       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
                       <ExternalLink style={{ width: 13, height: 13 }} /> 
                     </a> 
                   )} 
                   <button onClick={() => remove(s.id)} 
                     title="Remove" 
                     style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.t3, padding: 3, display: 'flex' }} 
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.red; }} 
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.t3; }}> 
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
