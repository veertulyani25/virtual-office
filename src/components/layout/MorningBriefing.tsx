import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { deliverables } from '@/data/deliverables';
import { clients } from '@/data/clients';

export function MorningBriefing() {
  const {
    isMorningBriefingDismissed,
    dismissMorningBriefing,
    deliverableStatuses,
    openDeliverable,
    openClient,
  } = useAppStore();

  const today = new Date();

  const awaitingApproval = deliverables.filter(
    d => (deliverableStatuses[d.id] ?? d.status) === 'Review',
  );

  const overdueItems = deliverables.filter(d => {
    const status = deliverableStatuses[d.id] ?? d.status;
    return (
      d.dueDate &&
      new Date(d.dueDate) < today &&
      status !== 'Delivered' &&
      status !== 'Approved'
    );
  });

  const healthAlerts = clients.filter(c => c.healthScore < 60);
  const totalAlerts = awaitingApproval.length + overdueItems.length + healthAlerts.length;
  const show = !isMorningBriefingDismissed && totalAlerts > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="morning-briefing"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex-shrink-0 flex items-center gap-3 px-4 border-b border-l-2"
          style={{
            borderColor: 'rgba(245,158,11,0.2)',
            borderLeftColor: '#f59e0b',
            background: 'rgba(245,158,11,0.04)',
            minHeight: 44,
          }}
        >
          <AlertTriangle size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />

          <span className="text-[11px] text-slate-400 flex-shrink-0">
            Here&apos;s what needs you today
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {awaitingApproval.length > 0 && (
              <button
                onClick={() => openDeliverable(awaitingApproval[0])}
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors"
                style={{
                  color: '#f59e0b',
                  borderColor: 'rgba(245,158,11,0.35)',
                  background: 'rgba(245,158,11,0.10)',
                }}
              >
                {awaitingApproval.length} awaiting approval
              </button>
            )}

            {healthAlerts.length > 0 && (
              <button
                onClick={() => openClient(healthAlerts[0])}
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors"
                style={{
                  color: '#ef4444',
                  borderColor: 'rgba(239,68,68,0.35)',
                  background: 'rgba(239,68,68,0.10)',
                }}
              >
                {healthAlerts.length} health alerts
              </button>
            )}

            {overdueItems.length > 0 && (
              <button
                onClick={() => openDeliverable(overdueItems[0])}
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors"
                style={{
                  color: '#f97316',
                  borderColor: 'rgba(249,115,22,0.35)',
                  background: 'rgba(249,115,22,0.10)',
                }}
              >
                {overdueItems.length} overdue
              </button>
            )}
          </div>

          <button
            onClick={dismissMorningBriefing}
            className="ml-auto w-6 h-6 rounded flex items-center justify-center text-muted hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
