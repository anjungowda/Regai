import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  orgName: z.string().min(2, 'Organization name is required'),
  planType: z.enum(['standard', 'professional']),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const onboardingSchema = z.object({
  displayName: z.string().min(2),
  orgType: z.string().min(2),
  regulatoryFramework: z.string().min(2),
  complianceTeamSize: z.string().min(1),
});

export const createCaseSchema = z.object({
  caseType: z.enum(['onboarding_review', 'kyb_review', 'periodic_review', 'tm_alert', 'edd', 'lending_review', 'ad_hoc']),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  customerId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  slaDeadline: z.string().datetime(),
  description: z.string().optional(),
  priority: z.enum(['normal', 'urgent']).optional(),
}).refine((data) => data.customerId || data.companyId || data.caseType === 'ad_hoc' || data.caseType === 'tm_alert', {
  message: "Case must be linked to a customer or company unless ad hoc or TM alert",
});

export const updateCaseSchema = z.object({
  status: z.enum(['new', 'in_review', 'escalated', 'pending_review', 'closed']).optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  priority: z.enum(['normal', 'urgent']).optional(),
  description: z.string().optional(),
  assignedToId: z.string().uuid().optional().nullable(),
  reviewerId: z.string().uuid().optional().nullable(),
  slaDeadline: z.string().datetime().optional(),
});

export const closeCaseSchema = z.object({
  decisionOutcome: z.string().min(2),
  decisionRationale: z.string().min(10),
  riskScoreAtDecision: z.number().optional(),
  ddLevelApplied: z.string().optional(),
});

export const createCustomerSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().datetime().optional(),
  nationality: z.string().optional(),
  countryOfResidence: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  sourceOfFunds: z.string().optional(),
  isPep: z.boolean().optional(),
  adverseMedia: z.boolean().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  idVerified: z.boolean().optional(),
  sanctionsHit: z.enum(['none', 'potential', 'confirmed']).optional(),
  reviewFrequency: z.enum(['monthly', 'quarterly', 'annually', 'every_3_years']).optional(),
});

export const createCompanySchema = z.object({
  companyName: z.string().min(2),
  registrationNumber: z.string().optional(),
  sicCode: z.string().optional(),
  jurisdiction: z.string().optional(),
  countryOfIncorp: z.string().optional(),
  expectedTurnover: z.string().optional(),
  sourceOfFunds: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial().extend({
  directors: z.any().optional(),
  uboPscDetails: z.any().optional(),
});

export const createNoteSchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().default(false),
});

export const uploadEvidenceSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum([
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]),
  fileSize: z.number().max(26214400, 'File must be less than 25MB'),
  category: z.enum(['identity', 'bank_statement', 'invoice', 'contract', 'corporate', 'regulatory', 'other']),
});

export const updateEvidenceSchema = z.object({
  verificationStatus: z.enum(['pending', 'verified', 'rejected']),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToId: z.string().uuid(),
  dueDate: z.string().datetime(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  isComplete: z.boolean().optional(),
});

export const createAlertSchema = z.object({
  caseId: z.string().uuid().optional(),
  transactionId: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  originCountry: z.string().optional(),
  destinationCountry: z.string().optional(),
  transactionDate: z.string().datetime().optional(),
  riskScore: z.number().optional(),
  triggerRule: z.string().optional(),
  alertReason: z.string().optional(),
  status: z.enum(['open', 'under_review', 'resolved', 'escalated']).optional(),
});

export const updateAlertSchema = z.object({
  status: z.enum(['open', 'under_review', 'resolved', 'escalated']).optional(),
  caseId: z.string().uuid().optional(),
});

export const createRiskAssessmentSchema = z.object({
  customerId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  countryScore: z.number().min(0).max(100),
  occupationScore: z.number().min(0).max(100),
  sourceOfFundsScore: z.number().min(0).max(100),
  pepScore: z.number().min(0).max(100),
  sanctionsScore: z.number().min(0).max(100),
  transactionVolumeScore: z.number().min(0).max(100),
  relationshipDurationScore: z.number().min(0).max(100),
  adverseMediaScore: z.number().min(0).max(100),
  notes: z.string().optional(),
});

export const createFlagSchema = z.object({
  caseId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  flagType: z.enum(['customer_risk', 'transaction_risk', 'operational_risk']),
  flagCategory: z.enum(['pep', 'sanctions', 'adverse_media', 'high_value_cash', 'unusual_routing', 'structuring', 'missing_document', 'expired_document', 'unverified_sof']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
});

export const updateFlagSchema = z.object({
  status: z.enum(['open', 'under_review', 'resolved']),
});

export const createTemplateSchema = z.object({
  templateName: z.string().min(1),
  templateType: z.enum(['policy', 'assessment', 'report', 'checklist', 'regulatory']),
  description: z.string().optional(),
  contentHtml: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(['admin', 'compliance_manager', 'analyst', 'reviewer', 'auditor']),
});

export const updateUserSchema = z.object({
  role: z.enum(['admin', 'compliance_manager', 'analyst', 'reviewer', 'auditor']).optional(),
  isActive: z.boolean().optional(),
  fullName: z.string().min(2).optional(),
});

export const publicContactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  companyName: z.string().min(2),
  jobTitle: z.string().optional(),
  message: z.string().min(20),
  howHeard: z.string().optional(),
});

export const publicDemoSchema = publicContactSchema.extend({
  teamSize: z.string().min(1),
  biggestChallenge: z.string().min(10),
  preferredDate: z.string().datetime(),
  preferredTimeSlot: z.string().min(1),
});



