export const CASE_TYPES = [
  'ONBOARDING',
  'KYB_REVIEW',
  'TRANSACTION_MONITORING',
  'ENHANCED_DUE_DILIGENCE',
  'PERIODIC_REVIEW',
  'SUSPICIOUS_ACTIVITY_REPORT',
  'FRAUD_INVESTIGATION',
] as const;

export const RISK_LEVELS = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;

export const CASE_STATUSES = [
  'NEW',
  'IN_REVIEW',
  'ESCALATED',
  'PENDING_REVIEW',
  'CLOSED',
] as const;

export const USER_ROLES = [
  'ADMIN',
  'COMPLIANCE_OFFICER',
  'ANALYST',
  'MANAGER',
  'VIEWER',
] as const;

export const UK_COMPLIANCE_FRAMEWORKS = [
  'FCA_HANDBOOK',
  'MLR_2017',
  'JMLSG_GUIDANCE',
  'PROCEEDS_OF_CRIME_ACT_2002',
  'TERRORISM_ACT_2000',
  'PAYMENT_SERVICES_REGULATIONS_2017',
  'DATA_PROTECTION_ACT_2018',
] as const;

export const DEFAULT_SLA_DAYS: Record<typeof CASE_TYPES[number], number> = {
  ONBOARDING: 2,
  KYB_REVIEW: 5,
  TRANSACTION_MONITORING: 1,
  ENHANCED_DUE_DILIGENCE: 7,
  PERIODIC_REVIEW: 14,
  SUSPICIOUS_ACTIVITY_REPORT: 1,
  FRAUD_INVESTIGATION: 1,
};

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    FEATURES: '/features',
    PRICING: '/pricing',
    ABOUT: '/about',
    CONTACT: '/contact',
    DEMO: '/demo',
    BLOG: '/blog',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PROTECTED: {
    ONBOARDING: '/onboarding',
    DASHBOARD: '/dashboard',
    CASES: {
      LIST: '/cases',
      DETAIL: (id: string) => `/cases/${id}`,
      NEW: '/cases/new',
    },
    CUSTOMERS: {
      LIST: '/customers',
      DETAIL: (id: string) => `/customers/${id}`,
    },
    RISK: '/risk-scoring',
    EVIDENCE: '/evidence',
    TEMPLATES: '/templates',
    ALERTS: '/alerts',
    REPORTS: '/reports',
    ADMIN: '/admin',
  },
} as const;
