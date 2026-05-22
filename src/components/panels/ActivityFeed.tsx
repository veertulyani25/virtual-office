import { motion, AnimatePresence } from 'framer-motion';
import { Activity as ActivityIcon, ArrowRight } from 'lucide-react';
import { activities } from '@/data/activities';
import { clients } from '@/data/clients';
import { agents } from '@/data/agents';
import { useAppStore } from '@/store/useAppStore';
import type { Activity } from '@/types';

function timeAgo(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActivityFeed() {
  const { openClient, openAgent } = useAppStore();

  function handleClick(activity: Activity) {
    if (activity.clientId) {
      const client = clients.find(c => c.id === activity.clientId);
      if (client) openClient(client);
    } else if (activity.agentId) {
      const agent = agents.find(a => a.id === activity.agentId);
      if (agent) openAgent(agent);
    }
  }

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col border-l border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <ActivityIcon size={13} className="text-primary" />
          <span className="text-[12px] font-semibold text-slate-200">Live Activity</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>
        <span className="text-[10px] text-muted">{activities.length} events</span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <AnimatePresence initial={false}>
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              onClick={() => handleClick(activity)}
              className="px-4 py-2.5 hover:bg-white/3 cursor-pointer group border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-start gap-2.5">
                {/* Color dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activity.color }}
                  />
                  {i < activities.length - 1 && (
                    <div className="w-px flex-1 bg-border/60 mt-1" style={{ minHeight: 12 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-0.5">
                  {activity.isNew && (
                    <span className="inline-block text-[9px] font-semibold text-primary bg-primary/15 border border-primary/25 rounded px-1 py-px mb-1">
                      NEW
                    </span>
                  )}
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted">{timeAgo(activity.timestamp)}</span>
                    {activity.clientName && (
                      <>
                        <span className="text-border">·</span>
                        <span
                          className="text-[10px] font-medium truncate max-w-[100px]"
                          style={{ color: activity.color + 'cc' }}
                        >
                          {activity.clientName}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ArrowRight size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
