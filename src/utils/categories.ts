export const CATEGORY_CONFIG: Record<string, { 
  label: string; 
  color: string; 
  bgColor: string; 
}> = { 
  airdrop:     { label: 'Free Money / Airdrop',   color: '#00C87A', bgColor: '#0a2e1e' }, 
  bounty:      { label: 'Free Money / Airdrop',   color: '#00C87A', bgColor: '#0a2e1e' }, 
  learn:       { label: 'Free Money / Airdrop',   color: '#00C87A', bgColor: '#0a2e1e' }, 
  grant:       { label: 'Free Money / Airdrop',   color: '#00C87A', bgColor: '#0a2e1e' }, 
  job:         { label: 'Jobs / Gigs / Bounty',   color: '#3B82F6', bgColor: '#0a1a35' }, 
  insider:     { label: 'Insider Signal',          color: '#8B5CF6', bgColor: '#1a0a35' }, 
  defi:        { label: 'Crypto Finance',          color: '#F59E0B', bgColor: '#2a1a05' }, 
  tradfi:      { label: 'Market Signal',           color: '#EC4899', bgColor: '#2a0a1a' }, 
  nft:         { label: 'NFT',                     color: '#06B6D4', bgColor: '#052a2e' }, 
  stablecoin:  { label: 'Stablecoin Alert',        color: '#EF4444', bgColor: '#2e0a0a' }, 
  security:    { label: 'Security Alert',          color: '#EF4444', bgColor: '#2e0a0a' }, 
  convergence: { label: 'Multiple Sources Agree',  color: '#8B5CF6', bgColor: '#1a0a35' }, 
  whale:       { label: 'Big Money Move',          color: '#14B8A6', bgColor: '#052a28' }, 
  polymarket:  { label: 'Prediction Market',       color: '#F97316', bgColor: '#2a1205' }, 
}; 
  
export function getCategoryLabel(category: string): string { 
  return CATEGORY_CONFIG[category]?.label ?? 'Opportunity'; 
} 
  
export function getCategoryColor(category: string): string { 
  return CATEGORY_CONFIG[category]?.color ?? '#8B9EB0'; 
} 
  
export function getCategoryBg(category: string): string { 
  return CATEGORY_CONFIG[category]?.bgColor ?? '#1a2330'; 
} 
