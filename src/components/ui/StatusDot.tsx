import { motion } from 'framer-motion';
import type { AgentStatus } from '@/types';

const STATUS_COLORS: Record<AgentStatus, string> = {
  active:     '#22c55e',
  idle:       '#475569',
  processing: '#06b6d4',
  standby:    '#f59e0b',
};

interface StatusDotProps {
  status: AgentStatus;
  size?: 'sm' | 'md';
}

export function StatusDot({ status, size = 'sm' }: StatusDotProps) {
  const color = STATUS_COLORS[status];
  const px = size === 'sm' ? 8 : 10;
  const isPulsing = status === 'active' || status === 'processing';

  return (
    <span className="relative inline-flex" style={{ width: px, height: px }}>
      {isPulsing && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span
        className="relative inline-block rounded-full"
        style={{ width: px, height: px, backgroundColor: color }}
      />
    </span>
  );
}
