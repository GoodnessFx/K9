import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Signal } from '../types';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function SavedPage() {
  const [savedSignals, setSavedSignals] = useState<Signal[]>(() => {
    const data = localStorage.getItem('saved_opportunities');
    return data ? JSON.parse(data) : [];
  });

  const removeSignal = (id: string) => {
    const updated = savedSignals.filter(s => s.id !== id);
    setSavedSignals(updated);
    localStorage.setItem('saved_opportunities', JSON.stringify(updated));
  };

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto px-4 lg:px-8">
      {/* Page Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-intel/10 border border-intel/20">
            <Bookmark className="h-5 w-5 text-intel" />
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-t2">Personal Vault</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-semibold tracking-tight text-t1 uppercase">Saved</h2>
            <p className="text-t2 max-w-xl text-sm leading-relaxed">
              Your personal list of opportunities you're watching or planning to act on.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {savedSignals.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="p-4 bg-bg-surface border border-line-1 rounded-full text-t3">
              <Bookmark className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-sans font-medium text-t1 uppercase">Vault is empty</h3>
              <p className="text-sm font-sans text-t2">Bookmark opportunities from the Feed to save them for later analysis.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {savedSignals.map((signal, i) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 group"
              >
                <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-bg-inset border border-line-1 shrink-0">
                  <span className="text-[10px] font-mono text-t3 uppercase leading-none mb-1">Score</span>
                  <span className={cn(
                    "text-xl font-display font-bold",
                    (signal.score || signal.confidence || 0) >= 80 ? "text-safe" : "text-medium"
                  )}>{signal.score || signal.confidence || 0}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-t3 uppercase tracking-wider">{signal.category || 'Opportunity'}</span>
                    <span className="h-1 w-1 rounded-full bg-line-2" />
                    <span className="text-[10px] font-mono text-t3 uppercase">{new Date(signal.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-sans font-medium text-t1 truncate group-hover:text-intel transition-colors">
                    {signal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-line-1 sm:ml-auto">
                  <button 
                    onClick={() => removeSignal(signal.id)}
                    className="p-2.5 rounded bg-bg-inset border border-line-1 text-t3 hover:text-critical hover:border-critical/40 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-intel text-white rounded font-sans font-medium text-sm hover:opacity-90 transition-opacity">
                    <span>Analyze</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
