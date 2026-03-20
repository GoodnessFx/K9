import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface LogoMarkProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function LogoMark({ size = 32, animated = false, className }: LogoMarkProps) {
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Continuous trace forming a dog profile */}
        <motion.path
          d="M6 22L8 22L10 18L13 18L15 12L17 12L19 18L22 18L24 14L26 14L28 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={animated ? {
            pathLength: [0, 1, 1],
            pathOffset: [0, 0, 1],
            opacity: [0, 1, 0]
          } : {}}
          transition={animated ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        
        {/* Simplified Geometric Silhouette */}
        <path
          d="M8 24C8 24 9 14 14 10C16 8.5 19 8 21 11C23 14 22 20 20 22C18 24 14 24 14 24M14 10L16 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Scan line effect */}
        {animated && (
          <motion.rect
            x="4"
            y="0"
            width="1"
            height="32"
            fill="currentColor"
            className="opacity-20"
            animate={{
              x: [4, 28, 4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </svg>
    </div>
  );
}
