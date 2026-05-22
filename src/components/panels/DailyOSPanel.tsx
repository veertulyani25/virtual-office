import { CalendarDays, CheckCircle2, Circle, AlertTriangle, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { priorityBadge } from '@/components/ui/Badge';
import { tasks } from '@/data/tasks';
import { meetings } from '@/data/meetings';
import { financeStats } from '@/data/finance';
import { clients } from '@/data/clients';

const urgentTasks = tasks
  .filter(t => t.status !== 'done' && (t.priority === 'urgent' || t.priority === 'high'))
  .slice(0, 5);

const upcomingMeetings = meetings
  .filter(m => m.status === 'upcoming')
  .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  .slice(0, 3);

const healthAlerts = clients
  .filter(c => c.healthScore < 65 && c.crmStage === 'Active' || c.crmStage === 'Onboarding Documents Ready')
  .slice(0, 3);

function formatMeetingTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getMeetingTypeLabel(type: string): string {
  const map: Record<string, string> = {
    client_call: 'Client Call',
    internal: 'Internal',
    onboarding: 'Onboarding',
    review: 'Review',
    strategy: 'Strategy',
  };
  return map[type] || type;
}

function getMeetingTypeColor(type: string): string {
  const map: Record<string, string> = {
    client_call: '#6366f1',
    internal: '#94a3b8',
    onboarding: '#06b6d4',
    review: '#f59e0b',
    strategy: '#8b5cf6',
  };
  return map[type] || '#94a3b8';
}

export function DailyOSPanel() {
  const mrrFormatted = `KES ${(financeStats.currentMRR / 1000).toFixed(0)}K`;
  const growthText = `+${financeStats.mrrGrowthPct}% MoM`;

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col gap-3 overflow-y-auto py-4 px-3 no-scrollbar">

      {/* Today header */}
      <div className="px-1">
        <h2 className="text-sm font-semibold text-slate-200">Today at Evolve AI</h2>
        <p className="text-[11px] text-muted mt-0.5">Friday, May 16, 2026</p>
      </div>

      {/* MRR Snapshot */}
      <GlassCard glow="#6366f1" padding="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted uppercase tracking-wider">Monthly Revenue</span>
          <span className="text-[10px] text-emerald-400 font-semibold">{growthText}</span>
        </div>
        <div className="text-xl font-bold text-slate-100 font-mono">{mrrFormatted}</div>
        <div className="text-[11px] text-muted mt-0.5">
          ARR: KES {(financeStats.arrProjected / 1000000).toFixed(2)}M
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs font-semibold text-slate-300">
              {clients.filter(c => c.crmStage === 'Active').length}
            </div>
            <div className="text-[10px] text-muted">Active Clients</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs font-semibold text-amber-400">
              {financeStats.outstandingInvoices}
            </div>
            <div className="text-[10px] text-muted">Outstanding</div>
          </div>
        </div>
      </GlassCard>

      {/* Top Priorities */}
      <GlassCard padding="p-3">
        <SectionHeader title="Top Priorities" count={urgentTasks.length} />
        <div className="space-y-2">
          {urgentTasks.map(task => (
            <div key={task.id} className="flex items-start gap-2.5">
              {task.status === 'in_progress' ? (
                <Circle size={13} className="mt-0.5 flex-shrink-0 text-primary" strokeWidth={2.5} />
              ) : task.status === 'blocked' ? (
                <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-amber-400" />
              ) : (
                <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-muted" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-300 leading-snug">{task.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {priorityBadge(task.priority)}
                  {task.dueDate && (
                    <span className="text-[10px] text-muted">
                      Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Upcoming Meetings */}
      <GlassCard padding="p-3">
        <SectionHeader title="Meetings" count={upcomingMeetings.length} />
        <div className="space-y-2.5">
          {upcomingMeetings.map(m => (
            <div key={m.id} className="flex items-start gap-2.5">
              <div
                className="w-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ height: 32, backgroundColor: getMeetingTypeColor(m.type) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-slate-300 font-medium truncate">{m.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-muted" />
                  <span className="text-[10px] text-muted">{formatMeetingTime(m.scheduledAt)}</span>
                </div>
                <span className="text-[10px]" style={{ color: getMeetingTypeColor(m.type) }}>
                  {getMeetingTypeLabel(m.type)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Client Health Alerts */}
      {healthAlerts.length > 0 && (
        <GlassCard padding="p-3" glow="#f59e0b">
          <SectionHeader title="Health Alerts" count={healthAlerts.length} color="#f59e0b" />
          <div className="space-y-2">
            {healthAlerts.map(c => (
              <div key={c.id} className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: `${c.logoColor}20`, color: c.logoColor }}
                >
                  {c.shortName[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-300 font-medium truncate">{c.shortName}</p>
                  <p className="text-[10px] text-amber-400">Health: {c.healthScore}</p>
                </div>
                <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Agents Active */}
      <GlassCard padding="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Agents Working</div>
            <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">8 <span className="text-sm font-normal text-muted">/ 31</span></div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted">Today's output</div>
            <div className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">14 tasks</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: '26%' }} />
        </div>
        <div className="text-[10px] text-muted mt-1">26% capacity utilisation</div>
      </GlassCard>

      {/* Calendar link */}
      <button className="flex items-center gap-2 text-[11px] text-muted hover:text-slate-300 px-1 pb-2 group">
        <CalendarDays size={13} className="group-hover:text-primary transition-colors" />
        View full calendar
      </button>
    </aside>
  );
}
