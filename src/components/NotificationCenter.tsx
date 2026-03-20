import { motion } from 'motion/react';
import { useNotifications } from '../hooks/useNotifications';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  BellRing,
  AlertTriangle,
  Zap,
  Code,
  Shield,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Alert } from '../types';

export function NotificationCenter() {
  const { alerts, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'dev': return <Code className="h-4 w-4" />;
      case 'opportunity': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'high': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'medium': return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'low': return 'border-gray-300 bg-gray-50 dark:bg-gray-950';
      default: return 'border-gray-300';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-accent/50 ${
                    getPriorityColor(alert.priority)
                  } ${alert.read ? 'opacity-60' : ''}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm leading-tight">
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                        
                        {!alert.read && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(alert.createdAt)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {alert.type}
                          </Badge>
                          {alert.priority === 'critical' && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              <AlertTriangle className="h-2 w-2 mr-1" />
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>

        {alerts.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}