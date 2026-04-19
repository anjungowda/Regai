import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { MOCK_ORG_USERS } from '../lib/mockData';

export function useOrgUsers() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return { data: MOCK_ORG_USERS, isLoading: false, isError: false, refetch: () => {} } as any;
  }
  return useQuery({
    queryKey: ['orgUsers'],
    queryFn: () => axiosInstance.get(`/users`).then(r => r.data.data),
  });
}
