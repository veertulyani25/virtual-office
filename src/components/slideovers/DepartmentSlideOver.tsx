import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getDepartment } from '@/data/departments';
import { BrandingPanel } from './BrandingPanel';
import { MarketingPanel } from './MarketingPanel';
import { PlaceholderPanel } from './PlaceholderPanel';

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

function DeptPanelContent({ deptId }: { deptId: string }) {
  const dept = getDepartment(deptId);
  if (!dept) return null;

  switch (deptId) {
    case 'branding':  return <BrandingPanel />;
    case 'marketing': return <MarketingPanel />;
    default:          return <PlaceholderPanel dept={dept} />;
  }
}

export function DepartmentSlideOver() {
  const { isSlideOverOpen, selectedDepartment, closeSlideOver } = useAppStore();
  const dept = selectedDepartment ? getDepartment(selectedDepartment) : null;

  return (
    <AnimatePresence>
      {isSlideOverOpen && dept && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeSlideOver}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-[620px] max-w-[92vw] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(8,8,14,0.97)',
              backdropFilter: 'blur(20px)',
              borderLeft: `1px solid rgba(255,255,255,0.07)`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
              style={{
                borderColor: `${dept.color}25`,
                background: `linear-gradient(to right, ${dept.color}08, transparent)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">{dept.label}</h2>
                  <p className="text-[11px] text-muted">{dept.description}</p>
                </div>
              </div>
              <button
                onClick={closeSlideOver}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-slate-300 hover:bg-white/8 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              <DeptPanelContent deptId={dept.id} />
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 border-t flex items-center justify-between flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <span className="text-[10px] text-muted">
                {dept.agentCount} AI agents · Evolve AI
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: dept.color + 'aa' }}
              >
                Powered by Evolve AI
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
