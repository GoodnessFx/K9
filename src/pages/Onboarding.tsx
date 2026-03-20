import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageSquare, Send, CheckCircle, ChevronRight, DollarSign, Crosshair, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LogoMark from '../components/LogoMark';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  const next = () => setStep(s => s + 1);
  const finish = () => onComplete();

  return (
    <div className="fixed inset-0 z-[100] bg-bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="p-6 bg-intel/10 rounded-3xl border border-intel/20 ai-glow">
                <LogoMark size={80} animated={true} />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">
                Find it first.<br />Explain it simply.
              </h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                K9 watches the internet for opportunities to make money — before anyone else finds them.
              </p>
              <div className="bg-bg-surface/50 border border-line-1 p-4 rounded-xl text-left italic text-sm text-t3">
                "Like the person who made $80,000 by noticing pizza deliveries to the Pentagon spike at 2am."
              </div>
            </div>
            <button 
              onClick={next}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Get started
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">Where should we send your opportunities?</h2>
              <p className="text-t2 font-sans">Connect your phone to get alerts instantly.</p>
            </div>
            
            <div className="space-y-4">
              <button onClick={next} className="w-full p-6 bg-bg-surface border border-line-1 rounded-2xl flex items-center justify-between hover:border-intel transition-all group relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-safe/10 rounded-xl text-safe">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-sans font-bold text-t1">WhatsApp</h4>
                    <p className="text-xs text-t3 uppercase tracking-widest font-mono">Most people choose this</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-intel/10 flex items-center justify-center group-hover:bg-intel group-hover:text-white transition-all relative z-10">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <div className="absolute inset-0 bg-safe/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button onClick={next} className="w-full p-6 bg-bg-surface border border-line-1 rounded-2xl flex items-center justify-between hover:border-intel transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-intel/10 rounded-xl text-intel">
                    <Send className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-sans font-bold text-t1">Telegram</h4>
                    <p className="text-xs text-t3 uppercase tracking-widest font-mono">Fast and reliable</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-t3 group-hover:text-t1 transition-colors" />
              </button>
            </div>

            <button onClick={next} className="w-full text-center text-t3 hover:text-t1 text-sm font-sans underline transition-colors">
              Skip for now — I'll browse first
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">What interests you most?</h2>
              <p className="text-t2 font-sans">We'll prioritize these signals for you.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Free Money', icon: DollarSign, color: 'text-safe' },
                { label: 'Market Signals', icon: Crosshair, color: 'text-intel' },
                { label: 'Insider Moves', icon: Zap, color: 'text-purple-500' },
                { label: 'Crypto Jobs', icon: Briefcase, color: 'text-t2' },
              ].map((item) => (
                <button key={item.label} onClick={next} className="p-6 bg-bg-surface border border-line-1 rounded-2xl flex flex-col items-center gap-4 hover:border-intel transition-all group">
                  <div className={cn("p-4 rounded-full bg-bg-base border border-line-1 group-hover:scale-110 transition-transform", item.color)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="font-sans font-bold text-sm text-t1">{item.label}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={next}
              className="w-full h-14 bg-bg-elevated border border-line-2 text-t1 rounded-xl font-sans font-bold text-lg hover:bg-bg-subtle transition-all"
            >
              Everything
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-safe/20 rounded-full flex items-center justify-center border-2 border-safe/40 shadow-[0_0_30px_rgba(0,191,114,0.3)]">
                <CheckCircle className="h-12 w-12 text-safe" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">You're set up.</h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                K9 is scanning right now.<br />When something appears, you'll be first to know.
              </p>
            </div>
            <button 
              onClick={finish}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              See what's been found today
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
