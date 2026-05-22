import type { MonthRevenue, Invoice, FinanceStats } from '@/types';

export const monthlyRevenue: MonthRevenue[] = [
  { month: 'Jun 25', mrr: 180000, invoiced: 185000, collected: 165000, newClients: 2, churnedClients: 0 },
  { month: 'Jul 25', mrr: 245000, invoiced: 250000, collected: 230000, newClients: 2, churnedClients: 0 },
  { month: 'Aug 25', mrr: 310000, invoiced: 315000, collected: 295000, newClients: 2, churnedClients: 0 },
  { month: 'Sep 25', mrr: 375000, invoiced: 380000, collected: 360000, newClients: 1, churnedClients: 0 },
  { month: 'Oct 25', mrr: 330000, invoiced: 340000, collected: 310000, newClients: 1, churnedClients: 1 },
  { month: 'Nov 25', mrr: 390000, invoiced: 400000, collected: 375000, newClients: 2, churnedClients: 0 },
  { month: 'Dec 25', mrr: 450000, invoiced: 460000, collected: 440000, newClients: 1, churnedClients: 0 },
  { month: 'Jan 26', mrr: 520000, invoiced: 530000, collected: 505000, newClients: 3, churnedClients: 0 },
  { month: 'Feb 26', mrr: 480000, invoiced: 490000, collected: 465000, newClients: 1, churnedClients: 1 },
  { month: 'Mar 26', mrr: 565000, invoiced: 575000, collected: 550000, newClients: 2, churnedClients: 0 },
  { month: 'Apr 26', mrr: 600000, invoiced: 612000, collected: 585000, newClients: 2, churnedClients: 0 },
  { month: 'May 26', mrr: 635000, invoiced: 648000, collected: 590000, newClients: 1, churnedClients: 0 },
];

export const financeStats: FinanceStats = {
  currentMRR: 635000,
  mrrGrowthPct: 12.3,
  arrProjected: 7620000,
  totalCollected: 4870000,
  outstandingInvoices: 3,
  outstandingAmount: 195000,
  avgClientLTV: 980000,
  avgMRRPerClient: 81875,
};

export const invoices: Invoice[] = [
  { id: 'inv-001', clientId: 'raveras', clientName: 'Raveras', amount: 120000, status: 'sent', issuedDate: '2026-05-01', dueDate: '2026-05-15', services: ['Social Media', 'Meta Ads', 'Email Marketing'] },
  { id: 'inv-002', clientId: 'modera-real-estate', clientName: 'Modera Real Estate', amount: 110000, status: 'paid', issuedDate: '2026-05-01', dueDate: '2026-05-15', paidDate: '2026-05-10', services: ['Social Media', 'Meta Ads', 'Content Calendar'] },
  { id: 'inv-003', clientId: 'tirupati-group', clientName: 'Tirupati Group', amount: 85000, status: 'paid', issuedDate: '2026-05-01', dueDate: '2026-05-15', paidDate: '2026-05-08', services: ['Social Media', 'Meta Ads', 'Brand Strategy'] },
  { id: 'inv-004', clientId: 'llumar-kenya', clientName: 'LLumar Kenya', amount: 65000, status: 'overdue', issuedDate: '2026-04-01', dueDate: '2026-04-15', services: ['Content Calendar', 'Social Media'] },
  { id: 'inv-005', clientId: 'al-husnain-motors', clientName: 'Al Husnain Motors', amount: 75000, status: 'paid', issuedDate: '2026-05-01', dueDate: '2026-05-15', paidDate: '2026-05-12', services: ['Social Media', 'Meta Ads'] },
  { id: 'inv-006', clientId: '11-eleven-motors', clientName: '11 Eleven Motors', amount: 55000, status: 'sent', issuedDate: '2026-05-01', dueDate: '2026-05-20', services: ['Social Media', 'Ad Creatives'] },
  { id: 'inv-007', clientId: 'auto-accelerate', clientName: 'Auto Accelerate', amount: 45000, status: 'paid', issuedDate: '2026-05-01', dueDate: '2026-05-15', paidDate: '2026-05-14', services: ['Brand Strategy', 'Social Media'] },
  { id: 'inv-008', clientId: 'landmark-automobile', clientName: 'Landmark Automobile', amount: 80000, status: 'paid', issuedDate: '2026-05-01', dueDate: '2026-05-15', paidDate: '2026-05-07', services: ['Social Media', 'Reel Scripts', 'Meta Ads'] },
];
