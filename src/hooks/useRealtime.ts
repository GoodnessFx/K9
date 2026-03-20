import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRealtime() {
  const qc = useQueryClient();
  const [live, setLive] = useState(false);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let attempts = 0;

    function connect() {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/stream`;
      es = new EventSource(url);

      es.addEventListener('connected', () => {
        setLive(true);
        attempts = 0;
      });

      es.addEventListener('signal', (e: any) => {
        const signal = JSON.parse(e.data);
        qc.setQueryData(['signals'], (old: any) => {
          const list = Array.isArray(old) ? old : old?.data?.signals ?? old?.signals ?? [];
          return [signal, ...list].slice(0, 100);
        });
        toast(`New Opportunity: ${signal.title}`, {
          description: `Confidence Score: ${signal.score}/100`,
        });
      });

      es.addEventListener('stats', (e: any) => {
        qc.setQueryData(['stats'], JSON.parse(e.data));
      });

      es.addEventListener('cri', (e: any) => {
        qc.setQueryData(['cri'], JSON.parse(e.data));
      });

      es.onerror = () => {
        setLive(false);
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

  return { live };
}
