import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { MOCK_CASES_LIST } from '../lib/mockData';

export function useCases(filters?: any) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    let filtered = [...MOCK_CASES_LIST]
    
    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status.toUpperCase());
    }
    
    // Apply overdue filter  
    if (filters?.overdue === 'true' || filters?.overdue === true) {
      filtered = filtered.filter(c => 
        new Date(c.dueDate) < new Date() && c.status !== 'CLOSED'
      )
    }
    
    // Apply search
    if (filters?.search) {
      const term = filters.search.toLowerCase()
      filtered = filtered.filter(c => 
        c.caseRef.toLowerCase().includes(term) ||
        (c.customer && c.customer.fullName.toLowerCase().includes(term)) ||
        (c.company && c.company.name.toLowerCase().includes(term))
      )
    }

    // Apply riskLevel filter
    if (filters?.riskLevel) {
      const levels = filters.riskLevel.toUpperCase().split(',')
      filtered = filtered.filter(c => levels.includes(c.riskLevel))
    }

    const total = filtered.length
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)
    
    return {
      data: { cases: paginated, total, page, totalPages: Math.ceil(total / limit) },
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => Promise.resolve(),
      isFetching: false,
      keepPreviousData: true,
    } as any;
  }
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => axiosInstance.get('/cases', { params: filters }).then(r => r.data.data),
    staleTime: 30000,
  });
}

export function useMyCases() {
  return useCases({ limit: 5 });
}
