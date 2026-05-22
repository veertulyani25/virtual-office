// ─── Department ──────────────────────────────────────────────────────────────

export type DepartmentId =
  | 'founder'
  | 'client-war-room'
  | 'branding'
  | 'marketing'
  | 'ai-systems'
  | 'sales'
  | 'deliverables'
  | 'meeting-room'
  | 'finance'
  | 'operations';

export interface Department {
  id: DepartmentId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
  agentCount: number;
  isoCol: number;
  isoRow: number;
  isoWidth: number;
  isoDepth: number;
  available: boolean;
}

// ─── CRM & Status Types ───────────────────────────────────────────────────────

export type CRMStage =
  | 'Prospect'
  | 'Lead'
  | 'Initial Meeting Complete'
  | 'Onboarding Documents Ready'
  | 'Proposal Sent'
  | 'Active'
  | 'Churned';

export type DeliverableStatus =
  | 'Requested'
  | 'In Progress'
  | 'Review'
  | 'Approved'
  | 'Delivered';

export type AgentStatus = 'active' | 'idle' | 'processing' | 'standby';

export type ActivityType =
  | 'deliverable_created'
  | 'deliverable_approved'
  | 'client_added'
  | 'deal_moved'
  | 'meeting_scheduled'
  | 'agent_task'
  | 'invoice_sent'
  | 'proposal_sent';

// ─── Client ──────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  industry: string;
  location: string;
  logoColor: string;
  crmStage: CRMStage;
  healthScore: number;
  mrr: number;
  joinedDate: string;
  primaryContact: string;
  primaryEmail: string;
  description: string;
  services: string[];
  deliverableCount: number;
  openTasks: number;
  lastActivity: string;
  npsScore?: number;
  tags: string[];
}

// ─── AI Agent ────────────────────────────────────────────────────────────────

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  department: DepartmentId;
  status: AgentStatus;
  currentTask?: string;
  tasksCompleted: number;
  avatarColor: string;
  specialties: string[];
  deskIndex: number;
}

// ─── Deliverable ─────────────────────────────────────────────────────────────

export interface Deliverable {
  id: string;
  title: string;
  type: string;
  clientId: string;
  clientName: string;
  assignedAgentId: string;
  assignedAgentName: string;
  status: DeliverableStatus;
  department: DepartmentId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
}

// ─── Activity ────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  clientId?: string;
  clientName?: string;
  agentId?: string;
  agentName?: string;
  department: DepartmentId;
  color: string;
  timestamp: string;
  isNew: boolean;
}

// ─── CRM / Sales ─────────────────────────────────────────────────────────────

export interface Deal {
  id: string;
  clientName: string;
  clientId?: string;
  stage: CRMStage;
  value: number;
  probability: number;
  assignedAgent: string;
  lastTouched: string;
  notes: string;
  services: string[];
  nextAction?: string;
}

// ─── Finance ─────────────────────────────────────────────────────────────────

export interface MonthRevenue {
  month: string;
  mrr: number;
  invoiced: number;
  collected: number;
  newClients: number;
  churnedClients: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  services: string[];
}

export interface FinanceStats {
  currentMRR: number;
  mrrGrowthPct: number;
  arrProjected: number;
  totalCollected: number;
  outstandingInvoices: number;
  outstandingAmount: number;
  avgClientLTV: number;
  avgMRRPerClient: number;
}

// ─── Meetings ────────────────────────────────────────────────────────────────

export interface Meeting {
  id: string;
  title: string;
  clientId?: string;
  clientName?: string;
  type: 'client_call' | 'internal' | 'onboarding' | 'review' | 'strategy';
  scheduledAt: string;
  durationMinutes: number;
  attendees: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  summary?: string;
  actionItems?: string[];
}

// ─── Operations ──────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  department: DepartmentId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  dueDate?: string;
  tags: string[];
}

export interface SOP {
  id: string;
  title: string;
  department: DepartmentId;
  version: string;
  lastUpdated: string;
  steps: string[];
  status: 'active' | 'draft' | 'archived';
}
