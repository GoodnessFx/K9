interface K9LogoMarkProps { 
  size?: number; 
  color?: string; 
  glowColor?: string; 
  animated?: boolean; 
  showText?: boolean; 
} 
 
export function K9LogoMark({ 
  size = 32, 
  color = '#EEF2F7', 
  glowColor = '#8B5CF6', 
  animated = false, 
  showText = false, 
}: K9LogoMarkProps) { 
  const id = `k9-glow-${size}`; 
 
  return ( 
    <svg 
      width={showText ? size * 3.5 : size} 
      height={size} 
      viewBox={showText ? '0 0 112 32' : '0 0 32 32'} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
    > 
      <defs> 
        {/* Glow filter */} 
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%"> 
          <feGaussianBlur stdDeviation="1.5" result="blur" /> 
          <feFlood floodColor={glowColor} floodOpacity="0.8" result="color" /> 
          <feComposite in="color" in2="blur" operator="in" result="shadow" /> 
          <feMerge> 
            <feMergeNode in="shadow" /> 
            <feMergeNode in="SourceGraphic" /> 
          </feMerge> 
        </filter> 
        {animated && ( 
          <style>{` 
            @keyframes k9-nose-pulse { 
              0%, 100% { opacity: 1; } 
              50% { opacity: 0.4; } 
            } 
            .k9-nose { animation: k9-nose-pulse 1.5s ease-in-out infinite; } 
          `}</style> 
        )} 
      </defs> 
 
      <g filter={`url(#${id})`}> 
        {/* German Shepherd in right-facing profile — clean silhouette */} 
        {/* Body */} 
        <path 
          d="M6 20 C6 20 5 17 6 15 C7 13 9 13 11 13 L20 13 C22 13 23 14 23 16 L23 20 Z" 
          fill={color} 
          opacity="0.95" 
        /> 
        {/* Neck */} 
        <path 
          d="M19 13 C20 11 21 9 22 8 C23 7 24 8 24 9 L23 13 Z" 
          fill={color} 
          opacity="0.95" 
        /> 
        {/* Head */} 
        <path 
          d="M22 5 C24 4 27 5 28 7 C29 9 28 11 26 11 L23 11 C21 11 20 9 21 7 Z" 
          fill={color} 
          opacity="0.95" 
        /> 
        {/* Muzzle */} 
        <path 
          d="M26 9 C27 9 30 10 30 11 C30 12 29 12 28 11 L26 11 Z" 
          fill={color} 
          opacity="0.9" 
        /> 
        {/* Ear — upright */} 
        <path 
          d="M22 5 C22 3 23 1 24 1 C25 1 25 3 25 5 L23 6 Z" 
          fill={color} 
          opacity="0.95" 
        /> 
        {/* Front legs */} 
        <rect x="9" y="20" width="2.5" height="8" rx="1.2" fill={color} opacity="0.9" /> 
        <rect x="14" y="20" width="2.5" height="8" rx="1.2" fill={color} opacity="0.9" /> 
        {/* Back legs */} 
        <rect x="4" y="20" width="2.5" height="7" rx="1.2" fill={color} opacity="0.85" /> 
        {/* Tail — raised and curved */} 
        <path 
          d="M6 17 C4 16 2 14 1 11 C1 9 2 9 3 10 C4 12 5 15 6 17 Z" 
          fill={color} 
          opacity="0.9" 
        /> 
        {/* Eye */} 
        <circle cx="27" cy="7.5" r="1.2" fill={glowColor} opacity="0.9" /> 
        {/* Nose */} 
        <circle 
          className={animated ? 'k9-nose' : ''} 
          cx="30" 
          cy="10.5" 
          r="1.0" 
          fill={glowColor} 
          opacity="1" 
        /> 
        {/* Collar — K9 detail */} 
        <path 
          d="M21 11 L24 11" 
          stroke={glowColor} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.8" 
        /> 
      </g> 
 
      {/* Text mark */} 
      {showText && ( 
        <text 
          x="36" 
          y="22" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="18" 
          fontWeight="700" 
          letterSpacing="-0.5" 
          fill={color} 
        > 
          K9 
        </text> 
      )} 
    </svg> 
  ); 
} 
