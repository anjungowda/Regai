import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

export function useOrgUsers() {
  return useQuery({
    queryKey: ['orgUsers'],
    queryFn: () => axiosInstance.get(`/users`).then(r => r.data.data),
  });
}
