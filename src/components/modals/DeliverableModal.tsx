import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { agents } from '@/data/agents';
import { clients } from '@/data/clients';
import type { DeliverableStatus, DepartmentId } from '@/types';

// ─── Animation variants (ClientDashboard modal pattern) ───────────────────────

const backdropV = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

const modalV = {
  hidden:  { scale: 0.94, opacity: 0, y: 16 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 32 } },
  exit:    { scale: 0.96, opacity: 0, y: 8, transition: { duration: 0.18 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

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

const DEPT_COLORS: Record<DepartmentId, string> = {
  'founder':        '#6366f1',
  'client-war-room':'#06b6d4',
  'branding':       '#ec4899',
  'marketing':      '#8b5cf6',
  'ai-systems':     '#06b6d4',
  'sales':          '#22c55e',
  'deliverables':   '#f97316',
  'meeting-room':   '#f59e0b',
  'finance':        '#22c55e',
  'operations':     '#94a3b8',
};

const STAGES: DeliverableStatus[] = [
  'Requested', 'In Progress', 'Review', 'Approved', 'Delivered',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function DeliverableModal() {
  const {
    isDeliverableModalOpen,
    selectedDeliverable,
    closeDeliverableModal,
    updateDeliverableStatus,
    deliverableStatuses,
    openAgent,
    openClient,
  } = useAppStore();

  const d = selectedDeliverable;
  if (!d) return null;

  const deptColor = DEPT_COLORS[d.department] ?? '#6366f1';
  const effectiveStatus: DeliverableStatus = deliverableStatuses[d.id] ?? d.status;
  const currentIdx = STAGES.indexOf(effectiveStatus);

  const priorityColor = PRIORITY_COLORS[d.priority] ?? '#475569';

  const formattedDue = d.dueDate
    ? new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  // Quick action visibility
  const canApprove   = effectiveStatus !== 'Approved' && effectiveStatus !== 'Delivered';
  const canRevise    = effectiveStatus === 'Review' || effectiveStatus === 'Approved';
  const canDeliver   = effectiveStatus === 'Approved';

  return (
    <AnimatePresence>
      {isDeliverableModalOpen && d && (
        <motion.div
          key="deliverable-backdrop"
          variants={backdropV}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={closeDeliverableModal}
        >
          {/* Modal */}
          <motion.div
            key="deliverable-modal"
            variants={modalV}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden z-[60]"
            style={{
              background: 'rgba(8,8,14,0.98)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex-shrink-0 px-5 py-4 border-b"
              style={{
                background: `linear-gradient(to right, ${deptColor}08, transparent)`,
                borderColor: `${deptColor}20`,
              }}
            >
              {/* Row 1: Title + close */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-100 leading-snug flex-1 min-w-0">
                  {d.title}
                </h2>
                <button
                  onClick={closeDeliverableModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-slate-300 hover:bg-white/8 transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Row 2: Type + priority badges */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                  style={{
                    background: `${deptColor}18`,
                    color: deptColor,
                    border: `1px solid ${deptColor}30`,
                  }}
                >
                  {d.type}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide"
                  style={{
                    background: `${priorityColor}18`,
                    color: priorityColor,
                    border: `1px solid ${priorityColor}30`,
                  }}
                >
                  {d.priority}
                </span>
              </div>

              {/* Row 3: Agent + client links */}
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted">
                <span>by</span>
                <button
                  className="hover:text-slate-200 underline-offset-2 hover:underline"
                  onClick={() => {
                    const agent = agents.find(a => a.id === d.assignedAgentId);
                    if (agent) openAgent(agent);
                    closeDeliverableModal();
                  }}
                >
                  {d.assignedAgentName}
                </button>
                <span className="text-border">·</span>
                <button
                  className="hover:text-slate-200 underline-offset-2 hover:underline"
                  onClick={() => {
                    const client = clients.find(c => c.id === d.clientId);
                    if (client) openClient(client);
                    closeDeliverableModal();
                  }}
                >
                  {d.clientName}
                </button>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto no-scrollbar">

              {/* Status Pipeline */}
              <div className="px-5 py-4">
                <p className="text-[9px] text-muted uppercase tracking-wider mb-3">Status Pipeline</p>

                <div className="flex items-center">
                  {STAGES.map((stage, i) => {
                    const isPast    = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    const isFuture  = i > currentIdx;

                    const circleBg = isPast
                      ? '#22c55e'
                      : isCurrent
                      ? STATUS_COLORS[stage]
                      : 'rgba(255,255,255,0.05)';

                    const labelColor = isCurrent
                      ? STATUS_COLORS[stage]
                      : isPast
                      ? '#22c55e88'
                      : '#475569';

                    return (
                      <div key={stage} className="flex items-center flex-1 last:flex-none">
                        {/* Node */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => updateDeliverableStatus(d.id, stage)}
                            className="relative flex-shrink-0"
                            style={{ width: 28, height: 28 }}
                            title={`Set to ${stage}`}
                          >
                            {isCurrent && (
                              <motion.div
                                className="absolute rounded-full border-2"
                                style={{ inset: -3, borderColor: STATUS_COLORS[stage] }}
                                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              />
                            )}
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center"
                              style={{ background: circleBg }}
                            >
                              {isPast && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </button>

                          {/* Stage label */}
                          <span
                            className="text-[8px] text-center whitespace-nowrap mt-1 leading-tight"
                            style={{ color: labelColor }}
                          >
                            {stage}
                          </span>
                        </div>

                        {/* Connector line (skip after last node) */}
                        {i < STAGES.length - 1 && (
                          <div
                            className="flex-1 h-px mb-4 mx-1"
                            style={{
                              backgroundColor: isFuture
                                ? 'rgba(255,255,255,0.08)'
                                : '#22c55e',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details grid */}
              <div className="px-5 py-3 grid grid-cols-2 gap-3">
                {/* Type */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-[9px] text-muted uppercase tracking-wider mb-1">Type</p>
                  <p className="text-[12px] text-slate-300 font-medium">{d.type}</p>
                </div>

                {/* Priority */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-[9px] text-muted uppercase tracking-wider mb-1">Priority</p>
                  <p className="text-[12px] font-semibold capitalize" style={{ color: priorityColor }}>
                    {d.priority}
                  </p>
                </div>

                {/* Department */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-[9px] text-muted uppercase tracking-wider mb-1">Department</p>
                  <p className="text-[12px] text-slate-300 font-medium capitalize">{d.department}</p>
                </div>

                {/* Due Date */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-[9px] text-muted uppercase tracking-wider mb-1">Due Date</p>
                  <p className="text-[12px] text-slate-300 font-medium">{formattedDue}</p>
                </div>

                {/* Tags — full width */}
                {d.tags.length > 0 && (
                  <div
                    className="col-span-2 rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-[9px] text-muted uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {d.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted border border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {(canApprove || canRevise || canDeliver) && (
                <div className="px-5 pb-5 flex gap-2 flex-wrap">
                  {canApprove && (
                    <button
                      onClick={() => {
                        updateDeliverableStatus(d.id, 'Approved');
                        closeDeliverableModal();
                      }}
                      className="px-4 py-2 rounded-lg text-[11px] font-semibold border transition-colors"
                      style={{
                        background: 'rgba(34,197,94,0.12)',
                        color: '#22c55e',
                        borderColor: 'rgba(34,197,94,0.30)',
                      }}
                    >
                      Approve
                    </button>
                  )}

                  {canRevise && (
                    <button
                      onClick={() => {
                        updateDeliverableStatus(d.id, 'In Progress');
                        closeDeliverableModal();
                      }}
                      className="px-4 py-2 rounded-lg text-[11px] font-semibold border transition-colors"
                      style={{
                        background: 'rgba(245,158,11,0.12)',
                        color: '#f59e0b',
                        borderColor: 'rgba(245,158,11,0.30)',
                      }}
                    >
                      Request Revision
                    </button>
                  )}

                  {canDeliver && (
                    <button
                      onClick={() => {
                        updateDeliverableStatus(d.id, 'Delivered');
                        closeDeliverableModal();
                      }}
                      className="px-4 py-2 rounded-lg text-[11px] font-semibold border transition-colors"
                      style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: '#6366f1',
                        borderColor: 'rgba(99,102,241,0.30)',
                      }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
