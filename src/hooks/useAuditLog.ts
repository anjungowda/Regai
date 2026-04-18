import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useCaseAuditLog(caseId: string) {
  return useQuery({
    queryKey: ['audit-log', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/audit-log`).then(r => r.data.data),
    enabled: !!caseId,
  });
}
