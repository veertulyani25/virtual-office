import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: string;
  padding?: string;
}

export function GlassCard({
  children,
  className = '',
  onClick,
  hover = false,
  glow,
  padding = 'p-4',
}: GlassCardProps) {
  const glowStyle = glow ? { boxShadow: `0 0 24px ${glow}22, inset 0 1px 0 rgba(255,255,255,0.05)` } : {};

  return (
    <motion.div
      className={`glass rounded-xl ${padding} ${hover ? 'cursor-pointer glass-hover' : ''} ${className}`}
      style={glowStyle}
      onClick={onClick}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
