import { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Code, 
  GitBranch, 
  Zap, 
  Shield, 
  ExternalLink,
  Clock,
  Users,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { AlphaSignal } from '../types';

export function DeveloperFeed() {
  const [activeCategory, setActiveCategory] = useState('developer');

  const { data: updates = [], isLoading } = useQuery<AlphaSignal[]>({
    queryKey: ['developer-feed', activeCategory],
    queryFn: () => apiClient.getSignals({ category: activeCategory }),
    refetchInterval: 60000,
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'developer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'developer': return <Code className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getTimeAgo = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code className="h-8 w-8 text-blue-600" />
            Developer Feed
          </h1>
          <p className="text-muted-foreground">
            Latest tools, frameworks, and updates from the Web3 ecosystem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap gap-2">
            {['developer', 'security'].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex items-center gap-2 font-bold uppercase"
              >
                {getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 h-40 animate-pulse bg-muted/50" />
              ))
            ) : (
              updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(update.category)}>
                              {getCategoryIcon(update.category)}
                              {update.category.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-orange-600 border-orange-600 font-bold uppercase text-[10px]">
                              {update.score >= 80 ? 'HIGH IMPACT' : 'MODERATE IMPACT'}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-tight">{update.title}</h3>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              {getTimeAgo(update.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-black">{update.score} SCORE</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/30 rounded border-l-2 border-l-muted-foreground text-sm italic">
                        {update.analysis}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(update.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] font-bold bg-muted uppercase">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t">
                        <Button variant="ghost" size="sm" className="font-bold text-xs uppercase" asChild>
                          <a href={update.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Source
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <TrendingUp className="h-5 w-5 text-green-600" />
              HOT REPOS (24H)
            </h3>
            <div className="space-y-3">
              {updates.filter(u => u.source === 'GitHub').slice(0, 5).map((repo) => (
                <div key={repo.id} className="flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-xs font-black truncate">{repo.title.replace('Trending Repo: ', '')}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">GITHUB ACTIVITY</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600 text-[10px]">
                    +{Math.floor(Math.random() * 50)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <Rocket className="h-5 w-5 text-purple-600" />
              AI DEV DIGEST
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs font-bold mb-1 uppercase">Morning Summary</p>
                <p className="text-[10px] text-muted-foreground">
                  Scanning 420+ repos and news sources...
                </p>
              </div>
              <Button size="sm" className="w-full font-bold uppercase text-xs">
                VIEW DIGEST
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-4 uppercase tracking-tighter">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start font-bold uppercase text-[10px]">
                <GitBranch className="h-3 w-3 mr-2" />
                Submit Tool
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-bold uppercase text-[10px]">
                <Users className="h-3 w-3 mr-2" />
                Dev Discord
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start font-bold uppercase text-[10px]">
                <Shield className="h-3 w-3 mr-2" />
                Report Bug
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
