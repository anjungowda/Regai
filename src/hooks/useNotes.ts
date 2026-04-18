import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useCaseNotes(caseId: string) {
  return useQuery({
    queryKey: ['notes', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/notes`).then(r => r.data.data),
    enabled: !!caseId,
  });
}

export function useCreateNote(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string, isInternal: boolean }) => axiosInstance.post(`/cases/${caseId}/notes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', caseId] });
      queryClient.invalidateQueries({ queryKey: ['audit-log', caseId] });
    }
  });
}
