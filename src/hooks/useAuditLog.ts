import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { MOCK_ORG_AUDIT_LOG } from '../lib/mockData';

export function useCaseAuditLog(caseId: string) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return { data: MOCK_ORG_AUDIT_LOG, isLoading: false, isError: false, refetch: () => {} } as any;
  }
  return useQuery({
    queryKey: ['audit-log', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/audit-log`).then(r => r.data.data),
    enabled: !!caseId,
  });
}
