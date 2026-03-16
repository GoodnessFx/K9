import { motion } from 'motion/react';
import { useAlphaFeed } from '../hooks/useAlphaFeed';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  TrendingUp, 
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Zap,
  Target,
  Bookmark
} from 'lucide-react';

export function Dashboard() {
  const { signals, loading, error, filters, setFilters, refreshFeed, upvoteSignal, downvoteSignal } = useAlphaFeed();

  const saveSignal = (signalId: string) => {
    const signal = signals.find(s => s.id === signalId);
    if (signal) {
      toast.success('Alpha saved to vault!', {
        description: (
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1693615775129-f2004d6e3e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGdvbGRlbiUyMHJldHJpZXZlciUyMGRvZyUyMHNtaWxpbmd8ZW58MXx8fHwxNzU4NTUyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Happy Tracedog"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{signal.title}</p>
              <p className="text-sm opacity-80">Added to your Alpha Vault</p>
            </div>
          </div>
        ),
        duration: 4000,
        action: {
          label: 'View Vault',
          onClick: () => {
            // Navigate to vault - in a real app this would use router
            window.location.hash = '/vault';
          }
        }
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'tradfi': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'nft': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'airdrop': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'dev': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Alpha Feed</h1>
          <p className="text-muted-foreground">
            Real-time trading opportunities and market insights from verified sources
          </p>
        </div>
        
        <Button 
          onClick={refreshFeed} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={(value: string) => setFilters({...filters, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
                <SelectItem value="tradfi">TradFi</SelectItem>
                <SelectItem value="nft">NFT</SelectItem>
                <SelectItem value="airdrop">Airdrops</SelectItem>
                <SelectItem value="dev">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Risk Level</label>
            <Select value={filters.risk} onValueChange={(value: string) => setFilters({...filters, risk: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-2 block">
              Min Confidence: {filters.minConfidence}%
            </label>
            <Slider
              value={[filters.minConfidence]}
              onValueChange={([value]: number[]) => setFilters({...filters, minConfidence: value})}
              max={100}
              min={0}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error loading signals</span>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshFeed}
            className="mt-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Alpha Signals */}
      <div className="space-y-4">
        {signals.map((signal, index) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card id={signal.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(signal.category)}>
                        {signal.category.toUpperCase()}
                      </Badge>
                      <Badge className={getRiskColor(signal.risk)}>
                        {getRiskIcon(signal.risk)}
                        {signal.risk.toUpperCase()}
                      </Badge>
                      {signal.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          VERIFIED
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{signal.title}</h3>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{signal.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(signal.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-muted-foreground">{signal.description}</p>

                {/* Details */}
                {(signal.priceTarget || signal.timeframe) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {signal.priceTarget && (
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span>Target: ${signal.priceTarget.toLocaleString()}</span>
                      </div>
                    )}
                    {signal.timeframe && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Timeframe: {signal.timeframe}</span>
                      </div>
                    )}
                    {signal.blockchain && (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{signal.blockchain}</Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {signal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Source: {signal.source}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveSignal(signal.id)}
                      className="flex items-center gap-1"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => upvoteSignal(signal.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {signal.upvotes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downvoteSignal(signal.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {signal.downvotes}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {signals.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">No signals match your filters</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or refresh the feed for new opportunities
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}