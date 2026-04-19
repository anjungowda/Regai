import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useCaseEvidence(caseId: string) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    if (caseId === 'case-002' || caseId === 'RS-2026-0002') {
      return {
        data: [
          {
            id: 'ev-001',
            caseId: 'case-002',
            fileName: 'passport_viktor_petrov.pdf',
            fileType: 'application/pdf',
            fileSize: 2400000,
            documentType: 'IDENTITY',
            verificationStatus: 'VERIFIED',
            version: 1,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: 'user-002',
            uploader: { fullName: 'Sarah Ahmed' },
          },
          {
            id: 'ev-002',
            caseId: 'case-002',
            fileName: 'bank_statements_jan_mar_2026.pdf',
            fileType: 'application/pdf',
            fileSize: 5800000,
            documentType: 'BANK_STATEMENT',
            verificationStatus: 'VERIFIED',
            version: 1,
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: 'user-002',
            uploader: { fullName: 'Sarah Ahmed' },
          },
          {
            id: 'ev-003',
            caseId: 'case-002',
            fileName: 'source_of_wealth_declaration.pdf',
            fileType: 'application/pdf',
            fileSize: 1200000,
            documentType: 'OTHER',
            verificationStatus: 'PENDING',
            version: 1,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: 'user-003',
            uploader: { fullName: 'James Okonkwo' },
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
    queryKey: ['evidence', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/evidence`).then(r => r.data.data),
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
