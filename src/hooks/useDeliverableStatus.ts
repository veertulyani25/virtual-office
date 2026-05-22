import { useAppStore } from '@/store/useAppStore';
import type { AIAgent, Deliverable, DeliverableStatus } from '@/types';

export function useDeliverableStatus(deliverable: Deliverable): DeliverableStatus {
  return useAppStore((s) => s.deliverableStatuses[deliverable.id] ?? deliverable.status);
}

export function useAgentTask(agent: AIAgent): string | undefined {
  return useAppStore((s) => s.agentTasks[agent.id] ?? agent.currentTask);
}
