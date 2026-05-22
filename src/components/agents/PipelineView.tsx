import { useAppStore } from '@/store/useAppStore';
import { deliverables } from '@/data/deliverables';
import type { DeliverableStatus } from '@/types';

const STATUS_COLORS: Record<DeliverableStatus, string> = {
  'Requested':   '#475569',
  'In Progress': '#06b6d4',
  'Review':      '#f59e0b',
  'Approved':    '#22c55e',
  'Delivered':   '#6366f1',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high:   '#f97316',
  medium: '#06b6d4',
  low:    '#475569',
};

const STAGES: DeliverableStatus[] = ['Requested', 'In Progress', 'Review', 'Approved', 'Delivered'];

export function PipelineView() {
  const { deliverableStatuses, openDeliverable } = useAppStore();

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = deliverables.filter(d => (deliverableStatuses[d.id] ?? d.status) === stage);
    return acc;
  }, {} as Record<DeliverableStatus, typeof deliverables>);

  return (
    <div className="flex-1 overflow-hidden px-5 py-4">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          height: '100%',
        }}
      >
        {STAGES.map(stage => {
          const color = STATUS_COLORS[stage];
          const cards = grouped[stage];

          return (
            <div
              key={stage}
              className="flex flex-col rounded-xl overflow-hidden"
              style={{ border: `1px solid ${color}20`, background: 'rgba(8,8,14,0.6)' }}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b"
                style={{
                  borderColor: `${color}20`,
                  borderLeft: `2px solid ${color}`,
                }}
              >
                <span className="text-[10px] font-semibold" style={{ color }}>{stage}</span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                  style={{ background: `${color}15`, color }}
                >
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
                {cards.map(d => {
                  const priorityColor = PRIORITY_COLORS[d.priority] ?? '#475569';
                  return (
                    <button
                      key={d.id}
                      onClick={() => openDeliverable(d)}
                      className="w-full text-left rounded-lg p-2.5 border transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: `${color}25`,
                        borderLeft: `2px solid ${color}`,
                      }}
                    >
                      <p className="text-[10px] text-slate-300 font-medium leading-snug line-clamp-2 mb-1.5">
                        {d.title}
                      </p>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] text-muted truncate max-w-[80px]">
                          {d.clientName}
                        </span>
                        <span
                          className="text-[8px] px-1 py-px rounded font-semibold flex-shrink-0"
                          style={{ color: priorityColor, background: `${priorityColor}15` }}
                        >
                          {d.priority}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted mt-1 truncate">{d.assignedAgentName}</p>
                    </button>
                  );
                })}
                {cards.length === 0 && (
                  <p className="text-[10px] text-muted italic text-center py-4">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
