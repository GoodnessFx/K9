import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSignalStream() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<'live' | 'polling' | 'offline'>('polling');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let attempts = 0;

    function connect() {
      es = new EventSource(`${apiUrl}/api/stream`);

      es.addEventListener('connected', () => {
        setStatus('live');
        attempts = 0;
      });

      es.addEventListener('signal', (e) => {
        try {
          const signal = JSON.parse(e.data);
          qc.setQueryData(['signals'], (old: any) => {
            const list = Array.isArray(old) ? old : old?.data?.signals ?? old?.signals ?? [];
            if (list.some((s: any) => s.id === signal.id)) return old;
            const updated = [signal, ...list].slice(0, 100);
            return Array.isArray(old) ? updated : { ...old, data: { signals: updated } };
          });

          toast(`New Opportunity: ${signal.title}`, {
            description: `Confidence Score: ${signal.score}/100`,
            duration: 5000,
          });
        } catch (err) {
          console.error('SSE parsing error:', err);
        }
      });

      es.addEventListener('stats', (e) => {
        try {
          qc.setQueryData(['stats'], JSON.parse(e.data));
        } catch (err) {}
      });

      es.addEventListener('cri', (e) => {
        try {
          qc.setQueryData(['cri'], JSON.parse(e.data));
        } catch (err) {}
      });

      es.onerror = () => {
        setStatus('offline');
        es.close();
        attempts++;
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        retryTimeout = setTimeout(connect, delay);
      };
    }

    connect();
    return () => {
      es?.close();
      clearTimeout(retryTimeout);
    };
  }, [qc]);

  return { status };
}
