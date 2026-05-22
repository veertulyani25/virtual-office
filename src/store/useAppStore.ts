import { create } from 'zustand';
import type { DepartmentId, Client, AIAgent, Deliverable, DeliverableStatus } from '@/types';

interface AppStore {
  // ─── Existing ────────────────────────────────────────────────────────────
  selectedDepartment: DepartmentId | null;
  selectedClient: Client | null;
  isSlideOverOpen: boolean;
  isClientModalOpen: boolean;
  commandQuery: string;

  openDepartment: (id: DepartmentId) => void;
  openClient: (client: Client) => void;
  closeSlideOver: () => void;
  closeClientModal: () => void;
  setCommandQuery: (q: string) => void;

  // ─── Agent detail panel ──────────────────────────────────────────────────
  selectedAgent: AIAgent | null;
  isAgentPanelOpen: boolean;
  openAgent: (agent: AIAgent) => void;
  closeAgentPanel: () => void;

  // ─── Deliverable modal ───────────────────────────────────────────────────
  selectedDeliverable: Deliverable | null;
  isDeliverableModalOpen: boolean;
  openDeliverable: (d: Deliverable) => void;
  closeDeliverableModal: () => void;

  // ─── View toggle (Team cards vs Kanban pipeline) ─────────────────────────
  isPipelineViewActive: boolean;
  togglePipelineView: () => void;

  // ─── Morning briefing ────────────────────────────────────────────────────
  isMorningBriefingDismissed: boolean;
  dismissMorningBriefing: () => void;

  // ─── Mutable session overrides ───────────────────────────────────────────
  deliverableStatuses: Record<string, DeliverableStatus>;
  updateDeliverableStatus: (id: string, status: DeliverableStatus) => void;

  agentTasks: Record<string, string | undefined>;
  assignAgentTask: (agentId: string, task: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // ─── Existing ────────────────────────────────────────────────────────────
  selectedDepartment: null,
  selectedClient: null,
  isSlideOverOpen: false,
  isClientModalOpen: false,
  commandQuery: '',

  openDepartment: (id) =>
    set({ selectedDepartment: id, isSlideOverOpen: true }),

  openClient: (client) =>
    set({ selectedClient: client, isClientModalOpen: true }),

  closeSlideOver: () =>
    set({ isSlideOverOpen: false, selectedDepartment: null }),

  closeClientModal: () =>
    set({ isClientModalOpen: false, selectedClient: null }),

  setCommandQuery: (q) =>
    set({ commandQuery: q }),

  // ─── Agent detail panel ──────────────────────────────────────────────────
  selectedAgent: null,
  isAgentPanelOpen: false,

  openAgent: (agent) =>
    set({ selectedAgent: agent, isAgentPanelOpen: true, isDeliverableModalOpen: false }),

  closeAgentPanel: () =>
    set({ isAgentPanelOpen: false, selectedAgent: null }),

  // ─── Deliverable modal ───────────────────────────────────────────────────
  selectedDeliverable: null,
  isDeliverableModalOpen: false,

  openDeliverable: (d) =>
    set({ selectedDeliverable: d, isDeliverableModalOpen: true }),

  closeDeliverableModal: () =>
    set({ isDeliverableModalOpen: false, selectedDeliverable: null }),

  // ─── View toggle ─────────────────────────────────────────────────────────
  isPipelineViewActive: false,
  togglePipelineView: () =>
    set((s) => ({ isPipelineViewActive: !s.isPipelineViewActive })),

  // ─── Morning briefing ────────────────────────────────────────────────────
  isMorningBriefingDismissed: false,
  dismissMorningBriefing: () =>
    set({ isMorningBriefingDismissed: true }),

  // ─── Mutable session overrides ───────────────────────────────────────────
  deliverableStatuses: {},
  updateDeliverableStatus: (id, status) =>
    set((s) => ({ deliverableStatuses: { ...s.deliverableStatuses, [id]: status } })),

  agentTasks: {},
  assignAgentTask: (agentId, task) =>
    set((s) => ({ agentTasks: { ...s.agentTasks, [agentId]: task } })),
}));
