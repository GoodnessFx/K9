import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Filter,
  Palette,
  Database,
  Shield,
  Zap,
  Download,
  RotateCcw,
  Save,
  Moon,
  Sun,
  Volume2,
  Mail,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  const [settings, setSettings] = useState({
    // Profile settings
    username: 'TraceHunter',
    email: 'user@tracedog.app',
    avatarUrl: '',
    bio: 'AI-powered alpha hunter focused on DeFi opportunities',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    telegramNotifications: false,
    discordNotifications: false,
    
    // Alert priorities
    criticalAlerts: true,
    highAlerts: true,
    mediumAlerts: true,
    lowAlerts: false,
    
    // Theme settings
    theme: 'system', // light, dark, system
    accentColor: 'blue',
    compactMode: false,
    animationsEnabled: true,
    
    // Trading settings
    riskTolerance: 'moderate', // conservative, moderate, aggressive
    minConfidence: 70,
    maxRiskLevel: 'medium',
    autoRefresh: true,
    refreshInterval: 30,
    
    // Data sources
    enabledSources: ['TradingView', 'DefiLlama', 'CoinGecko', 'Uniswap', 'Etherscan'],
    
    // Advanced settings
    apiKey: '',
    webhookUrl: '',
    customFilters: [],
    
    // AI settings
    aiEnabled: true,
    aiConfidenceThreshold: 75,
    aiDogImageEnabled: true // New setting for dog images
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.'
    });
    // In a real app, this would save to the backend
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults', {
      description: 'All settings have been restored to their default values.'
    });
    // Reset to default values
  };

  const handleExport = () => {
    const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(settingsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracedog-settings.json';
    a.click();
    toast.success('Settings exported!');
  };

  const availableSources = [
    'TradingView', 'DefiLlama', 'CoinGecko', 'Uniswap', 'Etherscan',
    'Dune Analytics', 'The Graph', 'Messari', 'CryptoCompare', 'TokenTerminal'
  ];

  const accentColors = [
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Green', value: 'green' },
    { name: 'Orange', value: 'orange' },
    { name: 'Red', value: 'red' },
    { name: 'Pink', value: 'pink' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Tracedog Settings
          </DialogTitle>
          <DialogDescription>
            Configure your preferences and customize your alpha hunting experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 border-r bg-muted/20">
                <TabsList className="flex-col h-auto w-full bg-transparent p-2 space-y-1">
                  <TabsTrigger 
                    value="general" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <User className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="filters" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Filter className="h-4 w-4" />
                    Filters & Trading
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sources" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Database className="h-4 w-4" />
                    Data Sources
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Zap className="h-4 w-4" />
                    AI Features
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content */}
              <div className="flex-1">
                <ScrollArea className="h-[600px]">
                  <div className="p-6">
                    {/* General Tab */}
                    <TabsContent value="general" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                value={settings.username}
                                onChange={(e) => handleSettingChange('username', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleSettingChange('email', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={settings.bio}
                              onChange={(e) => handleSettingChange('bio', e.target.value)}
                              placeholder="Tell us about your trading strategy..."
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <Label>Email Notifications</Label>
                            </div>
                            <Switch
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked: boolean) => handleSettingChange('emailNotifications', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              <Label>Push Notifications</Label>
                            </div>
                            <Switch
                              checked={settings.pushNotifications}
                              onCheckedChange={(checked: boolean) => handleSettingChange('pushNotifications', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4" />
                              <Label>Sound Notifications</Label>
                            </div>
                            <Switch
                              checked={settings.soundNotifications}
                              onCheckedChange={(checked) => handleSettingChange('soundNotifications', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              <Label>Telegram Notifications</Label>
                            </div>
                            <Switch
                              checked={settings.telegramNotifications}
                              onCheckedChange={(checked) => handleSettingChange('telegramNotifications', checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Alert Priorities</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <Label>Critical Alerts</Label>
                              <Badge variant="destructive" className="text-xs">High Impact</Badge>
                            </div>
                            <Switch
                              checked={settings.criticalAlerts}
                              onCheckedChange={(checked) => handleSettingChange('criticalAlerts', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <Label>High Priority Alerts</Label>
                            </div>
                            <Switch
                              checked={settings.highAlerts}
                              onCheckedChange={(checked) => handleSettingChange('highAlerts', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              <Label>Medium Priority Alerts</Label>
                            </div>
                            <Switch
                              checked={settings.mediumAlerts}
                              onCheckedChange={(checked) => handleSettingChange('mediumAlerts', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-500" />
                              <Label>Low Priority Alerts</Label>
                            </div>
                            <Switch
                              checked={settings.lowAlerts}
                              onCheckedChange={(checked) => handleSettingChange('lowAlerts', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Filters & Trading Tab */}
                    <TabsContent value="filters" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Trading Preferences</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Risk Tolerance</Label>
                            <Select 
                              value={settings.riskTolerance} 
                              onValueChange={(value) => handleSettingChange('riskTolerance', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="conservative">Conservative</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Minimum Confidence: {settings.minConfidence}%</Label>
                            <Slider
                              value={[settings.minConfidence]}
                              onValueChange={([value]) => handleSettingChange('minConfidence', value)}
                              max={100}
                              min={0}
                              step={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Maximum Risk Level</Label>
                            <Select 
                              value={settings.maxRiskLevel} 
                              onValueChange={(value) => handleSettingChange('maxRiskLevel', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low Risk Only</SelectItem>
                                <SelectItem value="medium">Medium Risk & Below</SelectItem>
                                <SelectItem value="high">All Risk Levels</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Auto-Refresh Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Enable Auto-Refresh</Label>
                            <Switch
                              checked={settings.autoRefresh}
                              onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                            />
                          </div>
                          {settings.autoRefresh && (
                            <div className="space-y-2">
                              <Label>Refresh Interval (seconds)</Label>
                              <Select 
                                value={settings.refreshInterval.toString()} 
                                onValueChange={(value) => handleSettingChange('refreshInterval', parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 seconds</SelectItem>
                                  <SelectItem value="30">30 seconds</SelectItem>
                                  <SelectItem value="60">1 minute</SelectItem>
                                  <SelectItem value="300">5 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Theme Mode</Label>
                            <Select 
                              value={settings.theme} 
                              onValueChange={(value) => handleSettingChange('theme', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">
                                  <div className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" />
                                    Light
                                  </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                  <div className="flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    Dark
                                  </div>
                                </SelectItem>
                                <SelectItem value="system">
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    System
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {accentColors.map((color) => (
                                <Button
                                  key={color.value}
                                  variant={settings.accentColor === color.value ? "default" : "outline"}
                                  className="justify-start"
                                  onClick={() => handleSettingChange('accentColor', color.value)}
                                >
                                  <div className={`h-3 w-3 rounded-full bg-${color.value}-500 mr-2`}></div>
                                  {color.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Compact Mode</Label>
                            <Switch
                              checked={settings.compactMode}
                              onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Enable Animations</Label>
                            <Switch
                              checked={settings.animationsEnabled}
                              onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Data Sources Tab */}
                    <TabsContent value="sources" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Enabled Data Sources</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {availableSources.map((source) => (
                            <div key={source} className="flex items-center space-x-2">
                              <Switch
                                checked={settings.enabledSources.includes(source)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleSettingChange('enabledSources', [...settings.enabledSources, source]);
                                  } else {
                                    handleSettingChange('enabledSources', settings.enabledSources.filter(s => s !== source));
                                  }
                                }}
                              />
                              <Label>{source}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* AI Features Tab */}
                    <TabsContent value="ai" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">AI Hunter Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Enable AI Features</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow AI to analyze and generate trading signals
                              </p>
                            </div>
                            <Switch
                              checked={settings.aiEnabled}
                              onCheckedChange={(checked) => handleSettingChange('aiEnabled', checked)}
                            />
                          </div>
                          
                          {settings.aiEnabled && (
                            <>
                              <div className="space-y-2">
                                <Label>AI Confidence Threshold: {settings.aiConfidenceThreshold}%</Label>
                                <Slider
                                  value={[settings.aiConfidenceThreshold]}
                                  onValueChange={([value]) => handleSettingChange('aiConfidenceThreshold', value)}
                                  max={100}
                                  min={50}
                                  step={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Only show AI signals above this confidence level
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <Label>🐕 Show Dog Images for New Alpha</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Display a happy dog image when high-confidence alpha is detected
                                  </p>
                                </div>
                                <Switch
                                  checked={settings.aiDogImageEnabled}
                                  onCheckedChange={(checked) => handleSettingChange('aiDogImageEnabled', checked)}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-0 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">API Configuration</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key (Optional)</Label>
                            <Input
                              id="apiKey"
                              type="password"
                              placeholder="Your API key for premium features"
                              value={settings.apiKey}
                              onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                            <Input
                              id="webhookUrl"
                              placeholder="https://your-webhook-url.com"
                              value={settings.webhookUrl}
                              onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/20">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}