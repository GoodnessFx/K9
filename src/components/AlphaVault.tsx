import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Archive,
  Search,
  Bookmark,
  TrendingUp,
  Star,
  Filter,
  Download,
  Share,
  Tag,
  Calendar,
  BarChart3
} from 'lucide-react';
import { AlphaSignal } from '../types';

const savedSignals: AlphaSignal[] = [
  {
    id: '1',
    title: 'LayerZero Airdrop Strategy Complete',
    description: 'Successfully executed multi-chain bridge strategy. 47 transactions across 8 chains completed.',
    source: 'Personal Strategy',
    category: 'airdrop',
    risk: 'low',
    confidence: 92,
    timestamp: new Date('2024-01-15'),
    tags: ['airdrop', 'layerzero', 'strategy', 'completed'],
    verified: true,
    upvotes: 0,
    downvotes: 0,
    timeframe: 'completed'
  },
  {
    id: '2',
    title: 'Arbitrum Ecosystem Gem: GMX Protocol',
    description: 'GMX showing strong fundamentals. Real yield, growing TVL, and upcoming V2 launch.',
    source: 'DeFi Research',
    category: 'defi',
    risk: 'medium',
    confidence: 85,
    timestamp: new Date('2024-01-10'),
    tags: ['arbitrum', 'gmx', 'perpetuals', 'real-yield'],
    verified: true,
    upvotes: 23,
    downvotes: 2,
    priceTarget: 85,
    timeframe: '3-6 months'
  },
  {
    id: '3',
    title: 'Solana Mobile Saga Phone Analysis',
    description: 'Deep dive into Solana phone ecosystem. Hardware wallet integration and exclusive airdrops make this compelling.',
    source: 'Hardware Analysis',
    category: 'nft',
    risk: 'high',
    confidence: 72,
    timestamp: new Date('2024-01-08'),
    tags: ['solana', 'mobile', 'hardware', 'ecosystem'],
    verified: false,
    upvotes: 156,
    downvotes: 34,
    timeframe: '6-12 months'
  },
  {
    id: '4',
    title: 'AI Token Narrative Thesis',
    description: 'Comprehensive analysis of AI token sector. Focus on compute, data, and infrastructure plays.',
    source: 'Sector Analysis',
    category: 'defi',
    risk: 'medium',
    confidence: 78,
    timestamp: new Date('2024-01-05'),
    tags: ['ai', 'narrative', 'compute', 'infrastructure'],
    verified: true,
    upvotes: 89,
    downvotes: 12,
    timeframe: '6-18 months'
  },
  {
    id: '5',
    title: 'Bitcoin Ordinals Market Cycle',
    description: 'Analysis of Ordinals inscription trends and market cycles. Key metrics for timing entries.',
    source: 'NFT Research',
    category: 'nft',
    risk: 'high',
    confidence: 68,
    timestamp: new Date('2024-01-03'),
    tags: ['bitcoin', 'ordinals', 'nft', 'cycles'],
    verified: true,
    upvotes: 45,
    downvotes: 8,
    timeframe: '2-4 months'
  }
];

const performanceData = {
  totalSaved: 247,
  successRate: 73,
  avgReturn: 34.2,
  topPerformer: 'LayerZero Strategy (+127%)'
};

export function AlphaVault() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('saved');

  const allTags = Array.from(new Set(savedSignals.flatMap(signal => signal.tags)));
  
  const filteredSignals = savedSignals.filter(signal => {
    const matchesSearch = signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         signal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => signal.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8 text-purple-600" />
            Alpha Vault
          </h1>
          <p className="text-muted-foreground">
            Your personal collection of saved insights, strategies, and alpha signals
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Archive className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Total Saved</span>
          </div>
          <p className="text-2xl font-bold">{performanceData.totalSaved}</p>
          <p className="text-sm text-muted-foreground">Alpha signals</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-medium">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{performanceData.successRate}%</p>
          <p className="text-sm text-muted-foreground">Profitable signals</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Avg Return</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">+{performanceData.avgReturn}%</p>
          <p className="text-sm text-muted-foreground">Per signal</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="font-medium">Top Performer</span>
          </div>
          <p className="text-sm font-bold">{performanceData.topPerformer}</p>
          <p className="text-sm text-muted-foreground">Best signal</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="saved">Saved Signals</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your saved alpha..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              {/* Tag Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Filter by Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Saved Signals */}
          <div className="space-y-4">
            {filteredSignals.map((signal, index) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(signal.category)}>
                            {signal.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            <Bookmark className="h-3 w-3 mr-1" />
                            SAVED
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{signal.title}</h3>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {signal.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        {signal.confidence && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{signal.confidence}% confidence</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground">{signal.description}</p>

                    {/* Details */}
                    {(signal.priceTarget || signal.timeframe) && (
                      <div className="flex flex-wrap gap-4 text-sm">
                        {signal.priceTarget && (
                          <span>Target: ${signal.priceTarget.toLocaleString()}</span>
                        )}
                        {signal.timeframe && signal.timeframe !== 'completed' && (
                          <span>Timeframe: {signal.timeframe}</span>
                        )}
                        {signal.timeframe === 'completed' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            ✓ COMPLETED
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {signal.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Source: {signal.source}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredSignals.length === 0 && (
            <Card className="p-8 text-center">
              <div className="space-y-2">
                <Archive className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold">No saved signals found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedTags.length > 0 
                    ? "Try adjusting your search or filters"
                    : "Start saving alpha signals to build your vault"
                  }
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Strategy Builder</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create and backtest trading strategies using your saved alpha signals. 
                Track performance and optimize your approach.
              </p>
              <Button className="mt-4">
                Create New Strategy
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Performance Analytics</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Deep dive into your alpha hunting performance. Track success rates, 
                returns, and identify your most profitable signal sources.
              </p>
              <Button className="mt-4">
                View Full Analytics
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}