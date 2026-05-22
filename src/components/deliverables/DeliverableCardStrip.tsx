import { Package } from 'lucide-react';
import { deliverables } from '@/data/deliverables';
import { useAppStore } from '@/store/useAppStore';
import { useDeliverableStatus } from '@/hooks/useDeliverableStatus';
import type { Deliverable } from '@/types';

const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high:   '#f97316',
  medium: '#06b6d4',
  low:    '#475569',
};

const STATUS_COLORS: Record<string, string> = {
  'Requested':   '#475569',
  'In Progress': '#06b6d4',
  'Review':      '#f59e0b',
  'Approved':    '#22c55e',
  'Delivered':   '#6366f1',
};

function DeliverableCard({ d }: { d: Deliverable }) {
  const { openDeliverable } = useAppStore();
  const effectiveStatus = useDeliverableStatus(d);
  const priorityColor = PRIORITY_COLORS[d.priority];
  const statusColor = STATUS_COLORS[effectiveStatus];

  return (
    <div
      onClick={() => openDeliverable(d)}
      className="flex-shrink-0 w-56 rounded-xl border p-3 cursor-pointer hover:border-border2 transition-colors"
      style={{
        background: 'rgba(12,12,20,0.9)',
        borderColor: `${statusColor}30`,
        borderLeftWidth: 2,
        borderLeftColor: statusColor,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-[11px] font-medium text-slate-300 leading-snug line-clamp-2 flex-1">
          {d.title}
        </p>
        <Package size={11} style={{ color: statusColor }} className="flex-shrink-0 mt-0.5" />
      </div>

      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className="text-[9px] px-1.5 py-px rounded-full border font-medium"
          style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}10` }}
        >
          {effectiveStatus}
        </span>
        <span
          className="text-[9px] px-1.5 py-px rounded-full font-semibold"
          style={{ color: priorityColor, background: `${priorityColor}15` }}
        >
          {d.priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted truncate max-w-[100px]">{d.clientName}</span>
        {d.dueDate && (
          <span className="text-[9px] text-muted flex-shrink-0">
            {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

export function DeliverableCardStrip() {
  const doubled = [...deliverables, ...deliverables];

  return (
    <div className="h-[88px] border-t border-border flex-shrink-0 relative overflow-hidden"
         style={{ background: 'rgba(5,5,8,0.95)' }}>

      <div className="absolute inset-0 flex items-center">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10"
             style={{ background: 'linear-gradient(to right, #050508, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10"
             style={{ background: 'linear-gradient(to left, #050508, transparent)' }} />

        {/* Label */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5">
          <Package size={11} className="text-muted" />
          <span className="text-[10px] text-muted font-medium whitespace-nowrap">Live Pipeline</span>
        </div>

        {/* Scrolling strip */}
        <div
          className="flex items-center gap-3 pl-32"
          style={{
            animation: 'scrollX 50s linear infinite',
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {doubled.map((d, i) => (
            <DeliverableCard key={`${d.id}-${i}`} d={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
