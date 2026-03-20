import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useK9DataEngine } from '../hooks/useK9DataEngine';
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
  TrendingUp,
  Terminal
} from 'lucide-react';

export function DeveloperFeed() {
  const { signals, loading } = useK9DataEngine();
  const [activeCategory, setActiveCategory] = useState('dev');

  const updates = useMemo(() => {
    return signals.filter(s => {
      if (activeCategory === 'dev') return s.category === 'dev' || s.tags.includes('dev');
      if (activeCategory === 'security') return s.category === 'security' || s.tags.includes('security');
      return true;
    });
  }, [signals, activeCategory]);

  const hotRepos = useMemo(() => {
    return signals
      .filter(s => s.category === 'dev' && s.source === 'HackerNews')
      .slice(0, 5);
  }, [signals]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dev': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dev': return <Code className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Terminal className="h-8 w-8 text-blue-600" />
            Dev Intel
          </h1>
          <p className="text-muted-foreground">
            Latest tools, frameworks, and updates from the Web3 ecosystem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap gap-2">
            {['dev', 'security'].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex items-center gap-2 font-bold uppercase"
              >
                {getCategoryIcon(category)}
                {category === 'dev' ? 'Developer' : 'Security'}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {loading && signals.length === 0 ? (
               Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 h-40 animate-pulse bg-muted/50" />
              ))
            ) : updates.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No dev signals found in the current scan.</p>
              </div>
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
                              {update.confidence >= 80 ? 'HIGH IMPACT' : 'MODERATE IMPACT'}
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
                            <span className="text-sm font-black">{update.confidence} SCORE</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/30 rounded border-l-2 border-l-muted-foreground text-sm italic">
                        {update.summary}
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
                          <a href={update.actionUrl} target="_blank" rel="noreferrer">
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
              {hotRepos.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic uppercase">Scanning GitHub...</p>
              ) : (
                hotRepos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-xs font-black truncate">{repo.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{repo.source}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600 text-[10px]">
                      +{Math.floor(repo.confidence / 2)}%
                    </Badge>
                  </div>
                ))
              )}
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
                  Scanning 8 live sources...
                </p>
              </div>
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
