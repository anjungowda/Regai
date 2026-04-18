export interface Organisation {
  id: string;
  name: string;
  registrationNumber: string;
  industry: string;
  establishedDate: string;
  countryOfIncorporation: string;
  subscriptionPlan: string;
  fcaReferenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'compliance_manager' | 'analyst' | 'reviewer' | 'auditor';
  isActive: boolean;
  onboardingComplete: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  organisationId: string;
  customerId?: string;
  companyId?: string;
  caseType: 'ONBOARDING' | 'KYB_REVIEW' | 'TRANSACTION_MONITORING' | 'ENHANCED_DUE_DILIGENCE' | 'PERIODIC_REVIEW' | 'SUSPICIOUS_ACTIVITY_REPORT' | 'FRAUD_INVESTIGATION';
  status: 'NEW' | 'IN_REVIEW' | 'ESCALATED' | 'PENDING_REVIEW' | 'CLOSED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
  dueDate: string;
  description: string;
  resolution?: string;
  fcaReportable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phoneNumber?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  riskScore: number;
  pepStatus: boolean;
  sanctionsHit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  organisationId: string;
  name: string;
  registrationNumber: string;
  jurisdiction: string;
  incorporationDate: string;
  structuredType: string;
  operationalAddress: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  riskScore: number;
  financialSector: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  authorId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  uploadedById: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  documentType: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  organisationId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'CASE' | 'CUSTOMER' | 'COMPANY' | 'TRANSACTION';
  createdAt: string;
}

export interface Task {
  id: string;
  caseId: string;
  assignedTo: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  organisationId: string;
  userId: string;
  action: string;
  entityId: string;
  entityType: string;
  details: Record<string, any>;
  ipAddress: string;
  createdAt: string;
}

export interface Flag {
  id: string;
  entityId: string;
  entityType: 'CUSTOMER' | 'COMPANY' | 'TRANSACTION';
  reason: string;
  source: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  organisationId: string;
  name: string;
  type: 'DOCUMENT' | 'EMAIL' | 'ASSESSMENT';
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organisationId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DemoRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  phone?: string;
  useCase: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DISQUALIFIED';
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: string;
}

export interface RiskAssessment {
  id: string;
  entityId: string;
  entityType: 'CUSTOMER' | 'COMPANY';
  assessorId: string;
  score: number;
  factors: Array<{ category: string; factor: string; score: number; weight: number }>;
  finalRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  narrative: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  createdAt: string;
}
