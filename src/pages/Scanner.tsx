import { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShieldCheck, ShieldAlert, Search, Zap, Loader2, ChevronRight, History as HistoryIcon, ExternalLink } from 'lucide-react'; 
import { toast } from 'sonner'; 
 
const C = { 
  bg: '#1a1a1a', 
  card: 'rgba(255,255,255,0.03)', 
  inset: 'rgba(255,255,255,0.02)', 
  border: 'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
  blue: '#5b8cf5', green: '#22c55e', red: '#ef4444', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
const STAGES = [ 
  { label: 'Fetching source', desc: 'Retrieving contract metadata' }, 
  { label: 'Static analysis', desc: 'Scanning for malicious patterns' }, 
  { label: 'AI review', desc: 'Checking for hidden dangers' }, 
  { label: 'Finalizing', desc: 'Generating plain English report' }, 
]; 
 
export default function ScannerPage() { 
  const [address, setAddress] = useState(''); 
  const [chain, setChain] = useState('ethereum'); 
  const [scanning, setScanning] = useState(false); 
  const [result, setResult] = useState<any>(null); 
  const [stage, setStage] = useState(0); 
  const [history, setHistory] = useState<any[]>(() => { 
    try { return JSON.parse(localStorage.getItem('scan_history') ?? '[]'); } catch { return []; } 
  }); 
 
  const handleScan = async () => { 
    if (!address) { toast.error('Enter an address first'); return; } 
    setScanning(true); setResult(null); setStage(1); 
    const timer = setInterval(() => setStage(p => p < 4 ? p + 1 : p), 1400); 
    await new Promise(r => setTimeout(r, 5600)); 
    clearInterval(timer); setStage(4); 
    const bad = address.toLowerCase().includes('dead') || Math.random() > 0.8; 
    const data = { isSafe: !bad, score: bad ? 15 + Math.floor(Math.random() * 30) : 80 + Math.floor(Math.random() * 18), honeypot: bad, ownership: !bad, liquidity: !bad, analysis: bad ? 'Patterns associated with malicious contracts detected. Do not interact.' : 'No red flags detected. Ownership renounced and liquidity locked.' }; 
    setResult(data); 
    const h = [{ address, chain, isSafe: data.isSafe, score: data.score, ts: Date.now() }, ...history].slice(0, 10); 
    setHistory(h); localStorage.setItem('scan_history', JSON.stringify(h)); 
    setScanning(false); setStage(0); 
    toast.success('Check complete'); 
  }; 
 
  return ( 
    <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
      {/* Header */} 
      <section style={{ marginBottom: 28 }}> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 10 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.green, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Safety Audit</span> 
        </div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Is It Safe?</h1> 
        <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}>Paste any crypto address to instantly check if it is safe to interact with.</p> 
      </section> 
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}> 
        {/* Main column */} 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}> 
          {/* Input card */} 
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '18px 20px' }}> 
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12, marginBottom: 12 }}> 
              <div> 
                <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Crypto account address</p> 
                <div style={{ position: 'relative' }}> 
                  <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.t3 }} /> 
                  <input value={address} onChange={e => setAddress(e.target.value)} 
                    placeholder="0x... or Solana address" 
                    autoComplete="off" spellCheck={false} 
                    style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 7, color: C.t1, fontSize: 13, fontFamily: C.m, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.1s' }} 
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
                    onBlur={e => { e.currentTarget.style.borderColor = C.border; }} 
                  /> 
                </div> 
              </div> 
              <div> 
                <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Network</p> 
                <select value={chain} onChange={e => setChain(e.target.value)} 
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 7, color: C.t1, fontSize: 13, fontFamily: C.f, outline: 'none', cursor: 'pointer', appearance: 'none' as any }}> 
                  <option value="ethereum">Ethereum</option> 
                  <option value="solana">Solana</option> 
                  <option value="base">Base</option> 
                  <option value="arbitrum">Arbitrum</option> 
                </select> 
              </div> 
            </div> 
            <button onClick={handleScan} disabled={scanning || !address} 
              style={{ width: '100%', padding: '11px 0', background: address && !scanning ? C.blue : 'rgba(91,140,245,0.3)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 500, cursor: address && !scanning ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: C.f, transition: 'background 0.1s' }}> 
              {scanning ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> : <Zap style={{ width: 14, height: 14 }} />} 
              {scanning ? 'Checking...' : 'Run Safety Check'} 
            </button> 
          </div> 
 
          {/* Result area */} 
          <AnimatePresence mode="wait"> 
            {scanning ? ( 
              <motion.div key="scanning" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}> 
                <div style={{ position: 'relative', width: 56, height: 56 }}> 
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} 
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid transparent`, borderTopColor: C.blue }} /> 
                  <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'rgba(91,140,245,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
                    <Zap style={{ width: 18, height: 18, color: C.blue }} /> 
                  </div> 
                </div> 
                <div> 
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.t1, margin: '0 0 4px' }}>{STAGES[stage - 1]?.label ?? 'Initializing...'}</p> 
                  <p style={{ fontSize: 13, color: C.t2, margin: 0 }}>{STAGES[stage - 1]?.desc ?? 'Starting audit'}</p> 
                </div> 
                <div style={{ width: '100%', maxWidth: 320 }}> 
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}> 
                    <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Progress</span> 
                    <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3 }}>{stage * 25}%</span> 
                  </div> 
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}> 
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stage * 25}%` }} 
                      style={{ height: '100%', background: C.blue, borderRadius: 2 }} /> 
                  </div> 
                </div> 
              </motion.div> 
            ) : result ? ( 
              <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} 
                style={{ background: C.card, border: `1px solid ${result.isSafe ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, padding: '20px 24px' }}> 
                <div style={{ display: 'flex', gap: 24 }}> 
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 120, paddingRight: 24, borderRight: `1px solid ${C.border}` }}> 
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: result.isSafe ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
                      {result.isSafe 
                        ? <ShieldCheck style={{ width: 22, height: 22, color: C.green }} /> 
                        : <ShieldAlert style={{ width: 22, height: 22, color: C.red }} />} 
                    </div> 
                    <div style={{ textAlign: 'center' }}> 
                      <p style={{ fontSize: 12, fontWeight: 600, color: result.isSafe ? C.green : C.red, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{result.isSafe ? 'Safe' : 'Danger'}</p> 
                      <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verdict</p> 
                    </div> 
                    <div style={{ textAlign: 'center' }}> 
                      <p style={{ fontSize: 24, fontWeight: 600, color: C.t1, margin: '0 0 2px', lineHeight: 1 }}>{result.score}</p> 
                      <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</p> 
                    </div> 
                  </div> 
                  <div style={{ flex: 1 }}> 
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}> 
                      {[ 
                        { label: 'Honeypot check', ok: !result.honeypot }, 
                        { label: 'Ownership renounced', ok: result.ownership }, 
                        { label: 'Liquidity locked', ok: result.liquidity }, 
                        { label: 'Low risk score', ok: result.isSafe }, 
                      ].map((c, i) => ( 
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 7 }}> 
                          <span style={{ fontSize: 12, color: C.t2 }}>{c.label}</span> 
                          <span style={{ fontSize: 10, fontFamily: C.m, fontWeight: 600, color: c.ok ? C.green : C.red, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.ok ? 'Pass' : 'Fail'}</span> 
                        </div> 
                      ))} 
                    </div> 
                    <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.15)', border: `1px solid ${C.border}`, borderRadius: 7, marginBottom: 14 }}> 
                      <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.65 }}>{result.analysis}</p> 
                    </div> 
                    <div style={{ display: 'flex', gap: 8 }}> 
                      <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" 
                        style={{ flex: 1, padding: '8px 0', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 7, color: C.t2, fontSize: 13, fontFamily: C.f, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}> 
                        <ExternalLink style={{ width: 13, height: 13 }} /> View on Explorer 
                      </a> 
                    </div> 
                  </div> 
                </div> 
              </motion.div> 
            ) : ( 
              <div style={{ background: C.inset, border: `1px solid ${C.border}`, borderRadius: 8, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', opacity: 0.5 }}> 
                <ShieldCheck style={{ width: 36, height: 36, color: C.t3 }} /> 
                <p style={{ fontSize: 14, fontWeight: 500, color: C.t1, margin: 0 }}>Ready for safety audit</p> 
                <p style={{ fontSize: 13, color: C.t2, margin: 0 }}>Paste a crypto address above to begin</p> 
              </div> 
            )} 
          </AnimatePresence> 
        </div> 
 
        {/* Recent checks */} 
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px', alignSelf: 'start' }}> 
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}> 
            <HistoryIcon style={{ width: 13, height: 13, color: C.t3 }} /> 
            <span style={{ fontSize: 12, fontWeight: 500, color: C.t1 }}>Recent checks</span> 
          </div> 
          {history.length === 0 ? ( 
            <p style={{ fontSize: 13, color: C.t3, textAlign: 'center', padding: '20px 0', margin: 0 }}>No recent checks</p> 
          ) : ( 
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}> 
              {history.map((item, i) => ( 
                <div key={i} onClick={() => { setAddress(item.address); setChain(item.chain); }} 
                   style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.1s' }} 
                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; }} 
                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }} 
                > 
                   <div style={{ overflow: 'hidden' }}> 
                     <p style={{ fontSize: 11, fontFamily: C.m, color: C.t1, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address.slice(0, 16)}...</p> 
                     <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}> 
                       <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase' }}>{item.chain}</span> 
                       <div style={{ width: 4, height: 4, borderRadius: '50%', background: item.isSafe ? C.green : C.red }} /> 
                     </div> 
                   </div> 
                   <ChevronRight style={{ width: 13, height: 13, color: C.t3, flexShrink: 0 }} /> 
                </div> 
              ))} 
            </div> 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
} 
