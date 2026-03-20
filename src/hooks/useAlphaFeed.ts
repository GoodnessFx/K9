import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { AlphaSignal } from '../types';

export function useAlphaFeed() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    category: 'all' as string,
    risk: 'all' as string,
    minScore: 0
  });

  const { data: signals = [], isLoading, error, refetch } = useQuery<AlphaSignal[]>({
    queryKey: ['signals', filters],
    queryFn: () => apiClient.getSignals({
      category: filters.category !== 'all' ? filters.category : undefined,
      risk: filters.risk !== 'all' ? filters.risk : undefined,
      minScore: filters.minScore > 0 ? filters.minScore : undefined
    }),
    refetchInterval: 30000, // Real-time refresh every 30s
  });

  const upvoteMutation = useMutation({
    mutationFn: async (signalId: string) => {
      // In a real app, this would call an API
      return signalId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: async (signalId: string) => {
      // In a real app, this would call an API
      return signalId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
    },
  });

  return {
    signals,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    filters,
    setFilters,
    refreshFeed: refetch,
    upvoteSignal: (id: string) => upvoteMutation.mutate(id),
    downvoteSignal: (id: string) => downvoteMutation.mutate(id)
  };
}
