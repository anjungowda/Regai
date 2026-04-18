import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Task } from '../types';

export function useCaseTasks(caseId: string) {
  return useQuery({
    queryKey: ['tasks', caseId],
    queryFn: () => axiosInstance.get(`/cases/${caseId}/tasks`).then(r => r.data.data),
    enabled: !!caseId,
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
