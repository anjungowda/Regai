import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Case } from '../types';
import { MOCK_CASES_LIST } from '../lib/mockData';

export function useCaseDetail(id: string) {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    // Find from mock cases list first
    const basicCase = MOCK_CASES_LIST.find(c => c.id === id || c.caseRef === id);
    
    // Enhanced detail for RS-2026-0002 (Viktor Petrov EDD)
    if (id === 'case-002' || id === 'RS-2026-0002') {
      return {
        data: {
          ...basicCase,
          id: 'case-002',
          caseRef: 'RS-2026-0002',
          caseType: 'ENHANCED_DUE_DILIGENCE',
          riskLevel: 'HIGH',
          status: 'IN_REVIEW',
          priority: 'urgent',
          description: 'EDD investigation required for high-risk individual. Customer is a Russian national with a potential sanctions match and cash-intensive business. Source of wealth requires detailed verification.',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          organisationId: 'org-001',
          createdById: 'user-001',
          customer: {
            id: 'cust-003',
            fullName: 'Viktor Petrov',
            firstName: 'Viktor',
            lastName: 'Petrov',
            dateOfBirth: '1978-03-15',
            nationality: 'Russian',
            countryOfResidence: 'United Kingdom',
            occupation: 'Cash-intensive retail business owner',
            sourceOfFunds: 'Business income',
            address: '47 Commercial Road, London E1 1LN',
            idVerified: true,
            isPep: false,
            sanctionsHit: 'potential',
            adverseMedia: false,
            riskRating: 'high',
            riskScore: 68,
            orgId: 'org-001',
          },
          assignedTo: {
            id: 'user-002',
            fullName: 'Sarah Ahmed',
            role: 'compliance_manager',
            email: 'manager@horizonpayments.com',
          },
          createdBy: {
            id: 'user-001',
            fullName: 'Anju Narasegowda',
            role: 'admin',
          },
          reviewer: null,
          _count: {
            notes: 3,
            evidence: 3,
            tasks: 8,
            alerts: 1,
            flags: 2,
          },
          decisionOutcome: null,
          decisionRationale: null,
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      } as any;
    }
    
    // For all other cases: return basic data with assignedTo populated
    if (basicCase) {
      return {
        data: {
          ...basicCase,
          createdBy: { id: 'user-001', fullName: 'Anju Narasegowda', role: 'admin' },
          reviewer: null,
          _count: { notes: 2, evidence: 1, tasks: 4, alerts: 0, flags: 0 },
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve(),
      } as any;
    }
    
    // Case not found
    return {
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Case not found'),
      refetch: () => Promise.resolve(),
    } as any;
  }
  
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => axiosInstance.get(`/cases/${id}`).then(r => r.data.data),
    enabled: !!id,
  });
}

export function useUpdateCase(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Case>) => axiosInstance.patch(`/cases/${id}`, data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['audit-log', id] });
    }
  });
}
