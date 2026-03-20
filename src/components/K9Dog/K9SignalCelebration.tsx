import { useEffect, useRef, useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti'; 
import { K9DogScene } from './K9DogScene'; 
import { AlphaSignal } from '../../types'; 
 
type DogState = 'idle' | 'running' | 'sniffing' | 'alert' | 'celebrating'; 
 
const CATEGORY_COLORS: Record<string, string> = { 
  airdrop:    '#00C87A', 
  bounty:     '#00C87A', 
  job:        '#3B82F6', 
  insider:    '#8B5CF6', 
  security:   '#F03A5F', 
  polymarket: '#F97316', 
  defi:       '#F59E0B', 
  default:    '#8B5CF6', 
}; 
 
function fireConfetti(category: string, confidence: number) { 
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default; 
  const count = Math.floor((confidence / 100) * 200); 
 
  // Main burst from where dog is 
  confetti({ 
    particleCount: count, 
    spread: 80, 
    origin: { x: 0.85, y: 0.75 }, 
    colors: [color, '#FFFFFF', '#EEF2F7'], 
    gravity: 1.1, 
    scalar: 1.1, 
    drift: 0.2, 
    shapes: ['circle', 'square'], 
    ticks: 250, 
  }); 
 
  // Secondary bursts for high confidence 
  if (confidence >= 85) { 
    setTimeout(() => { 
      confetti({ 
        particleCount: 60, 
        angle: 60, 
        spread: 50, 
        origin: { x: 0.78, y: 0.72 }, 
        colors: [color, '#FFFFFF'], 
        gravity: 1.2, 
        scalar: 0.9, 
        ticks: 200, 
      }); 
    }, 200); 
    setTimeout(() => { 
      confetti({ 
        particleCount: 40, 
        angle: 120, 
        spread: 40, 
        origin: { x: 0.92, y: 0.72 }, 
        colors: [color, '#C4B5FD'], 
        gravity: 1.2, 
        scalar: 0.8, 
        ticks: 180, 
      }); 
    }, 350); 
  } 
} 
 
interface K9SignalCelebrationProps { 
  signal: AlphaSignal | null; 
  active: boolean; 
  onDone: () => void; 
} 
 
export function K9SignalCelebration({ signal, active, onDone }: K9SignalCelebrationProps) { 
  const [dogState, setDogState] = useState<DogState>('idle'); 
  const [position, setPosition] = useState(-300); // off-screen left px 
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]); 
 
  const signalColor = CATEGORY_COLORS[signal?.category ?? 'default'] ?? '#8B5CF6'; 
 
  useEffect(() => { 
    if (!active || !signal) return; 
 
    // Clear any previous 
    timeouts.current.forEach(clearTimeout); 
    timeouts.current = []; 
 
    // T+0: Dog enters running from left 
    setDogState('running'); 
    setPosition(-300); 
 
    const t1 = setTimeout(() => { 
      // T+400ms: Dog slides into view 
      setPosition(0); 
    }, 50); 
 
    const t2 = setTimeout(() => { 
      // T+1200ms: Dog stops, sniffs 
      setDogState('sniffing'); 
    }, 1200); 
 
    const t3 = setTimeout(() => { 
      // T+2000ms: Dog goes ALERT — found it! 
      setDogState('alert'); 
    }, 2000); 
 
    const t4 = setTimeout(() => { 
      // T+2200ms: Particles fire 
      fireConfetti(signal.category, signal.confidence); 
    }, 2200); 
 
    const t5 = setTimeout(() => { 
      // T+2400ms: Celebrating 
      setDogState('celebrating'); 
    }, 2400); 
 
    const t6 = setTimeout(() => { 
      // T+5000ms: Dog runs off right 
      setDogState('running'); 
      setPosition(400); 
    }, 5000); 
 
    const t7 = setTimeout(() => { 
      // T+5800ms: Done 
      setDogState('idle'); 
      setPosition(-300); 
      onDone(); 
    }, 5800); 
 
    timeouts.current = [t1, t2, t3, t4, t5, t6, t7]; 
 
    return () => { timeouts.current.forEach(clearTimeout); }; 
  }, [active, signal, onDone]); 
 
  if (!active && dogState === 'idle') return null; 
 
  return ( 
    <AnimatePresence> 
      {(active || dogState !== 'idle') && ( 
        <motion.div 
          style={{ 
            position: 'fixed', 
            bottom: 60, 
            right: 0, 
            width: 280, 
            height: 200, 
            zIndex: 1000, 
            pointerEvents: 'none', 
          }} 
          animate={{ x: position }} 
          transition={{ 
            type: 'spring', 
            stiffness: position === 0 ? 120 : 200, 
            damping: position === 0 ? 20 : 30, 
          }} 
        > 
          <K9DogScene 
            state={dogState} 
            signalColor={signalColor} 
          /> 
        </motion.div> 
      )} 
    </AnimatePresence> 
  ); 
} 
