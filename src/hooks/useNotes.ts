import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useCaseNotes(caseId: string) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    if (caseId === 'case-002' || caseId === 'RS-2026-0002') {
      return {
        data: [
          {
            id: 'note-001',
            caseId: 'case-002',
            content: 'Initial review commenced. Customer Viktor Petrov is a Russian national operating a cash-intensive retail business in East London. Sanctions screening returned a potential match against the OFAC SDN list — the name and date of birth are similar but not identical to the listed individual. Further verification required before this can be cleared.',
            isInternal: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            author: { fullName: 'Sarah Ahmed', role: 'compliance_manager' },
          },
          {
            id: 'note-002',
            caseId: 'case-002',
            content: 'Customer contacted and requested: (1) certified copy of passport, (2) 3 months bank statements, (3) source of wealth documentation. Customer responded within 24 hours. Documents have been uploaded to the Evidence tab for review. Passport appears genuine — holograms and security features present. Bank statements show consistent business income.',
            isInternal: false,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            author: { fullName: 'Sarah Ahmed', role: 'compliance_manager' },
          },
          {
            id: 'note-003',
            caseId: 'case-002',
            content: 'INTERNAL: Potential sanctions match reviewed. Name similarity score is low — Viktor Petrov is a common name. DOB does not match the listed individual. Country of birth differs. Recommend proceeding with EDD completion but flagging for MLRO awareness. MLRO Sarah Ahmed verbally notified on 14 April 2026.',
            isInternal: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author: { fullName: 'Anju Narasegowda', role: 'admin' },
          },
        ],
        isLoading: false,
        isError: false,
        refetch: () => Promise.resolve(),
      } as any;
    }
    return { data: [], isLoading: false, isError: false, refetch: () => Promise.resolve() } as any;
  }
  return useQuery({
    queryKey: ['notes', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/notes`).then(r => r.data.data),
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
