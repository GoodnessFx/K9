import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ChevronRight, 
  CheckCircle,
  DollarSign,
  Send
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const next = () => setStep(s => s + 1);
  const finish = () => {
    localStorage.setItem('has_onboarded', 'true');
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-intel/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-safe/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step === i ? "w-8 bg-intel" : "w-1.5 bg-line-1"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-intel/20 rounded-full flex items-center justify-center border-2 border-intel/40 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Zap className="h-12 w-12 text-intel" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">
                Find it first.<br />Act faster.
              </h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                K9 scans real-time market data to find opportunities before they hit the news.
              </p>
            </div>
            <button 
              onClick={next}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              How it works
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-safe/20 rounded-full flex items-center justify-center border-2 border-safe/40">
                <DollarSign className="h-12 w-12 text-safe" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">Live Data Engine</h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                K9 connects directly to DexScreener, CoinGecko, and DefiLlama to spot volume spikes and high-yield pools instantly.
              </p>
            </div>
            <button 
              onClick={next}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Stay informed
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="h-24 w-24 bg-medium/20 rounded-full flex items-center justify-center border-2 border-medium/40">
                <Send className="h-12 w-12 text-medium" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">Instant Alerts</h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                Connect your WhatsApp or Telegram to receive high-confidence signals directly on your phone.
              </p>
            </div>
            <button 
              onClick={next}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Get started
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
              <h2 className="text-3xl font-display font-bold tracking-tight text-t1 uppercase">Hunting in progress.</h2>
              <p className="text-t2 text-lg leading-relaxed font-sans">
                K9 is scanning live APIs now.<br />New signals will appear on your dashboard instantly.
              </p>
            </div>
            <button 
              onClick={finish}
              className="w-full h-14 bg-intel text-white rounded-xl font-sans font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Start Hunting
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
