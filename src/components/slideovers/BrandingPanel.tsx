import { motion } from 'framer-motion';
import { Palette, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AgentAvatar } from '@/components/ui/AgentAvatar';
import { agentStatusBadge, deliverableStatusBadge, priorityBadge } from '@/components/ui/Badge';
import { StatusDot } from '@/components/ui/StatusDot';
import { agents as allAgents } from '@/data/agents';
import { deliverables as allDeliverables } from '@/data/deliverables';
import { clients } from '@/data/clients';

const brandingAgents = allAgents.filter(a => a.department === 'branding');
const brandingDeliverables = allDeliverables.filter(d => d.department === 'branding');

const requested  = brandingDeliverables.filter(d => d.status === 'Requested');
const inProgress = brandingDeliverables.filter(d => d.status === 'In Progress');
const inReview   = brandingDeliverables.filter(d => d.status === 'Review');
const approved   = brandingDeliverables.filter(d => d.status === 'Approved');
const delivered  = brandingDeliverables.filter(d => d.status === 'Delivered');

const DEPT_COLOR = '#ec4899';

// ─── Brand Status Table ───────────────────────────────────────────────────────
const activeClients = clients.filter(c =>
  c.crmStage === 'Active' || c.crmStage === 'Onboarding Documents Ready'
);

const brandStatusData = activeClients.slice(0, 8).map(c => ({
  client: c,
  hasBrandGuide:   ['raveras', 'tirupati-group', 'modera-real-estate', 'llumar-kenya'].includes(c.id),
  hasVoiceGuide:   ['raveras', 'tirupati-group'].includes(c.id),
  hasCompetitorAnalysis: ['raveras', 'tirupati-group', 'llumar-kenya', 'carmax-kenya'].includes(c.id),
  hasPositioning:  ['raveras', 'tirupati-group', 'modera-real-estate'].includes(c.id),
}));

function StatusIcon({ has }: { has: boolean }) {
  return has
    ? <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
    : <XCircle size={12} className="text-slate-600 flex-shrink-0" />;
}

function PipelineColumn({
  title,
  items,
  color,
}: {
  title: string;
  items: typeof brandingDeliverables;
  color: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-medium text-slate-400">{title}</span>
        <span className="text-[10px] font-mono bg-white/5 text-muted px-1 rounded">{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.length === 0 ? (
          <div className="text-[10px] text-muted italic text-center py-3 border border-dashed border-border rounded-lg">
            Empty
          </div>
        ) : (
          items.map(d => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 rounded-lg border cursor-pointer hover:border-border2 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: '#1a1a2e' }}
            >
              <p className="text-[11px] text-slate-300 leading-snug font-medium line-clamp-2">{d.title}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {priorityBadge(d.priority)}
                <span className="text-[9px] text-muted truncate max-w-[80px]">{d.clientName}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export function BrandingPanel() {
  return (
    <div className="flex flex-col gap-5">

      {/* Dept header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${DEPT_COLOR}20`, border: `1px solid ${DEPT_COLOR}30` }}>
          <Palette size={18} style={{ color: DEPT_COLOR }} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100">Branding & Strategy</h2>
          <p className="text-[11px] text-muted">
            {brandingAgents.filter(a => a.status === 'active' || a.status === 'processing').length} agents working ·{' '}
            {brandingDeliverables.filter(d => d.status !== 'Delivered').length} open deliverables
          </p>
        </div>
      </div>

      {/* Agent roster */}
      <div>
        <SectionHeader
          title="Agent Roster"
          count={brandingAgents.length}
          color={DEPT_COLOR}
        />
        <div className="space-y-2">
          {brandingAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors cursor-pointer glass"
            >
              <AgentAvatar
                name={agent.name}
                color={agent.avatarColor}
                status={agent.status}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-200">{agent.name}</span>
                  {agentStatusBadge(agent.status)}
                </div>
                {agent.currentTask ? (
                  <p className="text-[11px] text-muted mt-0.5 truncate">{agent.currentTask}</p>
                ) : (
                  <p className="text-[11px] text-slate-600 mt-0.5 italic">Awaiting task</p>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  {agent.specialties.slice(0, 2).map(s => (
                    <span key={s} className="text-[9px] bg-white/5 text-muted px-1.5 py-px rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-muted">Completed</div>
                <div className="text-xs font-semibold font-mono" style={{ color: DEPT_COLOR }}>
                  {agent.tasksCompleted}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deliverables pipeline */}
      <div>
        <SectionHeader
          title="Deliverables Pipeline"
          subtitle={`${brandingDeliverables.length} total`}
          color={DEPT_COLOR}
        />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <PipelineColumn title="Requested"  items={requested}  color="#94a3b8" />
          <PipelineColumn title="In Progress" items={inProgress} color="#06b6d4" />
          <PipelineColumn title="Review"     items={inReview}   color="#f59e0b" />
          <PipelineColumn title="Approved"   items={approved}   color="#22c55e" />
          <PipelineColumn title="Delivered"  items={delivered}  color="#6366f1" />
        </div>
      </div>

      {/* Brand status table */}
      <div>
        <SectionHeader
          title="Client Brand Status"
          subtitle="Asset coverage per client"
          color={DEPT_COLOR}
        />
        <GlassCard padding="p-0" className="overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0">
            <div className="px-3 py-2 text-[10px] text-muted uppercase tracking-wider border-b border-border">Client</div>
            <div className="px-2 py-2 text-[10px] text-muted uppercase tracking-wider border-b border-border text-center">Guide</div>
            <div className="px-2 py-2 text-[10px] text-muted uppercase tracking-wider border-b border-border text-center">Voice</div>
            <div className="px-2 py-2 text-[10px] text-muted uppercase tracking-wider border-b border-border text-center">Compt.</div>
            <div className="px-2 py-2 text-[10px] text-muted uppercase tracking-wider border-b border-border text-center">Pos.</div>
          </div>
          {brandStatusData.map((row, i) => (
            <div
              key={row.client.id}
              className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 hover:bg-white/4 transition-colors ${
                i < brandStatusData.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="px-3 py-2 flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: `${row.client.logoColor}20`, color: row.client.logoColor }}
                >
                  {row.client.shortName[0]}
                </span>
                <span className="text-[11px] text-slate-300 truncate">{row.client.shortName}</span>
              </div>
              <div className="px-2 py-2 flex items-center justify-center"><StatusIcon has={row.hasBrandGuide} /></div>
              <div className="px-2 py-2 flex items-center justify-center"><StatusIcon has={row.hasVoiceGuide} /></div>
              <div className="px-2 py-2 flex items-center justify-center"><StatusIcon has={row.hasCompetitorAnalysis} /></div>
              <div className="px-2 py-2 flex items-center justify-center"><StatusIcon has={row.hasPositioning} /></div>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* Recent completions */}
      <div>
        <SectionHeader title="Recently Delivered" color={DEPT_COLOR} />
        <div className="space-y-2">
          {delivered.concat(approved).slice(0, 4).map(d => (
            <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl glass hover:bg-white/4 cursor-pointer">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-300 truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {deliverableStatusBadge(d.status)}
                  <span className="text-[10px] text-muted">{d.clientName}</span>
                </div>
              </div>
              <ChevronRight size={12} className="text-muted flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
