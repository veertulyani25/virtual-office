import { CommandBar } from '@/components/layout/CommandBar';
import { MorningBriefing } from '@/components/layout/MorningBriefing';
import { ActivityFeed } from '@/components/panels/ActivityFeed';
import { AgentDetailPanel } from '@/components/panels/AgentDetailPanel';
import MarketingRoom from '@/components/office/MarketingRoom';
import { AgentRoster } from '@/components/agents/AgentRoster';
import { DepartmentSlideOver } from '@/components/slideovers/DepartmentSlideOver';
import { ClientDashboard } from '@/components/modals/ClientDashboard';
import { DeliverableModal } from '@/components/modals/DeliverableModal';
import { DeliverableCardStrip } from '@/components/deliverables/DeliverableCardStrip';

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg text-slate-300 font-sans">
      <CommandBar />
      <MorningBriefing />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden border-r border-border flex flex-col">
          <MarketingRoom />
          <AgentRoster />
        </main>

        <ActivityFeed />
      </div>

      <DeliverableCardStrip />

      <DepartmentSlideOver />
      <ClientDashboard />
      <AgentDetailPanel />
      <DeliverableModal />
    </div>
  );
}
