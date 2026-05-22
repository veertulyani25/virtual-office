import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Mail, MapPin, Calendar, TrendingUp, Package, Activity } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { HealthScore } from '@/components/ui/HealthScore';
import { crmStageBadge, deliverableStatusBadge } from '@/components/ui/Badge';
import { getDeliverablesByClient } from '@/data/deliverables';
import { activities } from '@/data/activities';

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: Activity },
  { id: 'deliverables', label: 'Deliverables',  icon: Package },
  { id: 'crm',          label: 'CRM & Deals',  icon: TrendingUp },
] as const;

type TabId = typeof TABS[number]['id'];

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

export function ClientDashboard() {
  const { isClientModalOpen, selectedClient, closeClientModal, openDeliverable, deliverableStatuses } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const client = selectedClient;

  const clientDeliverables = client ? getDeliverablesByClient(client.id) : [];
  const clientActivities = client
    ? activities.filter(a => a.clientId === client.id).slice(0, 8)
    : [];

  const formatKES = (n: number) =>
    n >= 1000 ? `KES ${(n / 1000).toFixed(0)}K` : `KES ${n}`;

  return (
    <AnimatePresence>
      {isClientModalOpen && client && (
        <>
          <motion.div
            key="modal-backdrop"
            variants={backdropV}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={closeClientModal}
          >
            <motion.div
              key="modal"
              variants={modalV}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(8,8,14,0.98)',
                backdropFilter: 'blur(24px)',
                border: `1px solid ${client.logoColor}25`,
                boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${client.logoColor}10`,
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
                style={{
                  borderColor: `${client.logoColor}20`,
                  background: `linear-gradient(to right, ${client.logoColor}10, transparent)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: `${client.logoColor}25`, color: client.logoColor, border: `1px solid ${client.logoColor}40` }}
                >
                  {client.shortName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-slate-100">{client.name}</h2>
                    {crmStageBadge(client.crmStage)}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <MapPin size={10} /> {client.location}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-[11px] text-muted">{client.industry}</span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <Mail size={10} /> {client.primaryContact}
                    </span>
                  </div>
                </div>
                <HealthScore score={client.healthScore} />
                <button
                  onClick={closeClientModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-slate-300 hover:bg-white/8 transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-6 pt-3 pb-0 border-b border-border flex-shrink-0">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'text-slate-200 border-b-2'
                        : 'text-muted border-transparent hover:text-slate-400'
                    }`}
                    style={activeTab === tab.id ? { borderBottomColor: client.logoColor } : {}}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">

                {/* ─── Overview ─────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-5">
                    {/* KPI row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Monthly Retainer', value: client.mrr > 0 ? formatKES(client.mrr) : '—', color: '#22c55e' },
                        { label: 'Deliverables',    value: client.deliverableCount,  color: client.logoColor },
                        { label: 'Open Tasks',      value: client.openTasks,         color: '#f59e0b' },
                        { label: 'NPS Score',       value: client.npsScore ? `${client.npsScore}/10` : '—', color: '#6366f1' },
                      ].map((kpi, i) => (
                        <GlassCard key={i} padding="p-3">
                          <div className="text-[10px] text-muted mb-1">{kpi.label}</div>
                          <div className="text-sm font-bold font-mono" style={{ color: kpi.color }}>
                            {String(kpi.value)}
                          </div>
                        </GlassCard>
                      ))}
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-[12px] text-slate-400 leading-relaxed">{client.description}</p>
                    </div>

                    {/* Services */}
                    {client.services.length > 0 && (
                      <div>
                        <h3 className="text-[11px] text-muted uppercase tracking-wider mb-2">Active Services</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {client.services.map(s => (
                            <span
                              key={s}
                              className="text-[11px] px-2.5 py-1 rounded-lg border"
                              style={{
                                color: client.logoColor,
                                background: `${client.logoColor}15`,
                                borderColor: `${client.logoColor}30`,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Health + join date */}
                    <div className="grid grid-cols-2 gap-3">
                      <GlassCard padding="p-3">
                        <div className="text-[10px] text-muted mb-2">Health Score</div>
                        <HealthScore score={client.healthScore} size="md" />
                        <p className="text-[10px] text-muted mt-1">
                          {client.healthScore >= 80 ? 'Excellent — keep momentum' :
                           client.healthScore >= 65 ? 'Good — minor risks' :
                           'Needs attention'}
                        </p>
                      </GlassCard>
                      <GlassCard padding="p-3">
                        <div className="text-[10px] text-muted mb-1">Client Since</div>
                        <div className="text-sm font-semibold text-slate-200 font-mono">
                          {new Date(client.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-muted mt-0.5">{client.primaryEmail}</div>
                      </GlassCard>
                    </div>

                    {/* Recent activity */}
                    {clientActivities.length > 0 && (
                      <div>
                        <h3 className="text-[11px] text-muted uppercase tracking-wider mb-2">Recent Activity</h3>
                        <div className="space-y-2">
                          {clientActivities.map(a => (
                            <div key={a.id} className="flex items-start gap-2.5 py-1.5 border-b border-border/40 last:border-0">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.color }} />
                              <div className="flex-1">
                                <p className="text-[11px] text-slate-300">{a.message}</p>
                                <p className="text-[10px] text-muted mt-0.5">
                                  {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Deliverables ─────────────────────────────────────── */}
                {activeTab === 'deliverables' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-5 gap-2">
                      {['Requested', 'In Progress', 'Review', 'Approved', 'Delivered'].map(status => {
                        const count = clientDeliverables.filter(d => d.status === status).length;
                        return (
                          <div key={status} className="text-center p-2 rounded-lg glass">
                            <div className="text-base font-bold font-mono text-slate-200">{count}</div>
                            <div className="text-[9px] text-muted leading-snug">{status}</div>
                          </div>
                        );
                      })}
                    </div>

                    {clientDeliverables.length === 0 ? (
                      <div className="text-center py-12 text-muted text-sm">
                        No deliverables yet for this client
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {clientDeliverables.map(d => {
                          const effectiveStatus = deliverableStatuses[d.id] ?? d.status;
                          return (
                          <div
                            key={d.id}
                            onClick={() => openDeliverable(d)}
                            className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/4 cursor-pointer"
                          >
                            <Package size={14} className="text-muted flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] text-slate-300 font-medium truncate">{d.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {deliverableStatusBadge(effectiveStatus)}
                                <span className="text-[10px] text-muted">{d.assignedAgentName}</span>
                              </div>
                            </div>
                            {d.dueDate && (
                              <div className="text-right flex-shrink-0">
                                <span className="text-[10px] text-muted">Due</span>
                                <div className="text-[11px] text-slate-400">
                                  {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── CRM ──────────────────────────────────────────────── */}
                {activeTab === 'crm' && (
                  <div className="flex flex-col gap-4">
                    <GlassCard padding="p-4">
                      <h3 className="text-[11px] text-muted uppercase tracking-wider mb-3">Pipeline Stage</h3>
                      <div className="flex items-center gap-2">
                        {['Prospect', 'Lead', 'Initial Meeting Complete', 'Onboarding Documents Ready', 'Proposal Sent', 'Active'].map((stage, i, arr) => {
                          const isActive = stage === client.crmStage;
                          const isPast = arr.indexOf(client.crmStage) > i;
                          return (
                            <div key={stage} className="flex items-center gap-1.5">
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor: isActive ? client.logoColor : isPast ? '#22c55e' : '#1a1a2e',
                                    border: isActive ? `2px solid ${client.logoColor}` : '2px solid transparent',
                                    boxShadow: isActive ? `0 0 8px ${client.logoColor}60` : 'none',
                                  }}
                                />
                                <span className="text-[8px] text-muted text-center whitespace-nowrap max-w-[50px] leading-tight"
                                      style={{ color: isActive ? client.logoColor : undefined }}>
                                  {stage.replace('Complete', '').replace('Documents Ready', 'Docs').replace('Initial Meeting', 'Meeting').trim()}
                                </span>
                              </div>
                              {i < arr.length - 1 && (
                                <div className="w-6 h-px mb-4"
                                     style={{ backgroundColor: isPast ? '#22c55e' : '#1a1a2e' }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-3">
                      <GlassCard padding="p-3">
                        <div className="text-[10px] text-muted mb-1">Primary Contact</div>
                        <div className="text-sm font-semibold text-slate-200">{client.primaryContact}</div>
                        <div className="text-[11px] text-muted mt-0.5">{client.primaryEmail}</div>
                      </GlassCard>
                      <GlassCard padding="p-3">
                        <div className="text-[10px] text-muted mb-1">Last Activity</div>
                        <div className="text-sm font-semibold text-slate-200">
                          {new Date(client.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-muted mt-0.5">
                          {new Date(client.lastActivity).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </GlassCard>
                    </div>

                    {client.tags.length > 0 && (
                      <div>
                        <h3 className="text-[11px] text-muted uppercase tracking-wider mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {client.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted border border-border">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div
                className="px-6 py-3 border-t flex items-center justify-between flex-shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <span className="text-[10px] text-muted">
                  {client.name} · {client.industry}
                </span>
                <span className="text-[10px] text-muted">Powered by Evolve AI</span>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
