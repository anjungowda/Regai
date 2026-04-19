import { User, Organisation, Case, Customer, CaseNote, Evidence, Alert, Task, AuditLogEntry, Flag, Subscription, Notification } from '../types';

export const MOCK_CASES_LIST = [
  {
    id: 'case-001',
    caseRef: 'RS-2026-0001',
    caseType: 'ONBOARDING',
    riskLevel: 'LOW',
    status: 'IN_REVIEW',
    priority: 'normal',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'John Williams', firstName: 'John', lastName: 'Williams' },
    assignedTo: { fullName: 'James Okonkwo' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'Standard onboarding review.'
  },
  {
    id: 'case-002',
    caseRef: 'RS-2026-0002',
    caseType: 'ENHANCED_DUE_DILIGENCE',
    riskLevel: 'HIGH',
    status: 'IN_REVIEW',
    priority: 'urgent',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Viktor Petrov', firstName: 'Viktor', lastName: 'Petrov' },
    assignedTo: { fullName: 'Sarah Ahmed' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'EDD investigation required for high-risk individual.'
  },
  {
    id: 'case-003',
    caseRef: 'RS-2026-0003',
    caseType: 'TRANSACTION_MONITORING',
    riskLevel: 'MEDIUM',
    status: 'NEW',
    priority: 'normal',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Maria Santos', firstName: 'Maria', lastName: 'Santos' },
    assignedTo: { fullName: 'Priya Sharma' },
    organisationId: 'org-001',
    createdById: 'user-002',
    description: 'Suspicious transaction pattern detected.'
  },
  {
    id: 'case-004',
    caseRef: 'RS-2026-0004',
    caseType: 'KYB_REVIEW',
    riskLevel: 'HIGH',
    status: 'ESCALATED',
    priority: 'urgent',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    company: { name: 'Nexus Trading Ltd' },
    assignedTo: { fullName: 'James Okonkwo' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'Complex ownership structure requires deeper investigation.'
  },
  {
    id: 'case-005',
    caseRef: 'RS-2026-0005',
    caseType: 'PERIODIC_REVIEW',
    riskLevel: 'MEDIUM',
    status: 'NEW',
    priority: 'normal',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Robert Thompson', firstName: 'Robert', lastName: 'Thompson' },
    assignedTo: { fullName: 'Priya Sharma' },
    organisationId: 'org-001',
    createdById: 'user-002',
    description: 'Annual periodic review.'
  },
  {
    id: 'case-006',
    caseRef: 'RS-2026-0006',
    caseType: 'ENHANCED_DUE_DILIGENCE',
    riskLevel: 'HIGH',
    status: 'PENDING_REVIEW',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    customer: { fullName: 'Elena Vasquez', firstName: 'Elena', lastName: 'Vasquez' },
    assignedTo: { fullName: 'James Okonkwo' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'EDD follow-up on source of funds.'
  },
  {
    id: 'case-007',
    caseRef: 'RS-2026-0007',
    caseType: 'ONBOARDING',
    riskLevel: 'HIGH',
    status: 'IN_REVIEW',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Fatima Al-Rashid', firstName: 'Fatima', lastName: 'Al-Rashid' },
    assignedTo: { fullName: 'Priya Sharma' },
    organisationId: 'org-001',
    createdById: 'user-002',
    description: 'High net worth individual onboarding.'
  },
  {
    id: 'case-008',
    caseRef: 'RS-2026-0008',
    caseType: 'TRANSACTION_MONITORING',
    riskLevel: 'MEDIUM',
    status: 'IN_REVIEW',
    priority: 'normal',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Li Wei', firstName: 'Li', lastName: 'Wei' },
    assignedTo: { fullName: 'James Okonkwo' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'Unusual cross-border transfer activity.'
  },
  {
    id: 'case-009',
    caseRef: 'RS-2026-0009',
    caseType: 'LENDING_REVIEW',
    riskLevel: 'LOW',
    status: 'NEW',
    priority: 'normal',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    company: { name: 'Meridian Finance Ltd' },
    assignedTo: { fullName: 'Priya Sharma' },
    organisationId: 'org-001',
    createdById: 'user-002',
    description: 'Corporate lending risk assessment.'
  },
  {
    id: 'case-010',
    caseRef: 'RS-2026-0010',
    caseType: 'PERIODIC_REVIEW',
    riskLevel: 'MEDIUM',
    status: 'CLOSED',
    priority: 'normal',
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customer: { fullName: 'Maria Santos', firstName: 'Maria', lastName: 'Santos' },
    assignedTo: { fullName: 'James Okonkwo' },
    organisationId: 'org-001',
    createdById: 'user-001',
    description: 'Review completed and cleared.'
  },
];

export const MOCK_ORGANISATION: Organisation = {
  id: 'org-001',
  name: 'Horizon Payments Ltd',
  displayName: 'Horizon Payments Ltd',
  registrationNumber: '12345678',
  industry: 'Fintech',
  establishedDate: '2020-01-15T00:00:00Z',
  countryOfIncorporation: 'UK',
  subscriptionPlan: 'professional',
  fcaReferenceNumber: '987654',
  regulatoryFramework: 'FCA — Payment Services Regulations',
  createdAt: '2020-01-15T00:00:00Z',
  updatedAt: '2026-04-19T00:00:00Z',
};

export const MOCK_USER = {
  id: 'user-001',
  orgId: 'org-001',
  email: 'admin@horizonpayments.com',
  fullName: 'Anju Narasegowda',
  role: 'admin',
  onboardingComplete: true,
  isActive: true,
  failedLoginAttempts: 0,
  createdAt: new Date('2026-01-01').toISOString(),
  updatedAt: new Date('2026-01-01').toISOString(),
}

export const MOCK_DASHBOARD_STATS = {
  totalOpenCases: 9,
  highRiskCases: 4,
  overdueSlaCases: 2,
  alertsThisWeek: 7,
  casesClosedThisMonth: 3,
  pendingEvidence: 5,
  riskDistribution: { low: 2, medium: 3, high: 3, critical: 1 }
}

export const MOCK_ORG_USERS = [
  { id: 'user-001', organisationId: 'org-001', firstName: 'Anju', lastName: 'Narasegowda', fullName: 'Anju Narasegowda', email: 'admin@horizonpayments.com', role: 'admin', isActive: true, onboardingComplete: true, lastLoginAt: new Date().toISOString(), createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-002', organisationId: 'org-001', firstName: 'Sarah', lastName: 'Ahmed', fullName: 'Sarah Ahmed', email: 'manager@horizonpayments.com', role: 'compliance_manager', isActive: true, onboardingComplete: true, lastLoginAt: new Date().toISOString(), createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-003', organisationId: 'org-001', firstName: 'James', lastName: 'Okonkwo', fullName: 'James Okonkwo', email: 'analyst@horizonpayments.com', role: 'analyst', isActive: true, onboardingComplete: true, lastLoginAt: new Date().toISOString(), createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
] as User[];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', userId: 'user-001', title: 'New Alert', message: 'High risk transaction blocked', isRead: false, type: 'ERROR', createdAt: new Date().toISOString() },
  { id: 'notif-2', userId: 'user-001', title: 'Task Due', message: 'Review EDD case Viktor Petrov', isRead: false, type: 'WARNING', createdAt: new Date().toISOString() }
];

export const MOCK_ORG_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'log-1', organisationId: 'org-001', userId: 'user-001', action: 'LOGIN', entityId: 'user-001', entityType: 'USER', details: {}, ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log-2', organisationId: 'org-001', userId: 'user-001', action: 'CREATE_CASE', entityId: 'case-003', entityType: 'CASE', details: { caseRef: 'RS-2026-0003' }, ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

