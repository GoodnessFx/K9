interface K9LogoProps { 
  size?: number; 
  animated?: boolean; 
} 
 
export function K9Logo({ size = 32, animated = false }: K9LogoProps) { 
  const id = `k9-${size}`; 
  return ( 
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
    > 
      <defs> 
        {/* Body gradient — warm tan with depth */} 
        <radialGradient id={`${id}-body`} cx="45%" cy="35%" r="60%"> 
          <stop offset="0%" stopColor="#D4A055" /> 
          <stop offset="60%" stopColor="#A8732A" /> 
          <stop offset="100%" stopColor="#6B4A18" /> 
        </radialGradient> 
        {/* Dark saddle gradient */} 
        <radialGradient id={`${id}-dark`} cx="50%" cy="40%" r="55%"> 
          <stop offset="0%" stopColor="#3A2810" /> 
          <stop offset="100%" stopColor="#1A1008" /> 
        </radialGradient> 
        {/* Nose gradient — wet nose look */} 
        <radialGradient id={`${id}-nose`} cx="35%" cy="30%" r="60%"> 
          <stop offset="0%" stopColor="#5A4A3A" /> 
          <stop offset="100%" stopColor="#1A1008" /> 
        </radialGradient> 
        {/* Eye gradient */} 
        <radialGradient id={`${id}-eye`} cx="35%" cy="30%" r="70%"> 
          <stop offset="0%" stopColor="#8B5E2A" /> 
          <stop offset="70%" stopColor="#3A2010" /> 
          <stop offset="100%" stopColor="#0A0605" /> 
        </radialGradient> 
        {/* Purple collar glow */} 
        <radialGradient id={`${id}-collar`} cx="50%" cy="50%" r="50%"> 
          <stop offset="0%" stopColor="#A78BFA" /> 
          <stop offset="100%" stopColor="#6D28D9" /> 
        </radialGradient> 
        {/* Drop shadow filter */} 
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%"> 
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000066" /> 
        </filter> 
        {/* Nose glow — purple when active */} 
        <filter id={`${id}-glow`}> 
          <feGaussianBlur stdDeviation="1.5" result="blur" /> 
          <feComposite in="SourceGraphic" in2="blur" operator="over" /> 
        </filter> 
        {animated && ( 
          <style>{` 
            #${id}-nose-dot { animation: k9-sniff 2s ease-in-out infinite; } 
            @keyframes k9-sniff { 0%,100%{opacity:1} 50%{opacity:0.3} } 
          `}</style> 
        )} 
      </defs> 
 
      <g filter={`url(#${id}-shadow)`}> 
        {/* ── NECK ─────────────────────────────────────────────── */} 
        <ellipse cx="26" cy="46" rx="10" ry="8" fill={`url(#${id}-body)`} /> 
 
        {/* ── BODY (partial, gives context) ─────────────────────── */} 
        <ellipse cx="20" cy="50" rx="14" ry="7" fill={`url(#${id}-body)`} /> 
        <ellipse cx="20" cy="48" rx="10" ry="5" fill={`url(#${id}-dark)`} opacity="0.7" /> 
 
        {/* ── HEAD ─────────────────────────────────────────────── */} 
        {/* Skull */} 
        <ellipse cx="36" cy="30" rx="16" ry="14" fill={`url(#${id}-body)`} /> 
        {/* Black saddle on top of head */} 
        <ellipse cx="34" cy="22" rx="12" ry="8" fill={`url(#${id}-dark)`} opacity="0.85" /> 
        {/* Cheek highlight */} 
        <ellipse cx="42" cy="33" rx="5" ry="4" fill="#D4A055" opacity="0.5" /> 
 
        {/* ── MUZZLE ─────────────────────────────────────────────── */} 
        {/* Main muzzle shape */} 
        <ellipse cx="48" cy="36" rx="9" ry="7" fill={`url(#${id}-body)`} /> 
        {/* Lower muzzle — slightly lighter */} 
        <ellipse cx="49" cy="39" rx="7" ry="4" fill="#C49045" /> 
        {/* Muzzle split line */} 
        <line x1="52" y1="34" x2="55" y2="36" stroke="#8B6020" strokeWidth="0.8" strokeLinecap="round" /> 
 
        {/* ── NOSE ─────────────────────────────────────────────── */} 
        <ellipse cx="55" cy="35" rx="4" ry="3" fill={`url(#${id}-nose)`} /> 
        {/* Nose highlight */} 
        <ellipse cx="53.5" cy="33.8" rx="1.2" ry="0.8" fill="#6A5A4A" opacity="0.7" /> 
        {/* Nostril */} 
        <ellipse cx="54" cy="35.5" rx="1.0" ry="0.6" fill="#0A0605" /> 
        <ellipse cx="56.5" cy="35.5" rx="1.0" ry="0.6" fill="#0A0605" /> 
        {/* Purple nose glow dot — the K9 signature */} 
        <circle id={`${id}-nose-dot`} cx="55" cy="35" r="4.5" fill="#8B5CF6" opacity="0.25" filter={`url(#${id}-glow)`} /> 
 
        {/* ── EYE ─────────────────────────────────────────────── */} 
        <ellipse cx="42" cy="28" rx="4" ry="3.5" fill={`url(#${id}-eye)`} /> 
        {/* Eye shine */} 
        <ellipse cx="40.8" cy="26.8" rx="1.2" ry="0.9" fill="white" opacity="0.85" /> 
        {/* Brow ridge — gives intelligence */} 
        <path d="M38 24.5 C40 23.5 44 23 46 24" stroke="#6B4A18" strokeWidth="1.2" strokeLinecap="round" fill="none" /> 
 
        {/* ── EARS ─────────────────────────────────────────────── */} 
        {/* Left ear (far) */} 
        <path d="M26 20 C25 14 29 10 32 12 C30 15 28 18 27 22 Z" fill={`url(#${id}-dark)`} /> 
        {/* Right ear (near) — bigger, more detail */} 
        <path d="M34 18 C33 11 38 7 42 10 C39 13 37 17 36 22 Z" fill={`url(#${id}-body)`} /> 
        {/* Inner right ear */} 
        <path d="M36 19 C35 14 38 10 40 12 C38 15 37 18 36.5 21 Z" fill="#C8703A" opacity="0.6" /> 
 
        {/* ── COLLAR ─────────────────────────────────────────────── */} 
        <path d="M24 43 Q36 46 46 41" stroke={`url(#${id}-collar)`} strokeWidth="3" strokeLinecap="round" fill="none" /> 
        {/* Collar badge */} 
        <rect x="32" y="40" width="7" height="5" rx="1.5" fill={`url(#${id}-collar)`} opacity="0.9" /> 
        <text x="35.5" y="44" textAnchor="middle" fill="white" fontSize="3" fontWeight="bold" fontFamily="monospace">K9</text> 
      </g> 
    </svg> 
  ); 
} 
