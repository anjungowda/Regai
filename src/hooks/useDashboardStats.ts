import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => axiosInstance.get('/dashboard/stats').then(r => r.data.data),
    refetchInterval: 60000, // 60 seconds
    staleTime: 30000,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => axiosInstance.get('/dashboard/recent-activity').then(r => r.data.data),
    refetchInterval: 30000,
  });
}
