import { clsx } from 'clsx'; 
import { twMerge } from 'tailwind-merge'; 
 
function cn(...inputs: any[]) { 
  return twMerge(clsx(inputs)); 
} 
 
interface LogoMarkProps { 
  size?: number; 
  animated?: boolean; 
  className?: string; 
  color?: string;
} 
 
export default function LogoMark({ size = 32, animated = false, className, color }: LogoMarkProps) { 
  return ( 
    <div 
      className={cn('relative flex items-center justify-center', className)} 
      style={{ width: size, height: size, color: color || 'currentColor' }} 
    > 
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
      > 
        {/* K — left vertical bar */} 
        <rect x="4" y="5" width="3" height="22" rx="1.5" fill="currentColor" /> 
        {/* K — upper diagonal */} 
        <path d="M7 16L18 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /> 
        {/* K — lower diagonal */} 
        <path d="M7 16L18 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /> 
        {/* 9 — circle */} 
        <circle cx="24" cy="13" r="5.5" stroke="currentColor" strokeWidth="2.5" fill="none" /> 
        {/* 9 — tail */} 
        <path d="M29 13V25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /> 
        {/* Live dot — shows when animated=true */} 
        {animated && ( 
          <circle cx="28" cy="27" r="2" fill="#00BF72"> 
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" /> 
          </circle> 
        )} 
      </svg> 
    </div> 
  ); 
} 
