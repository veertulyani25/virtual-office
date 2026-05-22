import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAgentTask } from '@/hooks/useDeliverableStatus';
import type { AIAgent } from '@/types';

function StatusPill({ status }: { status: AIAgent['status'] }) {
  const map = {
    active:     { cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', label: '● Active' },
    processing: { cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',     label: '⟳ Working' },
    idle:       { cls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',      label: '◌ Idle' },
    standby:    { cls: 'bg-slate-600/10 text-slate-500 border border-slate-600/20',      label: '— Standby' },
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

export function AgentCard({ agent }: { agent: AIAgent }) {
  const { openAgent } = useAppStore();
  const effectiveTask = useAgentTask(agent);
  const color = agent.avatarColor;
  const isActive = agent.status === 'active' || agent.status === 'processing';

  return (
    <motion.div
      onClick={() => openAgent(agent)}
      className="flex flex-col p-4 rounded-2xl cursor-pointer"
      style={{
        minWidth: 200,
        flex: '1 1 0%',
        maxWidth: 240,
        background: 'rgba(10,9,20,0.9)',
        border: `1px solid ${color}20`,
      }}
      whileHover={{
        borderColor: `${color}45`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}12`,
      }}
    >
      {/* Avatar row */}
      <div className="flex items-start justify-between mb-3">
        <div className="relative" style={{ width: 52, height: 52 }}>
          {isActive && (
            <motion.span
              className="absolute rounded-full border-2"
              style={{
                inset: -4,
                borderColor: color,
              }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <div
            className="w-full h-full rounded-full flex items-center justify-center font-bold text-white"
            style={{
              fontSize: 16,
              background: `radial-gradient(circle at 30% 30%, ${color}ff, ${color}66)`,
              border: `2px solid ${color}${isActive ? 'cc' : '30'}`,
              boxShadow: isActive ? `0 0 20px ${color}40` : undefined,
            }}
          >
            {agent.name[0]}
          </div>
        </div>

        <StatusPill status={agent.status} />
      </div>

      {/* Name + Role */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-100">{agent.name}</p>
        <p className="text-muted leading-snug mt-0.5" style={{ fontSize: 11 }}>
          {agent.role}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t mb-3" style={{ borderColor: 'rgba(255,255,255,0.04)' }} />

      {/* Handling now */}
      <div className="mb-3">
        {effectiveTask ? (
          <>
            <p
              className="text-muted uppercase tracking-wider mb-1"
              style={{ fontSize: 9, letterSpacing: '0.08em' }}
            >
              HANDLING NOW
            </p>
            <p
              className="text-slate-300 leading-snug border-l-2 pl-2"
              style={{ fontSize: 11, borderColor: color }}
            >
              {effectiveTask}
            </p>
          </>
        ) : (
          <p className="text-muted italic" style={{ fontSize: 11 }}>
            Available for new tasks
          </p>
        )}
      </div>

      {/* Specialties */}
      <div className="mb-3">
        <p
          className="text-muted uppercase tracking-wider mb-1.5"
          style={{ fontSize: 9, letterSpacing: '0.08em' }}
        >
          Specialties
        </p>
        <div className="flex flex-wrap gap-1">
          {agent.specialties.slice(0, 3).map(s => (
            <span
              key={s}
              className="text-muted rounded px-1.5 py-0.5"
              style={{
                fontSize: 9,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center mt-auto pt-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <div>
          <p className="text-sm font-bold font-mono" style={{ color }}>
            {agent.tasksCompleted}
          </p>
          <p className="text-muted" style={{ fontSize: 9 }}>
            tasks done
          </p>
        </div>

        <motion.button
          onClick={(e) => { e.stopPropagation(); openAgent(agent); }}
          className="font-medium rounded-lg"
          style={{
            fontSize: 10,
            paddingInline: 10,
            paddingBlock: 4,
            background: `${color}20`,
            color,
            border: `1px solid ${color}35`,
          }}
          whileHover={{ background: `${color}35` } as Record<string, string>}
        >
          View Work
        </motion.button>
      </div>
    </motion.div>
  );
}
