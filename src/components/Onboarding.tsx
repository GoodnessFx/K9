import { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import LogoMark from './LogoMark'; 
 
export function Onboarding({ onComplete }: { onComplete: () => void }) { 
  const [step, setStep]           = useState<'welcome'|'phone'|'interests'|'done'>('welcome'); 
  const [phone, setPhone]         = useState(''); 
  const [channel, setChannel]     = useState<'whatsapp'|'telegram'>('whatsapp'); 
  const [interests, setInterests] = useState<string[]>(['all']); 
 
  const INTERESTS = [ 
    { id: 'airdrop',  label: 'Free Money' }, 
    { id: 'job',      label: 'Jobs & Bounties' }, 
    { id: 'insider',  label: 'Insider Signals' }, 
    { id: 'defi',     label: 'Market Moves' }, 
    { id: 'security', label: 'Safety Alerts' }, 
    { id: 'all',      label: 'Everything' }, 
  ]; 
 
  function toggleInterest(id: string) { 
    if (id === 'all') { setInterests(['all']); return; } 
    setInterests(prev => { 
      const w = prev.filter(x => x !== 'all'); 
      return w.includes(id) ? w.filter(x => x !== id) : [...w, id]; 
    }); 
  } 
 
  function complete() { 
    localStorage.setItem('k9_onboarding_done', 'true'); 
    if (phone) localStorage.setItem('k9_user_phone', phone); 
    localStorage.setItem('k9_user_channel', channel); 
    localStorage.setItem('k9_user_interests', JSON.stringify(interests)); 
    onComplete(); 
  } 
 
  const Card = ({ children }: { children: React.ReactNode }) => ( 
    <motion.div key={step} 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }} 
      style={{ 
        position: 'fixed', inset: 0, zIndex: 9999, 
        background: '#1a1a1a', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', padding: 20 
      }} 
    > 
      <div style={{ 
        width: '100%', maxWidth: 400, background: '#232323', 
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, 
        padding: '32px 24px' 
      }}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}> 
          <LogoMark size={24} /> 
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', color: '#ececec', fontFamily: 'monospace' }}>K9</span> 
        </div> 
        {children} 
      </div> 
    </motion.div> 
  ); 
 
  const PrimaryBtn = ({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) => ( 
    <button onClick={onClick} disabled={disabled} style={{ 
      width: '100%', padding: '12px', marginTop: 20, borderRadius: 8, 
      fontSize: 14, fontWeight: 600, border: 'none', transition: 'all 0.2s',
      background: disabled ? '#2a2a2a' : '#3b82f6', 
      color: disabled ? '#8a8a8a' : '#ffffff',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }}>{label}</button> 
  ); 
 
  return ( 
    <AnimatePresence mode="wait"> 
      {step === 'welcome' && ( 
        <Card> 
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 6, 
            padding: '4px 10px', background: 'rgba(59,130,246,0.1)', 
            border: '1px solid rgba(59,130,246,0.2)', borderRadius: 4, marginBottom: 16 
          }}> 
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00bf72' }} /> 
            <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em' }}>INTELLIGENCE PLATFORM</span> 
          </div> 
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#ececec', marginBottom: 12, lineHeight: 1.2 }}> 
            Find it before anyone else. 
          </h1> 
          <p style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 20, lineHeight: 1.5 }}> 
            K9 scans 14+ sources every 90 seconds — free airdrops, trading signals, jobs, and insider alerts. Plain English. Straight to your phone. 
          </p> 
          <PrimaryBtn label="Get started →" onClick={() => setStep('phone')} /> 
          <button onClick={onComplete} style={{ 
            width: '100%', marginTop: 12, background: 'none', border: 'none', 
            fontSize: 13, color: '#8a8a8a', cursor: 'pointer' 
          }}>Browse first</button> 
        </Card> 
      )} 
 
      {step === 'phone' && ( 
        <Card> 
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ececec', marginBottom: 8 }}>Where should K9 alert you?</h2> 
          <p style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 24 }}>Enter your contact info to receive real-time signals.</p> 
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}> 
            {(['whatsapp', 'telegram'] as const).map(ch => ( 
              <button key={ch} onClick={() => setChannel(ch)} style={{ 
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500, 
                cursor: 'pointer', transition: 'all 0.2s',
                background: channel === ch ? 'rgba(59,130,246,0.1)' : '#1a1a1a', 
                border: channel === ch ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)', 
                color: channel === ch ? '#3b82f6' : '#a0a0a0' 
              }}> 
                {ch === 'whatsapp' ? 'WhatsApp' : 'Telegram'} 
              </button> 
            ))} 
          </div> 
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} 
            placeholder={channel === 'whatsapp' ? '+1 234 567 8900' : '@username'} 
            style={{ 
              width: '100%', padding: '12px', background: '#2a2a2a', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, 
              color: '#ececec', fontSize: 14, outline: 'none', boxSizing: 'border-box' 
            }} 
          /> 
          <PrimaryBtn label="Continue →" onClick={() => setStep('interests')} /> 
        </Card> 
      )} 
 
      {step === 'interests' && ( 
        <Card> 
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ececec', marginBottom: 8 }}>What should K9 hunt for?</h2> 
          <p style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 20 }}>Select your primary interests.</p> 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}> 
            {INTERESTS.map(({ id, label }) => { 
              const sel = interests.includes(id) || interests.includes('all'); 
              return ( 
                <button key={id} onClick={() => toggleInterest(id)} style={{ 
                  padding: '12px 10px', borderRadius: 8, fontSize: 12, textAlign: 'left', 
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: sel ? 'rgba(59,130,246,0.1)' : '#1a1a1a', 
                  border: sel ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)', 
                  color: sel ? '#ececec' : '#a0a0a0' 
                }}>{label}</button> 
              ); 
            })} 
          </div> 
          <PrimaryBtn label="Finish →" onClick={() => setStep('done')} /> 
        </Card> 
      )} 
 
      {step === 'done' && ( 
        <Card> 
          <div style={{ textAlign: 'center' }}> 
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,191,114,0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
            }}> 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00bf72" strokeWidth="3"> 
                <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" /> 
              </svg> 
            </div> 
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ececec', marginBottom: 8 }}>K9 is on the hunt.</h2> 
            <p style={{ fontSize: 14, color: '#a0a0a0', marginBottom: 24 }}>Scanning 14+ sources every 90 seconds. We'll alert you the moment we find a match.</p> 
            <button onClick={complete} style={{ 
              width: '100%', padding: '14px', background: '#ececec', color: '#1a1a1a', 
              borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' 
            }}>Enter Dashboard</button> 
          </div> 
        </Card> 
      )} 
    </AnimatePresence> 
  ); 
 } 
