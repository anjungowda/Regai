import { format, formatDistanceToNow, addDays, isBefore, differenceInDays } from 'date-fns';
import { CASE_TYPES, DEFAULT_SLA_DAYS } from '../constants';

/**
 * Formats a date using British English standards (dd/MM/yyyy).
 */
export const formatDate = (date: string | Date | number): string => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
};

/**
 * Formats a date to show relative time (e.g., "2 days ago", "in 3 hours").
 */
export const formatRelativeTime = (date: string | Date | number): string => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Formats a number to UK currency (GBP).
 */
export const formatCurrency = (amount: number, currencyCode: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Returns Tailwind classes for risk level colours based on design system.
 */
export const getRiskLevelColour = (level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): string => {
  switch (level) {
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'HIGH':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CRITICAL':
      return 'bg-red-900 text-white border-red-900';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Returns Tailwind classes for case status colours based on design system.
 */
export const getCaseStatusColour = (status: 'NEW' | 'IN_REVIEW' | 'ESCALATED' | 'PENDING_REVIEW' | 'CLOSED'): string => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800';
    case 'IN_REVIEW':
      return 'bg-amber-100 text-amber-800';
    case 'ESCALATED':
      return 'bg-red-100 text-red-800';
    case 'PENDING_REVIEW':
      return 'bg-purple-100 text-purple-800';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Generates a unique, UK compliance friendly Case ID based on organisation sequence.
 */
export const generateCaseId = (orgSequence: number, prefix: string = 'CAS'): string => {
  const paddedSequence = orgSequence.toString().padStart(6, '0');
  const yearMonth = format(new Date(), 'yyMM');
  return `${prefix}-${yearMonth}-${paddedSequence}`;
};

/**
 * Calculates the SLA deadline date based on case type.
 */
export const calculateSLADeadline = (caseType: typeof CASE_TYPES[number], createdAt: string | Date | number): Date => {
  const daysToAdd = DEFAULT_SLA_DAYS[caseType] || 7;
  return addDays(new Date(createdAt), daysToAdd);
};

/**
 * Checks if a given SLA deadline is overdue (prior to current date).
 */
export const isOverdue = (slaDeadline: string | Date | number): boolean => {
  return isBefore(new Date(slaDeadline), new Date());
};

/**
 * Gets the number of days remaining until the SLA deadline.
 * Negative number implies overdue.
 */
export const getDaysRemaining = (slaDeadline: string | Date | number): number => {
  return differenceInDays(new Date(slaDeadline), new Date());
};
