import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { 
  Radar,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Settings,
  BarChart3,
  Activity,
  Eye,
  Bookmark,
  Flame,
  Shield
} from 'lucide-react';
import { TradingOpportunity } from '../types';

const mockOpportunities: TradingOpportunity[] = [
  {
    id: '1',
    token: 'Ethereum',
    symbol: 'ETH',
    action: 'buy',
    currentPrice: 2456.32,
    targetPrice: 2850.00,
    stopLoss: 2200.00,
    confidence: 82,
    reasoning: [
      'Strong support at $2400 level',
      'Ascending triangle pattern forming',
      'Increasing institutional accumulation',
      'ETF inflows accelerating'
    ],
    timeframe: '2-4 weeks',
    riskLevel: 'medium',
    source: 'TechnicalAnalysis.AI',
    createdAt: new Date(Date.now() - 1000 * 60 * 20)
  },
  {
    id: '2',
    token: 'Solana',
    symbol: 'SOL',
    action: 'buy',
    currentPrice: 89.45,
    targetPrice: 125.00,
    stopLoss: 75.00,
    confidence: 76,
    reasoning: [
      'Network activity surging 40% WoW',
      'New DeFi protocols launching',
      'Breakout from descending wedge',
      'Developer ecosystem expanding'
    ],
    timeframe: '3-6 weeks',
    riskLevel: 'medium',
    source: 'OnChainMetrics.io',
    createdAt: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '3',
    token: 'Chainlink',
    symbol: 'LINK',
    action: 'sell',
    currentPrice: 14.82,
    targetPrice: 12.50,
    stopLoss: 16.20,
    confidence: 68,
    reasoning: [
      'Bearish divergence on RSI',
      'Breaking below key support',
      'Reduced oracle usage metrics',
      'Market rotation to AI tokens'
    ],
    timeframe: '1-2 weeks',
    riskLevel: 'high',
    source: 'SmartMoney.tracker',
    createdAt: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: '4',
    token: 'Render Token',
    symbol: 'RNDR',
    action: 'buy',
    currentPrice: 7.23,
    targetPrice: 12.80,
    confidence: 91,
    reasoning: [
      'AI/GPU narrative strengthening',
      'Major partnerships announced',
      'Supply squeeze detected',
      'Whale accumulation pattern'
    ],
    timeframe: '4-8 weeks',
    riskLevel: 'low',
    source: 'AlphaHunter.pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 10)
  },
  {
    id: '5',
    token: 'Jupiter',
    symbol: 'JUP',
    action: 'buy',
    currentPrice: 0.68,
    targetPrice: 1.25,
    stopLoss: 0.55,
    confidence: 89,
    reasoning: [
      'Solana DeFi ecosystem growth',
      'Volume aggregator dominance',
      'Token unlock schedule favorable',
      'Jupiter DAO governance launch'
    ],
    timeframe: '6-10 weeks',
    riskLevel: 'medium',
    source: 'DeFiPulse.ai',
    createdAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '6',
    token: 'Worldcoin',
    symbol: 'WLD',
    action: 'sell',
    currentPrice: 2.34,
    targetPrice: 1.80,
    stopLoss: 2.65,
    confidence: 73,
    reasoning: [
      'Regulatory concerns mounting',
      'Token unlock pressure',
      'Privacy backlash increasing',
      'Technical breakdown pattern'
    ],
    timeframe: '2-3 weeks',
    riskLevel: 'high',
    source: 'RegulatoryWatch.io',
    createdAt: new Date(Date.now() - 1000 * 60 * 35)
  },
  {
    id: '7',
    token: 'Pyth Network',
    symbol: 'PYTH',
    action: 'buy',
    currentPrice: 0.42,
    targetPrice: 0.78,
    confidence: 85,
    reasoning: [
      'Oracle demand surging',
      'Major DeFi integrations',
      'Low float, high utility',
      'Solana ecosystem strength'
    ],
    timeframe: '4-6 weeks',
    riskLevel: 'low',
    source: 'OracleMetrics.xyz',
    createdAt: new Date(Date.now() - 1000 * 30)
  },
  {
    id: '8',
    token: 'Aptos',
    symbol: 'APT',
    action: 'buy',
    currentPrice: 8.92,
    targetPrice: 14.50,
    stopLoss: 7.20,
    confidence: 78,
    reasoning: [
      'Move language adoption',
      'Gaming partnerships growing',
      'Developer incentive program',
      'Layer 1 performance metrics'
    ],
    timeframe: '8-12 weeks',
    riskLevel: 'medium',
    source: 'L1Analysis.pro',
    createdAt: new Date(Date.now() - 1000 * 60 * 25)
  }
];

// Market sentiment and heat map data
const marketSectors = [
  { name: 'AI & Machine Learning', heat: 85, trend: 'up', tokens: ['RNDR', 'FET', 'OCEAN'] },
  { name: 'Layer 1 Blockchains', heat: 72, trend: 'up', tokens: ['ETH', 'SOL', 'APT'] },
  { name: 'DeFi Infrastructure', heat: 68, trend: 'neutral', tokens: ['LINK', 'UNI', 'AAVE'] },
  { name: 'Gaming & Metaverse', heat: 45, trend: 'down', tokens: ['AXS', 'SAND', 'MANA'] },
  { name: 'Privacy & Identity', heat: 38, trend: 'down', tokens: ['WLD', 'ZK', 'MASK'] },
  { name: 'Oracle & Data', heat: 82, trend: 'up', tokens: ['PYTH', 'BAND', 'API3'] }
];

// Radar visualization component
const RadarVisualization = ({ opportunities }: { opportunities: TradingOpportunity[] }) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  
  const getRadarPosition = (confidence: number, risk: string, index: number) => {
    const riskMultiplier = risk === 'low' ? 0.3 : risk === 'medium' ? 0.6 : 0.9;
    const radius = (confidence / 100) * maxRadius * riskMultiplier;
    const angle = (index / opportunities.length) * 2 * Math.PI;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };
  
  return (
    <div className="relative">
      <svg width="300" height="300" className="border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        {/* Radar circles */}
        {[20, 40, 60, 80, 100].map((radius) => (
          <circle
            key={radius}
            cx={centerX}
            cy={centerY}
            r={(radius / 100) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.2"
          />
        ))}
        
        {/* Radar lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const radians = (angle * Math.PI) / 180;
          const x2 = centerX + maxRadius * Math.cos(radians);
          const y2 = centerY + maxRadius * Math.sin(radians);
          return (
            <line
              key={angle}
              x1={centerX}
              y1={centerY}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
            />
          );
        })}
        
        {/* Opportunity points */}
        {opportunities.slice(0, 8).map((opp, index) => {
          const pos = getRadarPosition(opp.confidence, opp.riskLevel, index);
          const color = opp.action === 'buy' ? '#10b981' : '#ef4444';
          
          return (
            <g key={opp.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={color}
                opacity="0.8"
                className="animate-pulse"
              />
              <text
                x={pos.x}
                y={pos.y - 10}
                textAnchor="middle"
                className="text-xs font-medium fill-current"
              >
                {opp.symbol}
              </text>
            </g>
          );
        })}
        
        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r="3" fill="currentColor" opacity="0.5" />
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 space-y-1">
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Buy</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Sell</span>
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        <div>Distance = Confidence</div>
        <div>Ring = Risk Level</div>
      </div>
    </div>
  );
};

export function OpportunityRadar() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeView, setActiveView] = useState('opportunities');
  const [filters, setFilters] = useState({
    action: 'all',
    risk: 'all',
    minConfidence: 60,
    timeframe: 'all',
    sector: 'all'
  });
  const [sortBy, setSortBy] = useState('confidence');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter(opp => {
      if (filters.action !== 'all' && opp.action !== filters.action) return false;
      if (filters.risk !== 'all' && opp.riskLevel !== filters.risk) return false;
      if (opp.confidence < filters.minConfidence) return false;
      if (filters.timeframe !== 'all') {
        const timeframeMap: { [key: string]: string[] } = {
          'short': ['1-2 days', '1-2 weeks'],
          'medium': ['2-4 weeks', '3-6 weeks', '4-6 weeks'],
          'long': ['6-10 weeks', '8-12 weeks', '4-8 weeks']
        };
        if (!timeframeMap[filters.timeframe]?.some(tf => opp.timeframe.includes(tf.split('-')[0]))) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'potential':
          const aPotential = parseFloat(getPotentialReturn(a.currentPrice, a.targetPrice, a.action));
          const bPotential = parseFloat(getPotentialReturn(b.currentPrice, b.targetPrice, b.action));
          return bPotential - aPotential;
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            // Reset and add new opportunity occasionally
            if (Math.random() < 0.2) {
              const tokens = ['BTC', 'ADA', 'DOT', 'MATIC', 'AVAX', 'ATOM', 'FTM', 'NEAR'];
              const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
              const confidence = Math.floor(Math.random() * 35) + 65;
              const risk = confidence > 85 ? 'low' : confidence > 75 ? 'medium' : 'high';
              
              const newOpp: TradingOpportunity = {
                id: Date.now().toString(),
                token: `${randomToken} Token`,
                symbol: randomToken,
                action: Math.random() > 0.6 ? 'buy' : 'sell',
                currentPrice: Math.random() * 100 + 1,
                targetPrice: Math.random() * 150 + 50,
                confidence: confidence,
                reasoning: [
                  'AI pattern recognition detected',
                  'Volume anomaly identified',
                  'Technical indicator alignment',
                  'Market sentiment shift'
                ],
                timeframe: ['1-2 weeks', '3-6 weeks', '4-8 weeks'][Math.floor(Math.random() * 3)],
                riskLevel: risk,
                source: 'Tracedog.AI',
                createdAt: new Date()
              };
              setOpportunities(prev => [newOpp, ...prev].slice(0, 12));
            }
            return 0;
          }
          return prev + 1.5;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, [scanning]);

  const getActionColor = (action: string) => {
    return action === 'buy' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getActionIcon = (action: string) => {
    return action === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPotentialReturn = (current: number, target: number, action: string) => {
    const diff = action === 'buy' 
      ? ((target - current) / current) * 100
      : ((current - target) / current) * 100;
    return diff.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Radar className="h-8 w-8 text-blue-600" />
            Opportunity Radar
          </h1>
          <p className="text-muted-foreground">
            Advanced AI-powered trading intelligence with multi-dimensional analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setScanning(!scanning)}
            className="flex items-center gap-2"
          >
            {scanning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {scanning ? 'Pause Scan' : 'Resume Scan'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Action</label>
              <Select value={filters.action} onValueChange={(value: string) => setFilters({...filters, action: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="buy">Buy Only</SelectItem>
                  <SelectItem value="sell">Sell Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <Select value={filters.risk} onValueChange={(value: string) => setFilters({...filters, risk: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <Select value={filters.timeframe} onValueChange={(value: string) => setFilters({...filters, timeframe: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="short">Short Term</SelectItem>
                  <SelectItem value="medium">Medium Term</SelectItem>
                  <SelectItem value="long">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confidence">Confidence</SelectItem>
                  <SelectItem value="potential">Potential Return</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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
      )}

      {/* Tabs for different views */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            Radar View
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Heat Map
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {/* Scanning Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${scanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-medium">
                  {scanning ? 'Active Scanning' : 'Scan Paused'}
                </span>
                <Badge variant="outline" className="ml-2">
                  {filteredOpportunities.length} signals
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Analyzing 1,247 tokens across 18 exchanges • AI models: Technical, Sentiment, On-chain
            </p>
          </Card>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-4 h-full hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{opportunity.symbol}</h3>
                          {opportunity.confidence >= 85 && (
                            <Flame className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${opportunity.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getActionColor(opportunity.action)}>
                          {getActionIcon(opportunity.action)}
                          {opportunity.action.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{opportunity.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-medium">${opportunity.targetPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Potential:</span>
                        <span className="text-green-600 font-medium">
                          +{getPotentialReturn(opportunity.currentPrice, opportunity.targetPrice, opportunity.action)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk:</span>
                        <span className={getRiskColor(opportunity.riskLevel)}>
                          {opportunity.riskLevel.charAt(0).toUpperCase() + opportunity.riskLevel.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div>
                      <Progress value={opportunity.confidence} className="h-2" />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {opportunity.timeframe}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Radar className="h-5 w-5 text-blue-600" />
                Opportunity Radar
              </h3>
              <RadarVisualization opportunities={filteredOpportunities} />
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Radar Insights</h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">High Confidence Zone</span>
                  </div>
                  <p className="text-sm text-green-600">
                    {filteredOpportunities.filter(o => o.confidence >= 85).length} signals above 85% confidence
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-400">Optimal Risk/Reward</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    {filteredOpportunities.filter(o => o.riskLevel === 'low' && o.confidence > 80).length} low-risk, high-confidence opportunities
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-700 dark:text-yellow-400">Watch Closely</span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    {filteredOpportunities.filter(o => o.riskLevel === 'high').length} high-risk signals require monitoring
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Market Sector Heat Map
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketSectors.map((sector, index) => (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    sector.heat > 80 ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                    sector.heat > 60 ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                    sector.heat > 40 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                    'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{sector.name}</h4>
                    <div className="flex items-center gap-1">
                      {sector.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : sector.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Heat Score</span>
                      <span className="font-semibold">{sector.heat}/100</span>
                    </div>
                    <Progress value={sector.heat} className="h-2" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sector.tokens.map(token => (
                        <Badge key={token} variant="secondary" className="text-xs">
                          {token}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Buy Signals</span>
              </div>
              <p className="text-2xl font-bold">
                {filteredOpportunities.filter(o => o.action === 'buy').length}
              </p>
              <p className="text-sm text-muted-foreground">Active opportunities</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Avg Confidence</span>
              </div>
              <p className="text-2xl font-bold">
                {filteredOpportunities.length > 0 ? 
                  Math.round(filteredOpportunities.reduce((acc, o) => acc + o.confidence, 0) / filteredOpportunities.length) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Signal strength</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Avg Return</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                +{filteredOpportunities.length > 0 ?
                  Math.round(filteredOpportunities.reduce((acc, o) => 
                    acc + parseFloat(getPotentialReturn(o.currentPrice, o.targetPrice, o.action)), 0
                  ) / filteredOpportunities.length) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Potential upside</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Risk Distribution</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Low</span>
                  <span>{filteredOpportunities.filter(o => o.riskLevel === 'low').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Med</span>
                  <span>{filteredOpportunities.filter(o => o.riskLevel === 'medium').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">High</span>
                  <span>{filteredOpportunities.filter(o => o.riskLevel === 'high').length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Performing Signals (Last 24h)</h3>
            <div className="space-y-3">
              {filteredOpportunities
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 5)
                .map((opp, index) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-muted-foreground">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{opp.symbol}</div>
                        <div className="text-sm text-muted-foreground">{opp.token}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{opp.confidence}%</div>
                      <div className="text-sm text-green-600">
                        +{getPotentialReturn(opp.currentPrice, opp.targetPrice, opp.action)}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}