import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useAlphaFeed } from '../hooks/useAlphaFeed';
import { K9Logo } from '../components/K9Logo';

export default function SavedPage() {
  const { signals } = useAlphaFeed();
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('k9_saved') ?? '[]'); }
    catch { return []; }
  });

  const savedSignals = signals.filter(s => savedIds.includes(s.id));

  const removeSignal = (id: string) => {
    const updated = savedIds.filter(sid => sid !== id);
    setSavedIds(updated);
    localStorage.setItem('k9_saved', JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header Section */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-4 h-4 text-purple-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-purple-500 uppercase">Personal Secure Vault</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">Saved Intel</h1>
          </div>
          
          <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black tracking-widest text-white/20 uppercase leading-none">Total Assets</span>
              <span className="text-lg font-bold tabular-nums text-white leading-tight">{savedSignals.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {savedSignals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
            <div className="w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <Bookmark className="w-10 h-10 text-white/10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight uppercase">Vault is empty</h3>
              <p className="text-sm text-white/30 font-medium leading-relaxed">
                Start tracking opportunities in the Dispatch. Your saved intel will appear here for deep analysis.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
            <AnimatePresence mode="popLayout">
              {savedSignals.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-6 p-6 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-all"
                >
                  {/* Category Indicator */}
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6', boxShadow: '0 0 10px rgba(139,92,246,0.4)' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black tracking-widest uppercase text-purple-500">{s.category}</span>
                      <span className="text-[10px] text-white/20 uppercase tabular-nums">• {new Date(s.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-white/40 font-medium truncate mt-0.5">{s.source}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeSignal(s.id)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/20 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-all"
                      title="Remove from Vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a 
                      href={s.source?.startsWith('http') ? s.source : `https://www.google.com/search?q=${encodeURIComponent(s.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-white/90 transition-all active:scale-[0.98]"
                    >
                      <span>ANALYZE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none">
        <K9Logo size={300} />
      </div>
    </div>
  );
}

