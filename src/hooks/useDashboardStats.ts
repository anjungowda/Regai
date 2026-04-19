import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useDashboardStats() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return {
      data: {
        stats: {
          totalOpenCases: 9,
          highRiskCases: 4,
          overdueSlaCases: 2,
          alertsThisWeek: 7,
          casesClosedThisMonth: 3,
          pendingEvidence: 5,
          riskDistribution: { low: 2, medium: 3, high: 3, critical: 1 }
        }
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => Promise.resolve(),
      isFetching: false,
    } as any;
  }
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => axiosInstance.get('/dashboard/stats').then(r => r.data.data),
    refetchInterval: 60000,
    staleTime: 30000,
  })
}

export function useRecentActivity() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return {
      data: {
        activity: [
          { id: '1', userFullName: 'Sarah Ahmed', actionType: 'case_created', detail: { caseRef: 'RS-2026-0001' }, entityType: 'case', entityId: 'case-001', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
          { id: '2', userFullName: 'James Okonkwo', actionType: 'evidence_uploaded', detail: { caseRef: 'RS-2026-0002', fileName: 'passport_scan.pdf' }, entityType: 'evidence', entityId: 'case-002', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
          { id: '3', userFullName: 'Priya Sharma', actionType: 'note_created', detail: { caseRef: 'RS-2026-0003' }, entityType: 'note', entityId: 'case-003', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
          { id: '4', userFullName: 'Sarah Ahmed', actionType: 'case_closed', detail: { caseRef: 'RS-2026-0010' }, entityType: 'case', entityId: 'case-010', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '5', userFullName: 'James Okonkwo', actionType: 'risk_assessed', detail: { caseRef: 'RS-2026-0004', riskLevel: 'High' }, entityType: 'case', entityId: 'case-004', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '6', userFullName: 'Anju Narasegowda', actionType: 'case_updated', detail: { caseRef: 'RS-2026-0002' }, entityType: 'case', entityId: 'case-002', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '7', userFullName: 'Priya Sharma', actionType: 'task_completed', detail: { caseRef: 'RS-2026-0005', taskTitle: 'Verify customer identity' }, entityType: 'task', entityId: 'case-005', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '8', userFullName: 'James Okonkwo', actionType: 'evidence_uploaded', detail: { caseRef: 'RS-2026-0007', fileName: 'bank_statement.pdf' }, entityType: 'evidence', entityId: 'case-007', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '9', userFullName: 'Sarah Ahmed', actionType: 'case_assigned', detail: { caseRef: 'RS-2026-0008' }, entityType: 'case', entityId: 'case-008', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '10', userFullName: 'Anju Narasegowda', actionType: 'login', detail: {}, entityType: 'user', entityId: 'user-001', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        ]
      },
      isLoading: false,
      isError: false,
      refetch: () => Promise.resolve(),
    } as any;
  }
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => axiosInstance.get('/dashboard/recent-activity').then(r => r.data.data),
    refetchInterval: 30000,
  })
}
