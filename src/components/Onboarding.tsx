import { useState } from 'react'; 
import { motion } from 'framer-motion'; 
import { K9Logo } from './K9Logo'; 
 
interface OnboardingProps { 
  onComplete: () => void; 
} 
 
export function Onboarding({ onComplete }: OnboardingProps) { 
  const [step, setStep] = useState<'welcome' | 'phone' | 'interests' | 'done'>('welcome'); 
  const [phone, setPhone] = useState(''); 
  const [channel, setChannel] = useState<'whatsapp' | 'telegram'>('whatsapp'); 
 
  if (step === 'welcome') return ( 
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: '#07090D', 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      gap: 0, 
    }}> 
      {/* K9 Logo — hero of the onboarding */} 
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
        style={{ width: 340, height: 260, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
      > 
        <K9Logo size={160} animated={true} />
      </motion.div> 
 
      {/* Text below dog */} 
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }} 
        style={{ textAlign: 'center', padding: '0 32px', maxWidth: 400 }} 
      > 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}> 
          <K9Logo size={24} animated={true} /> 
          <span style={{ fontSize: 28, fontWeight: 700, color: '#EEF2F7', letterSpacing: '-0.5px' }}>K9</span> 
        </div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#EEF2F7', margin: '0 0 10px', lineHeight: 1.3 }}> 
          Find it before anyone else. 
        </h1> 
        <p style={{ fontSize: 15, color: '#8A9BB0', margin: '0 0 28px', lineHeight: 1.6 }}> 
          K9 sniffs out crypto opportunities — free airdrops, insider signals, 
          prediction market edges — and sends them straight to your phone. 
        </p> 
        <button 
          onClick={() => setStep('phone')} 
          style={{ 
            background: '#8B5CF6', 
            color: '#FFFFFF', 
            border: 'none', 
            borderRadius: 8, 
            padding: '14px 32px', 
            fontSize: 15, 
            fontWeight: 600, 
            cursor: 'pointer', 
            width: '100%', 
            maxWidth: 280, 
          }} 
        > 
          Get started → 
        </button> 
        <button 
          onClick={onComplete} 
          style={{ 
            background: 'none', border: 'none', 
            color: '#4A5A6B', fontSize: 13, 
            cursor: 'pointer', marginTop: 12, padding: 8, 
          }} 
        > 
          Skip — browse first 
        </button> 
      </motion.div> 
    </div> 
  ); 
 
  if (step === 'phone') return ( 
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: '#07090D', 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      padding: 24, 
    }}> 
      {/* Alert logo */} 
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        style={{ width: 180, height: 140, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
      > 
        <K9Logo size={100} animated={true} />
      </motion.div> 
 
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        style={{ width: '100%', maxWidth: 360, textAlign: 'center' }} 
      > 
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#EEF2F7', margin: '0 0 8px' }}> 
          Where should K9 send alerts? 
        </h2> 
        <p style={{ fontSize: 14, color: '#8A9BB0', margin: '0 0 24px' }}> 
          When K9 finds something, it messages you directly. 
        </p> 
 
        {/* Channel selector */} 
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}> 
          {(['whatsapp', 'telegram'] as const).map(ch => ( 
            <button 
              key={ch} 
              onClick={() => setChannel(ch)} 
              style={{ 
                flex: 1, padding: '10px 0', 
                borderRadius: 8, 
                border: `1px solid ${channel === ch ? '#8B5CF6' : '#1C2A38'}`, 
                background: channel === ch ? 'rgba(139,92,246,0.15)' : 'transparent', 
                color: channel === ch ? '#C4B5FD' : '#8A9BB0', 
                fontSize: 13, fontWeight: 500, cursor: 'pointer', 
                textTransform: 'capitalize', 
              }} 
            > 
              {ch === 'whatsapp' ? '📱 WhatsApp' : '✈️ Telegram'} 
            </button> 
          ))} 
        </div> 
 
        <input 
          type="tel" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          placeholder={channel === 'whatsapp' ? '+234 801 234 5678' : '@yourusername'} 
          style={{ 
            width: '100%', padding: '14px 16px', 
            background: '#0D1117', 
            border: '1px solid #1C2A38', 
            borderRadius: 8, 
            color: '#EEF2F7', fontSize: 15, 
            marginBottom: 12, 
            boxSizing: 'border-box', 
          }} 
          inputMode="tel" 
          autoComplete="tel" 
        /> 
 
        <button 
          onClick={() => { setStep('done'); }} 
          disabled={!phone} 
          style={{ 
            width: '100%', padding: '14px 0', 
            background: phone ? '#8B5CF6' : '#1C2A38', 
            color: phone ? '#FFFFFF' : '#4A5A6B', 
            border: 'none', borderRadius: 8, 
            fontSize: 15, fontWeight: 600, cursor: phone ? 'pointer' : 'default', 
            marginBottom: 8, 
          }} 
        > 
          Connect → 
        </button> 
        <button 
          onClick={onComplete} 
          style={{ 
            background: 'none', border: 'none', 
            color: '#4A5A6B', fontSize: 13, cursor: 'pointer', padding: 8, 
          }} 
        > 
          Skip 
        </button> 
      </motion.div> 
    </div> 
  ); 
 
  // Done step 
  return ( 
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: '#07090D', 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
    }}> 
      <motion.div 
        style={{ width: 260, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 200, damping: 15 }} 
      > 
        <K9Logo size={140} animated={true} />
      </motion.div> 
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }} 
        style={{ textAlign: 'center', padding: '0 24px' }} 
      > 
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#EEF2F7', margin: '0 0 8px' }}> 
          K9 is on the hunt. 
        </h2> 
        <p style={{ fontSize: 14, color: '#8A9BB0', margin: '0 0 24px' }}> 
          You'll be the first to know. 
        </p> 
        <button 
          onClick={onComplete} 
          style={{ 
            background: '#8B5CF6', color: '#FFF', 
            border: 'none', borderRadius: 8, 
            padding: '14px 32px', fontSize: 15, fontWeight: 600, 
            cursor: 'pointer', 
          }} 
        > 
          See what K9 found today → 
        </button> 
      </motion.div> 
    </div> 
  ); 
} 
