import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { toast } from 'sonner';
import { Alert, AlphaSignal } from '../types';

export function useNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: signals = [] } = useQuery<AlphaSignal[]>({
    queryKey: ['notifications-signals'],
    queryFn: () => apiClient.getSignals({ limit: 10 }),
    refetchInterval: 30000, // Poll every 30s
  });

  // Convert signals to alerts
  useEffect(() => {
    if (signals.length === 0) return;

    const newAlerts: Alert[] = signals.map(s => ({
      id: s.id,
      type: s.category === 'security' ? 'security' : s.category === 'developer' ? 'dev' : 'opportunity',
      title: s.title,
      message: s.summary,
      priority: s.score >= 90 ? 'critical' : s.score >= 80 ? 'high' : s.score >= 60 ? 'medium' : 'low',
      read: false, // In a real app, we'd track this in a DB or localStorage
      createdAt: new Date(s.timestamp),
      actionUrl: s.category === 'security' ? '/verify' : s.category === 'developer' ? '/feed' : '/feed'
    }));

    // Simple deduplication and state update
    setAlerts(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const filteredNew = newAlerts.filter(a => !existingIds.has(a.id));
      
      // Show toast for new high-priority alerts
      filteredNew.forEach(a => {
        if (a.priority === 'critical' || a.priority === 'high') {
          showToast(a);
        }
      });

      return [...filteredNew, ...prev].slice(0, 50);
    });
  }, [signals]);

  useEffect(() => {
    const unread = alerts.filter(alert => !alert.read).length;
    setUnreadCount(unread);
  }, [alerts]);

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const showToast = (alert: Alert) => {
    const toastFunction = alert.priority === 'critical' ? toast.error :
                         alert.priority === 'high' ? toast.warning :
                         toast.info;

    toastFunction(alert.title, {
      description: alert.message,
      action: alert.actionUrl ? {
        label: 'View',
        onClick: () => {
          if (alert.actionUrl) {
            window.location.hash = alert.actionUrl;
          }
        }
      } : undefined
    });
  };

  return {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    showToast
  };
}
