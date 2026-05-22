import { motion } from 'framer-motion';
import { Megaphone, ImageIcon, TrendingUp, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AgentAvatar } from '@/components/ui/AgentAvatar';
import { agentStatusBadge, deliverableStatusBadge, priorityBadge } from '@/components/ui/Badge';
import { agents as allAgents } from '@/data/agents';
import { deliverables as allDeliverables } from '@/data/deliverables';
import { clients } from '@/data/clients';
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const DEPT_COLOR = '#8b5cf6';

const marketingAgents = allAgents.filter(a => a.department === 'marketing');
const marketingDeliverables = allDeliverables.filter(d => d.department === 'marketing');

const requested  = marketingDeliverables.filter(d => d.status === 'Requested');
const inProgress = marketingDeliverables.filter(d => d.status === 'In Progress');
const inReview   = marketingDeliverables.filter(d => d.status === 'Review');
const approved   = marketingDeliverables.filter(d => d.status === 'Approved');
const delivered  = marketingDeliverables.filter(d => d.status === 'Delivered');

const activeCampaigns = [
  { name: 'LLumar PPF Launch', client: 'LLumar Kenya', type: 'Social + Ads', start: 'May 13', end: 'May 31', progress: 55, color: '#0ea5e9' },
  { name: 'Modera Q2 Meta Ads', client: 'Modera Real Estate', type: 'Meta Ads', start: 'May 1', end: 'May 31', progress: 80, color: '#06b6d4' },
  { name: 'Raveras Retargeting', client: 'Raveras', type: 'Meta Retargeting', start: 'May 8', end: 'May 25', progress: 90, color: '#ec4899' },
];

const platformData = [
  { name: 'IG Posts', value: 47, fill: '#e1306c' },
  { name: 'Meta Ads', value: 23, fill: '#1877f2' },
  { name: 'Carousels', value: 38, fill: '#8b5cf6' },
  { name: 'Reels', value: 19, fill: '#ff4500' },
  { name: 'Calendars', value: 8,  fill: '#06b6d4' },
];

const contentClients = clients
  .filter(c => c.crmStage === 'Active')
  .map(c => ({
    name: c.shortName,
    postsThisMonth: Math.floor(Math.random() * 18) + 4,
    color: c.logoColor,
  }));

function PipelineColumn({ title, items, color }: { title: string; items: typeof marketingDeliverables; color: string }) {
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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-2 py-1.5 rounded-lg text-[11px]">
        <p className="text-slate-300">{label}: <span className="text-slate-100 font-semibold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
}

export function MarketingPanel() {
  const activeAgents = marketingAgents.filter(a => a.status === 'active' || a.status === 'processing').length;
  const openDeliverables = marketingDeliverables.filter(d => d.status !== 'Delivered').length;

  return (
    <div className="flex flex-col gap-5">

      {/* Dept header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${DEPT_COLOR}20`, border: `1px solid ${DEPT_COLOR}30` }}>
          <Megaphone size={18} style={{ color: DEPT_COLOR }} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100">Marketing Department</h2>
          <p className="text-[11px] text-muted">
            {activeAgents} agents working · {openDeliverables} open deliverables · 3 campaigns live
          </p>
        </div>
      </div>

      {/* Campaign KPIs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Posts This Month', value: '94', icon: ImageIcon, color: '#e1306c' },
          { label: 'Active Campaigns', value: '3',  icon: TrendingUp, color: '#22c55e' },
          { label: 'Clients Served',   value: `${clients.filter(c => c.crmStage === 'Active').length}`, icon: Calendar, color: DEPT_COLOR },
        ].map((kpi, i) => (
          <GlassCard key={i} padding="p-3">
            <kpi.icon size={14} style={{ color: kpi.color }} className="mb-1.5" />
            <div className="text-lg font-bold font-mono text-slate-100">{kpi.value}</div>
            <div className="text-[10px] text-muted leading-snug">{kpi.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Agent roster */}
      <div>
        <SectionHeader
          title="Agent Roster"
          count={marketingAgents.length}
          color={DEPT_COLOR}
        />
        <div className="space-y-2">
          {marketingAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
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
                <div className="text-[10px] text-muted">Tasks</div>
                <div className="text-xs font-semibold font-mono" style={{ color: DEPT_COLOR }}>
                  {agent.tasksCompleted}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active campaigns */}
      <div>
        <SectionHeader
          title="Active Campaigns"
          count={activeCampaigns.length}
          color={DEPT_COLOR}
        />
        <div className="space-y-2.5">
          {activeCampaigns.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl glass hover:bg-white/4 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[12px] font-semibold text-slate-200">{c.name}</p>
                  <p className="text-[10px] text-muted">{c.client} · {c.type}</p>
                </div>
                <span
                  className="text-[10px] font-semibold font-mono"
                  style={{ color: c.color }}
                >
                  {c.progress}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted">{c.start}</span>
                <span className="text-[10px] text-muted">{c.end}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Deliverables pipeline */}
      <div>
        <SectionHeader
          title="Deliverables Pipeline"
          subtitle={`${marketingDeliverables.length} total`}
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

      {/* Platform breakdown chart */}
      <div>
        <SectionHeader
          title="Platform Breakdown"
          subtitle="Deliverables by type (all time)"
          color={DEPT_COLOR}
        />
        <GlassCard padding="p-4">
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barSize={16}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Content this week */}
      <div>
        <SectionHeader
          title="Content This Week"
          subtitle="Scheduled across clients"
          color={DEPT_COLOR}
        />
        <div className="space-y-1.5">
          {contentClients.slice(0, 6).map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{ background: `${c.color}20`, color: c.color }}
              >
                {c.name[0]}
              </span>
              <span className="text-[11px] text-slate-400 flex-1">{c.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (c.postsThisMonth / 20) * 100)}%`, backgroundColor: c.color + 'aa' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted w-8 text-right">{c.postsThisMonth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
