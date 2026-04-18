import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useAuth } from './useAuth';

export interface CasesQueryParams {
  status?: string;
  riskLevel?: string;
  caseType?: string;
  assignedToId?: string;
  overdue?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useCases(params: CasesQueryParams = {}) {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => axiosInstance.get('/cases', { params }).then(r => r.data.data),
    staleTime: 30000,
  });
}

export function useMyCases() {
  const { user } = useAuth();
  
  // Analysts see only their cases; managers see all
  const isManager = ['admin', 'compliance_manager'].includes(user?.role ?? '');
  
  return useCases({
    assignedToId: isManager ? undefined : user?.id,
    status: 'new,in_review,escalated,pending_review', // string parameter passed to exclude closed
    limit: 20,
    sortBy: 'slaDeadline',
    sortOrder: 'asc', // most urgent first
  });
}
