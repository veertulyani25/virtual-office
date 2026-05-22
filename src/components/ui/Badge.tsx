import React from 'react';
import type { CRMStage, DeliverableStatus, AgentStatus } from '@/types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-primary/15 text-indigo-300 border-primary/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger:  'bg-red-500/15 text-red-400 border-red-500/25',
  info:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  muted:   'bg-white/5 text-muted border-white/10',
};

const SIZE_STYLES = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: 'bg-indigo-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-cyan-400',
  muted:   'bg-slate-400',
};

export function Badge({ label, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[variant]}`} />}
      {label}
    </span>
  );
}

export function crmStageBadge(stage: CRMStage): React.ReactElement {
  const map: Record<CRMStage, BadgeVariant> = {
    'Prospect': 'muted',
    'Lead': 'info',
    'Initial Meeting Complete': 'info',
    'Onboarding Documents Ready': 'warning',
    'Proposal Sent': 'warning',
    'Active': 'success',
    'Churned': 'danger',
  };
  return <Badge label={stage} variant={map[stage]} dot size="sm" />;
}

export function deliverableStatusBadge(status: DeliverableStatus): React.ReactElement {
  const map: Record<DeliverableStatus, BadgeVariant> = {
    'Requested': 'muted',
    'In Progress': 'info',
    'Review': 'warning',
    'Approved': 'success',
    'Delivered': 'success',
  };
  return <Badge label={status} variant={map[status]} dot size="xs" />;
}

export function agentStatusBadge(status: AgentStatus): React.ReactElement {
  const map: Record<AgentStatus, BadgeVariant> = {
    'active': 'success',
    'idle': 'muted',
    'processing': 'info',
    'standby': 'warning',
  };
  const labels: Record<AgentStatus, string> = {
    'active': 'Active',
    'idle': 'Idle',
    'processing': 'Processing',
    'standby': 'Standby',
  };
  return <Badge label={labels[status]} variant={map[status]} dot size="xs" />;
}

export function priorityBadge(priority: string): React.ReactElement {
  const map: Record<string, BadgeVariant> = {
    urgent: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'muted',
  };
  return <Badge label={priority} variant={map[priority] || 'muted'} size="xs" />;
}
