import { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
 
interface OnboardingProps { 
  onComplete: () => void; 
} 
 
const BG   = '#070A0F'; 
const SURF = '#0C1119'; 
const LINE = '#1C2B3A'; 
const T1   = '#ECF1F7'; 
const T2   = '#87A0B8'; 
const T3   = '#435E75'; 
const ACC  = '#3B82F6'; 
 
function K9Mark() { 
  return ( 
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none"> 
      <rect x="4" y="5" width="3" height="22" rx="1.5" fill={T1} /> 
      <path d="M7 16L18 6" stroke={T1} strokeWidth="3" strokeLinecap="round" /> 
      <path d="M7 16L18 26" stroke={T1} strokeWidth="3" strokeLinecap="round" /> 
      <circle cx="24" cy="13" r="5.5" stroke={T1} strokeWidth="2.5" fill="none" /> 
      <path d="M29 13V25" stroke={T1} strokeWidth="2.5" strokeLinecap="round" /> 
    </svg> 
  ); 
} 
 
function Card({ children }: { children: React.ReactNode }) { 
  return ( 
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: BG, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: 24, 
    }}> 
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
        style={{ 
          width: '100%', maxWidth: 440, 
          background: SURF, 
          border: `1px solid ${LINE}`, 
          borderRadius: 12, 
          padding: '40px 36px', 
        }} 
      > 
        {children} 
      </motion.div> 
    </div> 
  ); 
} 
 
function Logo() { 
  return ( 
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}> 
      <K9Mark /> 
      <span style={{ 
        fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', 
        color: T1, fontFamily: 'monospace', textTransform: 'uppercase', 
      }}>K9</span> 
    </div> 
  ); 
} 
 
function PrimaryBtn({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) { 
  return ( 
    <button 
      onClick={onClick} 
      disabled={disabled} 
      style={{ 
        width: '100%', padding: '12px 0', 
        background: disabled ? LINE : ACC, 
        color: disabled ? T3 : '#fff', 
        border: 'none', borderRadius: 8, 
        fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', 
        transition: 'background 0.15s', 
        fontFamily: 'system-ui, sans-serif', 
      }} 
    > 
      {children} 
    </button> 
  ); 
} 
 
function SkipBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { 
  return ( 
    <button 
      onClick={onClick} 
      style={{ 
        width: '100%', marginTop: 12, padding: '8px 0', 
        background: 'none', border: 'none', 
        color: T3, fontSize: 13, cursor: 'pointer', 
        fontFamily: 'system-ui, sans-serif', 
      }} 
    > 
      {children} 
    </button> 
  ); 
} 
 
export function Onboarding({ onComplete }: OnboardingProps) { 
  const [step, setStep]       = useState<'welcome' | 'phone' | 'interests' | 'done'>('welcome'); 
  const [phone, setPhone]     = useState(''); 
  const [channel, setChannel] = useState<'whatsapp' | 'telegram'>('whatsapp'); 
  const [interests, setInterests] = useState<string[]>(['all']); 
 
  const INTERESTS = [ 
    { id: 'airdrop',  label: 'Free Money / Airdrops' }, 
    { id: 'job',      label: 'Jobs & Bounties' }, 
    { id: 'insider',  label: 'Insider Signals' }, 
    { id: 'defi',     label: 'Market Moves' }, 
    { id: 'security', label: 'Safety Alerts' }, 
    { id: 'all',      label: 'Everything' }, 
  ]; 
 
  function toggleInterest(id: string) { 
    if (id === 'all') { setInterests(['all']); return; } 
    setInterests(prev => { 
      const without = prev.filter(x => x !== 'all'); 
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id]; 
    }); 
  } 
 
  function complete() { 
    localStorage.setItem('k9_onboarding_done', 'true'); 
    if (phone) localStorage.setItem('k9_user_phone', phone); 
    localStorage.setItem('k9_user_channel', channel); 
    localStorage.setItem('k9_user_interests', JSON.stringify(interests)); 
    onComplete(); 
  } 
 
  const STEP_LABEL: Record<string, string> = { 
    welcome: '01 / 04', phone: '02 / 04', interests: '03 / 04', done: '04 / 04', 
  }; 
 
  return ( 
    <AnimatePresence mode="wait"> 
      {step === 'welcome' && ( 
        <Card key="welcome"> 
          <Logo /> 
          <div style={{ 
            display: 'inline-block', padding: '3px 8px', 
            background: 'rgba(59,130,246,0.12)', 
            border: '1px solid rgba(59,130,246,0.2)', 
            borderRadius: 4, marginBottom: 20, 
          }}> 
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: ACC, letterSpacing: '0.1em' }}> 
              INTELLIGENCE PLATFORM 
            </span> 
          </div> 
          <h1 style={{ 
            fontSize: 26, fontWeight: 700, color: T1, 
            margin: '0 0 12px', lineHeight: 1.25, letterSpacing: '-0.3px', 
          }}> 
            Find it before anyone else. 
          </h1> 
          <p style={{ fontSize: 14, color: T2, margin: '0 0 32px', lineHeight: 1.7 }}> 
            K9 scans crypto markets, airdrops, prediction markets, and job boards 24/7. 
            When it finds something worth your attention, it sends a plain-English 
            message straight to your phone. 
          </p> 
          <div style={{ 
            background: BG, border: `1px solid ${LINE}`, 
            borderRadius: 8, padding: '14px 16px', marginBottom: 32, 
          }}> 
            <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.65 }}> 
              Like the person who made{' '} 
              <span style={{ color: T1, fontWeight: 500 }}>$80,000</span>{' '} 
              by noticing Pentagon pizza deliveries spike at 2am. You're about to get 
              the same alerts. 
            </p> 
          </div> 
          <PrimaryBtn onClick={() => setStep('phone')}>Get started →</PrimaryBtn> 
          <SkipBtn onClick={onComplete}>Skip — browse first</SkipBtn> 
        </Card> 
      )} 
 
      {step === 'phone' && ( 
        <Card key="phone"> 
          <Logo /> 
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: T3, letterSpacing: '0.1em' }}> 
            {STEP_LABEL.phone} 
          </span> 
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T1, margin: '8px 0 6px' }}> 
            Where should K9 send alerts? 
          </h2> 
          <p style={{ fontSize: 14, color: T2, margin: '0 0 28px', lineHeight: 1.6 }}> 
            Enter your number. When K9 finds something, it messages you directly. 
          </p> 
 
          {/* Channel selector */} 
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}> 
            {(['whatsapp', 'telegram'] as const).map(ch => ( 
              <button 
                key={ch} 
                onClick={() => setChannel(ch)} 
                style={{ 
                  flex: 1, padding: '10px 0', 
                  borderRadius: 7, fontSize: 13, fontWeight: 500, 
                  cursor: 'pointer', textTransform: 'capitalize', 
                  border: `1px solid ${channel === ch ? ACC : LINE}`, 
                  background: channel === ch ? 'rgba(59,130,246,0.1)' : BG, 
                  color: channel === ch ? ACC : T2, 
                  transition: 'all 0.12s', 
                  fontFamily: 'system-ui, sans-serif', 
                }} 
              > 
                {ch === 'whatsapp' ? 'WhatsApp' : 'Telegram'} 
              </button> 
            ))} 
          </div> 
 
          {/* Phone input */} 
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder={channel === 'whatsapp' ? '+234 801 234 5678' : '@yourusername'} 
            inputMode="tel" 
            autoComplete="tel" 
            style={{ 
              width: '100%', padding: '11px 14px', 
              background: BG, border: `1px solid ${LINE}`, 
              borderRadius: 8, color: T1, fontSize: 14, 
              marginBottom: 8, boxSizing: 'border-box', 
              outline: 'none', fontFamily: 'system-ui, sans-serif', 
            }} 
            onFocus={e => { e.currentTarget.style.borderColor = ACC; }} 
            onBlur={e => { e.currentTarget.style.borderColor = LINE; }} 
          /> 
          <p style={{ fontSize: 11, color: T3, margin: '0 0 24px', lineHeight: 1.5 }}> 
            {channel === 'whatsapp' 
              ? 'Include country code. Nigeria: +234. UK: +44. US: +1.' 
              : 'Enter your Telegram username (e.g. @yourname).'} 
          </p> 
 
          <PrimaryBtn onClick={() => setStep('interests')}> 
            Continue → 
          </PrimaryBtn> 
          <SkipBtn onClick={() => setStep('interests')}>Skip for now</SkipBtn> 
        </Card> 
      )} 
 
      {step === 'interests' && ( 
        <Card key="interests"> 
          <Logo /> 
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: T3, letterSpacing: '0.1em' }}> 
            {STEP_LABEL.interests} 
          </span> 
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T1, margin: '8px 0 6px' }}> 
            What should K9 hunt for? 
          </h2> 
          <p style={{ fontSize: 14, color: T2, margin: '0 0 24px', lineHeight: 1.6 }}> 
            K9 will prioritise these in your alerts. 
          </p> 
 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}> 
            {INTERESTS.map(({ id, label }) => { 
              const selected = interests.includes(id) || interests.includes('all'); 
              return ( 
                <button 
                  key={id} 
                  onClick={() => toggleInterest(id)} 
                  style={{ 
                    padding: '10px 12px', borderRadius: 7, fontSize: 13, 
                    fontWeight: selected ? 500 : 400, cursor: 'pointer', 
                    textAlign: 'left', fontFamily: 'system-ui, sans-serif', 
                    border: `1px solid ${selected ? ACC : LINE}`, 
                    background: selected ? 'rgba(59,130,246,0.1)' : BG, 
                    color: selected ? T1 : T2, 
                    transition: 'all 0.12s', 
                  }} 
                > 
                  {label} 
                </button> 
              ); 
            })} 
          </div> 
 
          <PrimaryBtn onClick={() => setStep('done')}> 
            Almost done → 
          </PrimaryBtn> 
        </Card> 
      )} 
 
      {step === 'done' && ( 
        <Card key="done"> 
          <div style={{ textAlign: 'center' }}> 
            {/* Animated checkmark */} 
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ type: 'spring', stiffness: 200, damping: 15 }} 
              style={{ 
                width: 56, height: 56, borderRadius: '50%', 
                background: 'rgba(0,191,114,0.12)', 
                border: '1px solid rgba(0,191,114,0.25)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 24px', 
              }} 
            > 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"> 
                <motion.path 
                  d="M4 12L10 18L20 6" 
                  stroke="#00BF72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                  initial={{ pathLength: 0 }} 
                  animate={{ pathLength: 1 }} 
                  transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }} 
                /> 
              </svg> 
            </motion.div> 
 
            <h2 style={{ 
              fontSize: 22, fontWeight: 700, color: T1, 
              margin: '0 0 10px', letterSpacing: '-0.2px', 
            }}> 
              K9 is on the hunt. 
            </h2> 
            <p style={{ fontSize: 14, color: T2, margin: '0 0 32px', lineHeight: 1.65 }}> 
              You're set up. K9 scans every 90 seconds. When it finds something 
              worth your attention, you'll be the first to know. 
            </p> 
 
            <div style={{ 
              background: BG, border: `1px solid ${LINE}`, 
              borderRadius: 8, padding: '12px 16px', 
              marginBottom: 32, textAlign: 'left', 
            }}> 
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> 
                <div style={{ 
                  width: 6, height: 6, borderRadius: '50%', 
                  background: '#00BF72', boxShadow: '0 0 5px #00BF72', 
                }} /> 
                <span style={{ fontSize: 12, color: T2, fontFamily: 'monospace' }}> 
                  Scanning 8 sources · Live now 
                </span> 
              </div> 
            </div> 
 
            <PrimaryBtn onClick={complete}> 
              See what K9 found today → 
            </PrimaryBtn> 
          </div> 
        </Card> 
      )} 
    </AnimatePresence> 
  ); 
} 
