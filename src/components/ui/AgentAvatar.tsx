import { StatusDot } from './StatusDot';
import type { AgentStatus } from '@/types';

interface AgentAvatarProps {
  name: string;
  color: string;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export function AgentAvatar({
  name,
  color,
  status,
  size = 'md',
  showStatus = true,
}: AgentAvatarProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('');

  const sizeStyles = {
    sm: { outer: 'w-7 h-7', text: 'text-[10px]', dot: 'bottom-0 right-0' },
    md: { outer: 'w-9 h-9', text: 'text-xs',     dot: '-bottom-0.5 -right-0.5' },
    lg: { outer: 'w-12 h-12', text: 'text-sm',   dot: 'bottom-0 right-0' },
  };

  const s = sizeStyles[size];

  return (
    <span className="relative inline-flex flex-shrink-0">
      <span
        className={`${s.outer} rounded-xl flex items-center justify-center font-semibold text-white flex-shrink-0`}
        style={{ backgroundColor: `${color}30`, border: `1px solid ${color}50`, color }}
      >
        <span className={`${s.text} font-mono`}>{initials}</span>
      </span>
      {showStatus && (
        <span className={`absolute ${s.dot}`}>
          <StatusDot status={status} size="sm" />
        </span>
      )}
    </span>
  );
}
