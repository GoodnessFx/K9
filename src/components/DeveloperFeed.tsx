import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Code, 
  GitBranch, 
  Zap, 
  Shield, 
  Wrench,
  ExternalLink,
  Star,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Rocket
} from 'lucide-react';
import { DeveloperUpdate } from '../types';

const mockUpdates: DeveloperUpdate[] = [
  {
    id: '1',
    title: 'Viem 2.0 Released - Type-safe Ethereum Library',
    description: 'Major update brings better TypeScript support, 50% smaller bundle size, and improved performance for web3 development.',
    category: 'framework',
    githubUrl: 'https://github.com/wevm/viem',
    docsUrl: 'https://viem.sh',
    impact: 'high',
    tags: ['ethereum', 'typescript', 'web3', 'performance'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    upvotes: 234
  },
  {
    id: '2',
    title: 'Foundry Gas Optimization Toolkit',
    description: 'New forge commands for gas analysis and optimization suggestions. Automated gas reports and comparison tools.',
    category: 'tool',
    githubUrl: 'https://github.com/foundry-rs/foundry',
    docsUrl: 'https://book.getfoundry.sh',
    impact: 'medium',
    tags: ['foundry', 'gas-optimization', 'solidity', 'testing'],
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    upvotes: 189
  },
  {
    id: '3',
    title: 'Critical Vulnerability in OpenZeppelin Contracts',
    description: 'Security advisory for ReentrancyGuard in versions 4.3.0-4.8.2. Immediate upgrade recommended for all affected contracts.',
    category: 'security',
    githubUrl: 'https://github.com/OpenZeppelin/openzeppelin-contracts',
    docsUrl: 'https://docs.openzeppelin.com/contracts',
    impact: 'high',
    tags: ['security', 'openzeppelin', 'vulnerability', 'reentrancy'],
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
    upvotes: 567
  },
  {
    id: '4',
    title: 'Scaffold-ETH 2 - Next.js Integration',
    description: 'Complete rewrite with Next.js 14, App Router, and modern React patterns. Faster development for dApp prototyping.',
    category: 'framework',
    githubUrl: 'https://github.com/scaffold-eth/scaffold-eth-2',
    docsUrl: 'https://docs.scaffoldeth.io',
    impact: 'medium',
    tags: ['nextjs', 'react', 'dapp', 'prototyping', 'scaffold'],
    createdAt: new Date(Date.now() - 1000 * 60 * 360),
    upvotes: 156
  },
  {
    id: '5',
    title: 'Uniswap V4 Hooks Documentation Update',
    description: 'Comprehensive guide for building custom hooks. Examples for MEV protection, dynamic fees, and custom AMM logic.',
    category: 'protocol',
    githubUrl: 'https://github.com/Uniswap/v4-core',
    docsUrl: 'https://docs.uniswap.org/hooks',
    impact: 'high',
    tags: ['uniswap', 'hooks', 'amm', 'defi', 'documentation'],
    createdAt: new Date(Date.now() - 1000 * 60 * 480),
    upvotes: 342
  },
  {
    id: '6',
    title: 'Hardhat Network Mainnet Fork Performance',
    description: 'New caching system reduces fork startup time by 80%. Better debugging tools and trace analysis.',
    category: 'tool',
    githubUrl: 'https://github.com/NomicFoundation/hardhat',
    docsUrl: 'https://hardhat.org/docs',
    impact: 'medium',
    tags: ['hardhat', 'testing', 'fork', 'performance', 'debugging'],
    createdAt: new Date(Date.now() - 1000 * 60 * 600),
    upvotes: 98
  }
];

const trendingTopics = [
  { name: 'Uniswap V4 Hooks', mentions: 145, trend: '+23%' },
  { name: 'Account Abstraction', mentions: 89, trend: '+45%' },
  { name: 'Intent-based Architecture', mentions: 67, trend: '+67%' },
  { name: 'Solidity 0.8.24', mentions: 54, trend: '+12%' },
  { name: 'EIP-4844 Blobs', mentions: 43, trend: '+89%' },
  { name: 'Foundry Testing', mentions: 38, trend: '+34%' }
];

export function DeveloperFeed() {
  const [updates, setUpdates] = useState(mockUpdates);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'framework', 'tool', 'protocol', 'security', 'sdk'];

  const filteredUpdates = updates.filter(update => 
    activeCategory === 'all' || update.category === activeCategory
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'framework': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'tool': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'protocol': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'sdk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'framework': return <Code className="h-4 w-4" />;
      case 'tool': return <Wrench className="h-4 w-4" />;
      case 'protocol': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'sdk': return <GitBranch className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const newUpdate: DeveloperUpdate = {
          id: Date.now().toString(),
          title: 'New Developer Tool Released',
          description: 'AI detected a new release in the ecosystem...',
          category: 'tool',
          impact: 'medium',
          tags: ['new-release'],
          createdAt: new Date(),
          upvotes: 0
        };
        setUpdates(prev => [newUpdate, ...prev].slice(0, 10));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Subscribe
          </Button>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex items-center gap-2"
              >
                {category !== 'all' && getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Updates */}
          <div className="space-y-4">
            {filteredUpdates.map((update, index) => (
              <motion.div
                key={update.id}
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
                          <Badge className={getCategoryColor(update.category)}>
                            {getCategoryIcon(update.category)}
                            {update.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getImpactColor(update.impact)}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {update.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{update.title}</h3>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {getTimeAgo(update.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{update.upvotes} upvotes</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground">{update.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {update.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-2 border-t">
                      {update.githubUrl && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          GitHub
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {update.docsUrl && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          Docs
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="ml-auto flex items-center gap-2">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <p className="text-sm font-medium">{topic.name}</p>
                    <p className="text-xs text-muted-foreground">{topic.mentions} mentions</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {topic.trend}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* AI Developer Digest */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-600" />
              AI Developer Digest
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Morning Summary Ready</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  3 new frameworks, 2 security updates, and 5 tool releases detected overnight.
                </p>
              </div>
              
              <Button size="sm" className="w-full">
                View Full Digest
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <GitBranch className="h-4 w-4 mr-2" />
                Submit New Tool
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Join Dev Discord
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Report Vulnerability
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}