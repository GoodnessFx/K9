import { useK9DataEngine } from '../hooks/useK9DataEngine'; 
import { ExternalLink, RefreshCw } from 'lucide-react'; 
 
function timeAgo(date: Date) { 
  const s = Math.floor((Date.now() - date.getTime()) / 1000); 
  if (s < 60) return 'just now'; 
  if (s < 3600) return `${Math.floor(s / 60)}m ago`; 
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; 
  return `${Math.floor(s / 86400)}d ago`; 
} 
 
export default function TechNewsPage() { 
  const { signals, loading, refreshNow } = useK9DataEngine(); 
  const items = signals.filter(s => ['dev', 'security'].includes(s.category)); 
 
  return ( 
    <div className="pb-20"> 
      <section className="mb-8 flex justify-between items-start"> 
        <div> 
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-intel/10 border border-intel/20 rounded mb-3"> 
            <div className="w-1.5 h-1.5 rounded-full bg-safe" /> 
            <span className="text-[10px] font-mono text-intel tracking-[0.1em] uppercase">Live feed</span> 
          </div> 
          <h1 className="text-[28px] font-bold text-t1 mb-2 tracking-tight">Tech News</h1> 
          <p className="text-[14px] text-t2">Developer updates, protocol upgrades, and security alerts.</p> 
        </div> 
        <button onClick={refreshNow} disabled={loading} 
          className="flex items-center gap-1.5 px-3 py-2 border border-line-1 rounded-lg text-t2 text-[13px] hover:border-line-2 hover:text-t1 transition-colors bg-transparent cursor-pointer mt-1"> 
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 
          Refresh 
        </button> 
      </section> 
 
      <div className="bg-bg-surface border border-line-1 rounded-xl overflow-hidden"> 
        {loading && items.length === 0 && ( 
          <div className="py-12 text-center text-t3 text-[13px]">K9 is sniffing for tech news...</div> 
        )} 
        {!loading && items.length === 0 && ( 
          <div className="py-12 text-center text-t3 text-[13px]">No tech news right now. Scans every 90 seconds.</div> 
        )} 
        {items.map((s, i) => ( 
          <div key={s.id} 
            className={`grid gap-x-3 items-center px-5 py-3.5 hover:bg-bg-elevated transition-colors cursor-pointer ${i < items.length - 1 ? 'border-b border-line-1' : ''}`} 
            style={{ gridTemplateColumns: '8px 1fr auto' }} 
          > 
            <div className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ background: s.category === 'security' ? '#F03A5F' : '#3B82F6' }} /> 
            <div className="overflow-hidden"> 
              <div className="flex items-center gap-2 mb-0.5"> 
                <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${s.category === 'security' ? 'text-critical' : 'text-intel'}`}> 
                  {s.category === 'security' ? 'Security Alert' : 'Dev Update'} 
                </span> 
                <span className="text-[10px] text-t3">· {timeAgo(s.timestamp)}</span> 
              </div> 
              <p className="text-[13px] font-medium text-t1 truncate mb-0.5">{s.title}</p> 
              <p className="text-[12px] text-t2 truncate">{s.summary}</p> 
            </div> 
            <div className="flex items-center gap-2.5 flex-shrink-0"> 
              <div className="text-right"> 
                <div className={`text-[13px] font-bold ${s.confidence >= 85 ? 'text-safe' : 'text-t1'}`}>{s.confidence}</div> 
                <div className="text-[9px] text-t3 tracking-[0.06em]">CONF</div> 
              </div> 
              {s.actionUrl && ( 
                <a href={s.actionUrl} target="_blank" rel="noopener noreferrer" 
                  onClick={e => e.stopPropagation()} 
                  className="text-t3 hover:text-t1 transition-colors"> 
                  <ExternalLink className="w-3.5 h-3.5" /> 
                </a> 
              )} 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
} 
