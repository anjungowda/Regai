import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Task } from '../types';

export function useCaseTasks(caseId: string) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    if (caseId === 'case-002' || caseId === 'RS-2026-0002') {
      return {
        data: [
          { id: 't-001', title: 'Obtain senior management approval to proceed', isComplete: true, completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high', dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'Sarah Ahmed' }, description: 'EDD requires written senior management approval before proceeding.' },
          { id: 't-002', title: 'Conduct enhanced identity verification', isComplete: true, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high', dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'Sarah Ahmed' }, description: 'Obtain certified copies of identity documents.' },
          { id: 't-003', title: 'Verify and document source of wealth', isComplete: true, completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high', dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'James Okonkwo' }, description: 'Not just source of funds — full picture of accumulated wealth.' },
          { id: 't-004', title: 'Check adverse media thoroughly', isComplete: true, completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high', dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'James Okonkwo' }, description: 'Search across news sources, court records and regulatory databases.' },
          { id: 't-005', title: 'Screen against all sanctions and PEP lists', isComplete: false, completedAt: null, priority: 'high', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'Sarah Ahmed' }, description: 'Extended screening — potential match requires resolution.' },
          { id: 't-006', title: 'Document business relationship purpose', isComplete: false, completedAt: null, priority: 'normal', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'James Okonkwo' }, description: 'Record stated purpose and expected activity pattern.' },
          { id: 't-007', title: 'Complete EDD report', isComplete: false, completedAt: null, priority: 'high', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'Sarah Ahmed' }, description: 'Download and complete EDD Report template from Templates library.' },
          { id: 't-008', title: 'Obtain Compliance Manager sign-off', isComplete: false, completedAt: null, priority: 'high', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: { fullName: 'Anju Narasegowda' }, description: 'EDD cases require Compliance Manager approval before closure.' },
        ],
        isLoading: false,
        isError: false,
        refetch: () => Promise.resolve(),
      } as any;
    }
    return { data: [], isLoading: false, isError: false, refetch: () => Promise.resolve() } as any;
  }
  return useQuery({
    queryKey: ['tasks', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/tasks`).then(r => r.data.data),
  });
}

export function useCreateTask(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Task>) => axiosInstance.post(`/cases/${caseId}/tasks`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', caseId] })
  });
}

export function useUpdateTask(caseId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Task>) => axiosInstance.patch(`/cases/${caseId}/tasks/${taskId}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', caseId] })
  });
}

export function useCompleteTask(caseId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => axiosInstance.patch(`/cases/${caseId}/tasks/${taskId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', caseId] });
      queryClient.invalidateQueries({ queryKey: ['audit-log', caseId] });
    }
  });
}

export function useDeleteTask(caseId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axiosInstance.delete(`/cases/${caseId}/tasks/${taskId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', caseId] })
  });
}
