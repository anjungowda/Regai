import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useCaseEvidence(caseId: string) {
  return useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/evidence`).then(r => r.data.data),
    enabled: !!caseId,
  });
}

export function useDeleteEvidence(caseId: string, evidenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axiosInstance.delete(`/cases/${caseId}/evidence/${evidenceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', caseId] });
      queryClient.invalidateQueries({ queryKey: ['audit-log', caseId] });
    }
  });
}

export function useUpdateEvidence(caseId: string, evidenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { verificationStatus: string }) => axiosInstance.patch(`/cases/${caseId}/evidence/${evidenceId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', caseId] });
      queryClient.invalidateQueries({ queryKey: ['audit-log', caseId] });
    }
  });
}
