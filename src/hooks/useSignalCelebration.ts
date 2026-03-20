import { useState, useEffect, useRef } from 'react'; 
import { AlphaSignal } from '../types'; 
 
export function useSignalCelebration(signals: AlphaSignal[]) { 
  const [celebrating, setCelebrating] = useState(false); 
  const [activeSignal, setActiveSignal] = useState<AlphaSignal | null>(null); 
  const seenIds = useRef<Set<string>>(new Set()); 
  const queue = useRef<AlphaSignal[]>([]); 
 
  useEffect(() => { 
    const newHigh = signals.filter( 
      s => (s.score ?? s.confidence ?? 0) >= 80 && !seenIds.current.has(s.id) 
    ); 
    newHigh.forEach(s => seenIds.current.add(s.id)); 
 
    if (newHigh.length > 0) { 
      queue.current.push(...newHigh.sort((a, b) => (b.score ?? b.confidence ?? 0) - (a.score ?? a.confidence ?? 0))); 
      if (!celebrating) triggerNext(); 
    } 
  }, [signals, celebrating]); 
 
  function triggerNext() { 
    const next = queue.current.shift(); 
    if (!next) return; 
    setActiveSignal(next); 
    setCelebrating(true); 
  } 
 
  function onCelebrationDone() { 
    setCelebrating(false); 
    setActiveSignal(null); 
    // Small delay before next in queue 
    setTimeout(() => { 
      if (queue.current.length > 0) triggerNext(); 
    }, 500); 
  } 
 
  return { celebrating, activeSignal, onCelebrationDone }; 
} 
