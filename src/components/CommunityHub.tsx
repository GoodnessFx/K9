import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Trophy, 
  TrendingUp,
  MessageCircle,
  Heart,
  Share,
  Award,
  Crown,
  Zap,
  Target,
} from 'lucide-react';

const leaderboardUsers = [
  {
    id: '1',
    username: 'AlphaHunter_Pro',
    avatar: 'AH',
    alphaScore: 2847,
    reputation: 4.8,
    successfulSignals: 156,
    followers: 1247,
    verified: true,
    streak: 12,
    badge: 'Alpha Legend'
  },
  {
    id: '2',
    username: 'CryptoSage',
    avatar: 'CS',
    alphaScore: 2534,
    reputation: 4.6,
    successfulSignals: 134,
    followers: 892,
    verified: true,
    streak: 8,
    badge: 'Master Trader'
  },
  {
    id: '3',
    username: 'DefiWhale',
    avatar: 'DW',
    alphaScore: 2156,
    reputation: 4.7,
    successfulSignals: 98,
    followers: 2156,
    verified: true,
    streak: 15,
    badge: 'Whale Status'
  },
  {
    id: '4',
    username: 'TechAnalyst',
    avatar: 'TA',
    alphaScore: 1987,
    reputation: 4.4,
    successfulSignals: 87,
    followers: 654,
    verified: false,
    streak: 6,
    badge: 'Rising Star'
  },
  {
    id: '5',
    username: 'SmartMoney',
    avatar: 'SM',
    alphaScore: 1756,
    reputation: 4.5,
    successfulSignals: 76,
    followers: 543,
    verified: true,
    streak: 9,
    badge: 'Expert'
  }
];

const communityPosts = [
  {
    id: '1',
    user: leaderboardUsers[0],
    content: 'Just spotted massive whale accumulation in $ARB. 50M+ tokens moved to cold storage in the last 24h. Could be setting up for a major move 📈',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 234,
    comments: 45,
    shares: 12,
    category: 'alpha',
    tags: ['arbitrum', 'whale-alert', 'accumulation']
  },
  {
    id: '2',
    user: leaderboardUsers[1],
    content: 'Reminder: Always DYOR and manage risk. The best alpha hunters survive by protecting capital first, profits second. Risk management > everything else 🛡️',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    likes: 189,
    comments: 23,
    shares: 34,
    category: 'education',
    tags: ['risk-management', 'education', 'trading-tips']
  },
  {
    id: '3',
    user: leaderboardUsers[2],
    content: 'New Uniswap V4 hooks are game-changing. Built a custom MEV protection hook that saved me $2,300 in sandwich attacks this week. DM for details 🔒',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    likes: 167,
    comments: 56,
    shares: 28,
    category: 'development',
    tags: ['uniswap-v4', 'mev-protection', 'hooks', 'development']
  }
];

const challenges = [
  {
    id: '1',
    title: 'Weekly Alpha Challenge',
    description: 'Find and share the best alpha signal this week. Winner gets 1000 Alpha Credits.',
    prize: '1000 Alpha Credits + Badge',
    participants: 156,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    category: 'alpha-hunting'
  },
  {
    id: '2',
    title: 'Security Audit Contest',
    description: 'Analyze new DeFi protocols for security vulnerabilities. Top 3 auditors win prizes.',
    prize: '5000 Alpha Credits',
    participants: 89,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    category: 'security'
  }
];

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState('feed');
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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

  const getDaysRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Community Hub
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow alpha hunters and share insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Start Discussion
          </Button>
          <Button className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share Alpha
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {communityPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="space-y-4">
                      {/* User Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                            {post.user.avatar}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{post.user.username}</span>
                              {post.user.verified && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  <Crown className="h-3 w-3 mr-1" />
                                  {post.user.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Trophy className="h-3 w-3" />
                              {post.user.alphaScore.toLocaleString()} Alpha Score
                              <span>•</span>
                              {getTimeAgo(post.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant={followedUsers.includes(post.user.id) ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => toggleFollow(post.user.id)}
                        >
                          {followedUsers.includes(post.user.id) ? 'Following' : 'Follow'}
                        </Button>
                      </div>

                      {/* Content */}
                      <p className="text-foreground leading-relaxed">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-6 pt-2 border-t">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Share className="h-4 w-4" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Top Contributors */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Top Contributors This Week
                </h3>
                <div className="space-y-3">
                  {leaderboardUsers.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`text-sm font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-500' :
                          'text-orange-600'
                        }`}>
                          #{index + 1}
                        </span>
                        <Avatar className="h-6 w-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                          <span className="text-xs">{user.avatar}</span>
                        </Avatar>
                        <span className="text-sm font-medium">{user.username}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +{user.alphaScore}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Challenges */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Active Challenges
                </h3>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-3 bg-accent/50 rounded-lg">
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {challenge.participants} participants
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {getDaysRemaining(challenge.endDate)}d left
                        </Badge>
                        <Button size="sm" variant="outline">Join</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="space-y-4">
            {leaderboardUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-500' :
                          index === 2 ? 'text-orange-600' :
                          'text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </span>
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                          {user.avatar}
                        </Avatar>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{user.username}</span>
                          {user.verified && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              <Crown className="h-3 w-3 mr-1" />
                              {user.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            {user.alphaScore.toLocaleString()} Alpha Score
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-green-600" />
                            {user.streak} day streak
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            {user.successfulSignals} signals
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{user.reputation}</span>
                        <span className="text-sm text-muted-foreground">rating</span>
                      </div>
                      <Button
                        variant={followedUsers.includes(user.id) ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleFollow(user.id)}
                      >
                        {followedUsers.includes(user.id) ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{challenge.title}</h3>
                        <Badge variant="outline" className="mt-2">
                          {challenge.category}
                        </Badge>
                      </div>
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <p className="text-muted-foreground">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Prize Pool:</span>
                        <span className="font-semibold">{challenge.prize}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Participants:</span>
                        <span className="font-semibold">{challenge.participants}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Time Remaining:</span>
                        <span className="font-semibold text-orange-600">
                          {getDaysRemaining(challenge.endDate)} days
                        </span>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Join Challenge
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          {followedUsers.length > 0 ? (
            <div className="space-y-4">
              {followedUsers.map(userId => {
                const user = leaderboardUsers.find(u => u.id === userId);
                if (!user) return null;
                
                return (
                  <Card key={userId} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                          {user.avatar}
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{user.username}</span>
                            {user.verified && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <Crown className="h-3 w-3 mr-1" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {user.alphaScore.toLocaleString()} Alpha Score • {user.followers} followers
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        Following
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No one followed yet</h3>
              <p className="text-muted-foreground mb-4">
                Follow top alpha hunters to see their latest signals and insights
              </p>
              <Button onClick={() => setActiveTab('leaderboard')}>
                Browse Leaderboard
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}