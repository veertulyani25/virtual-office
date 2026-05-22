import { motion } from 'framer-motion';
import { AgentCard } from './AgentCard';
import { PipelineView } from './PipelineView';
import { agents } from '@/data/agents';
import { useAppStore } from '@/store/useAppStore';

const marketingAgents = agents.filter(a => a.department === 'marketing');

const activeCount     = marketingAgents.filter(a => a.status === 'active').length;
const processingCount = marketingAgents.filter(a => a.status === 'processing').length;
const idleCount       = marketingAgents.filter(
  a => a.status === 'idle' || a.status === 'standby',
).length;

const statChips = [
  { label: 'Active Now',  value: activeCount,     color: '#22c55e' },
  { label: 'Processing',  value: processingCount,  color: '#f59e0b' },
  { label: 'Standby',     value: idleCount,        color: '#94a3b8' },
] as const;

export function AgentRoster() {
  const { isPipelineViewActive, togglePipelineView } = useAppStore();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Department stat bar */}
      <div
        className="flex items-center gap-4 px-5 py-3 flex-shrink-0 border-b"
        style={{ borderColor: '#1a1a2e' }}
      >
        <div>
          <p className="text-sm font-semibold text-slate-200">Marketing Team</p>
          <p className="text-muted" style={{ fontSize: 11 }}>
            7 AI specialists · Evolve AI
          </p>
        </div>

        <div className="flex gap-3 ml-auto items-center">
          {statChips.map(chip => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg glass"
              style={{ fontSize: 10 }}
            >
              <span className="font-bold font-mono" style={{ color: chip.color }}>
                {chip.value}
              </span>
              <span className="text-muted">{chip.label}</span>
            </div>
          ))}

          {/* Team / Pipeline toggle */}
          <div
            className="flex rounded-lg overflow-hidden ml-2"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={() => { if (isPipelineViewActive) togglePipelineView(); }}
              className="px-3 py-1 text-[10px] font-medium transition-colors"
              style={{
                background: !isPipelineViewActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: !isPipelineViewActive ? '#e2e8f0' : '#64748b',
              }}
            >
              Team
            </button>
            <button
              onClick={() => { if (!isPipelineViewActive) togglePipelineView(); }}
              className="px-3 py-1 text-[10px] font-medium transition-colors"
              style={{
                background: isPipelineViewActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: isPipelineViewActive ? '#e2e8f0' : '#64748b',
              }}
            >
              Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* View */}
      {isPipelineViewActive ? (
        <PipelineView />
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: 12,
            }}
          >
            {marketingAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
