import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getDeliverablesByAgent } from '@/data/deliverables';
import type { DeliverableStatus } from '@/types';

// ─── Animation variants (DepartmentSlideOver pattern) ────────────────────────

const slideVariants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 35 } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' as const } },
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<DeliverableStatus, string> = {
  'Requested':   '#475569',
  'In Progress': '#06b6d4',
  'Review':      '#f59e0b',
  'Approved':    '#22c55e',
  'Delivered':   '#6366f1',
};

const ALL_STATUSES: DeliverableStatus[] = [
  'Requested', 'In Progress', 'Review', 'Approved', 'Delivered',
];

// ─── StatusPill (mirrors AgentCard exactly) ───────────────────────────────────

type AgentStatusType = 'active' | 'idle' | 'processing' | 'standby';

function StatusPill({ status }: { status: AgentStatusType }) {
  const map = {
    active:     { cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', label: '● Active' },
    processing: { cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',       label: '⟳ Working' },
    idle:       { cls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',        label: '◌ Idle' },
    standby:    { cls: 'bg-slate-600/10 text-slate-500 border border-slate-600/20',        label: '— Standby' },
  } as const;

  const { cls, label } = map[status];

  return (
    <span
      className={`${cls} px-2 py-0.5 rounded-full font-medium flex-shrink-0`}
      style={{ fontSize: 9 }}
    >
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AgentDetailPanel() {
  const {
    isAgentPanelOpen,
    selectedAgent,
    closeAgentPanel,
    openDeliverable,
    deliverableStatuses,
    updateDeliverableStatus,
    agentTasks,
    assignAgentTask,
  } = useAppStore();

  const [assignOpen, setAssignOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const agent = selectedAgent;
  if (!agent) return null;

  const color = agent.avatarColor;
  const isActive = agent.status === 'active' || agent.status === 'processing';
  const effectiveTask = agentTasks[agent.id] ?? agent.currentTask;
  const agentDeliverables = getDeliverablesByAgent(agent.id);

  function handleAssign() {
    if (!taskInput.trim()) return;
    assignAgentTask(agent!.id, taskInput.trim());
    setTaskInput('');
    setAssignOpen(false);
  }

  return (
    <AnimatePresence>
      {isAgentPanelOpen && agent && (
        <>
          {/* Backdrop */}
          <motion.div
            key="agent-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeAgentPanel}
          />

          {/* Panel */}
          <motion.aside
            key="agent-panel"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-[560px] max-w-[92vw] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(8,8,14,0.97)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-4 px-5 py-4 border-b flex-shrink-0"
              style={{
                background: `linear-gradient(to right, ${color}08, transparent)`,
                borderColor: `${color}20`,
              }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
                {isActive && (
                  <motion.div
                    className="absolute rounded-full border-2"
                    style={{ inset: -4, borderColor: color }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    fontSize: 20,
                    background: `radial-gradient(circle at 30% 30%, ${color}ff, ${color}66)`,
                    border: `2px solid ${color}${isActive ? 'cc' : '40'}`,
                    boxShadow: isActive ? `0 0 20px ${color}40` : undefined,
                  }}
                >
                  {agent.name[0]}
                </div>
              </div>

              {/* Name + stats */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-100 truncate">{agent.name}</p>
                <p className="text-[11px] text-muted mt-0.5 truncate">{agent.role}</p>

                {/* Stat chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {/* Tasks done */}
                  <span
                    className="px-2 py-1 rounded-lg text-[10px] flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span className="font-semibold font-mono" style={{ color }}>{agent.tasksCompleted}</span>
                    <span className="text-muted">tasks done</span>
                  </span>

                  {/* Department */}
                  <span
                    className="px-2 py-1 rounded-lg text-[10px] text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {agent.department}
                  </span>

                  {/* Skills count */}
                  <span
                    className="px-2 py-1 rounded-lg text-[10px] text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {agent.specialties.length} skills
                  </span>
                </div>
              </div>

              {/* Status pill + close */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={closeAgentPanel}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-slate-300 hover:bg-white/8 transition-colors"
                >
                  <X size={16} />
                </button>
                <StatusPill status={agent.status} />
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-5">

              {/* CURRENT TASK */}
              <section>
                <h3 className="text-[10px] text-muted uppercase tracking-wider mb-2">Current Task</h3>

                {effectiveTask && (
                  <p
                    className="text-[12px] text-slate-300 leading-relaxed border-l-2 pl-3 py-1 mb-2"
                    style={{ borderColor: color }}
                  >
                    {effectiveTask}
                  </p>
                )}

                {/* Toggle */}
                <button
                  onClick={() => setAssignOpen(v => !v)}
                  className="text-[11px] font-medium"
                  style={{ color }}
                >
                  Assign New Task {assignOpen ? '↑' : '↓'}
                </button>

                {assignOpen && (
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea
                      rows={4}
                      value={taskInput}
                      onChange={e => setTaskInput(e.target.value)}
                      placeholder="Describe the task…"
                      className="w-full resize-none rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-200 p-2.5 focus:outline-none placeholder:text-muted"
                      style={{ focusBorderColor: color } as React.CSSProperties}
                      onFocus={e => { e.target.style.borderColor = color; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAssign}
                        disabled={!taskInput.trim()}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-40"
                        style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* ASSIGNED DELIVERABLES */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[10px] text-muted uppercase tracking-wider">Assigned Deliverables</h3>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {agentDeliverables.length}
                  </span>
                </div>

                {agentDeliverables.length === 0 ? (
                  <p className="text-[11px] text-muted italic">No deliverables assigned yet</p>
                ) : (
                  <div>
                    {agentDeliverables.map(d => {
                      const effectiveStatus: DeliverableStatus =
                        deliverableStatuses[d.id] ?? d.status;

                      return (
                        <div
                          key={d.id}
                          onClick={() => openDeliverable(d)}
                          className="flex items-center gap-3 py-2 border-b last:border-0 cursor-pointer group rounded hover:bg-white/3"
                          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                          {/* Status bar */}
                          <div
                            className="w-0.5 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: STATUS_COLORS[effectiveStatus] }}
                          />

                          {/* Title */}
                          <p className="text-[11px] text-slate-300 font-medium truncate flex-1 min-w-0">
                            {d.title}
                          </p>

                          {/* Client name */}
                          <span className="text-[10px] text-muted truncate max-w-[80px] flex-shrink-0">
                            {d.clientName}
                          </span>

                          {/* Status select */}
                          <select
                            value={effectiveStatus}
                            onChange={e => {
                              e.stopPropagation();
                              updateDeliverableStatus(d.id, e.target.value as DeliverableStatus);
                            }}
                            onClick={e => e.stopPropagation()}
                            className="text-[9px] rounded px-1.5 py-1 bg-white/5 border border-white/10 cursor-pointer flex-shrink-0"
                            style={{ color: STATUS_COLORS[effectiveStatus] }}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s} style={{ background: '#0c0c14' }}>{s}</option>
                            ))}
                          </select>

                          {/* Due date */}
                          {d.dueDate && (
                            <span className="text-[9px] text-muted flex-shrink-0">
                              {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SPECIALTIES */}
              <section>
                <h3 className="text-[10px] text-muted uppercase tracking-wider mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-1.5">
                  {agent.specialties.map(s => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-1 rounded-lg text-muted"
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Footer ── */}
            <div
              className="flex-shrink-0 px-5 py-3 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <span className="text-[10px] text-muted">
                {agent.name} · Evolve AI
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
