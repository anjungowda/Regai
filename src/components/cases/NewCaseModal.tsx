import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Search, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../lib/axios';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const caseSchema = z.object({
  caseType: z.enum(['ONBOARDING', 'KYB_REVIEW', 'PERIODIC_REVIEW', 'TRANSACTION_MONITORING', 'ENHANCED_DUE_DILIGENCE', 'LENDING_REVIEW', 'AD_HOC']),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  priority: z.enum(['NORMAL', 'URGENT']),
  description: z.string().max(500, "Maximum 500 characters").optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "SLA deadline is required"),
  entityId: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      priority: 'NORMAL',
      riskLevel: 'LOW',
      caseType: 'ONBOARDING',
      assignedTo: 'me', // Normally fetches users
    }
  });

  const selectedType = watch('caseType');
  const descriptionValue = watch('description') || '';
  const selectedRisk = watch('riskLevel');
  const selectedPriority = watch('priority');

  // Calculates business days SLA implicitly 
  useEffect(() => {
    if (!selectedType) return;
    const rules: Record<string, number> = {
      ONBOARDING: 5, KYB_REVIEW: 10, PERIODIC_REVIEW: 10,
      TRANSACTION_MONITORING: 3, ENHANCED_DUE_DILIGENCE: 15,
      LENDING_REVIEW: 5, AD_HOC: 7
    };
    
    let daysToAdd = rules[selectedType] || 7;
    let date = new Date();
    
    while (daysToAdd > 0) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        daysToAdd--;
      }
    }
    setValue('dueDate', date.toISOString().split('T')[0]);
  }, [selectedType, setValue]);

  const createCase = useMutation({
    mutationFn: (data: CaseFormData) => axiosInstance.post('/cases', data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      onClose();
      reset();
    }
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto" onClick={onClose}>
        <div 
          className="bg-white w-full max-w-xl md:rounded-2xl rounded-t-2xl shadow-2xl mt-16 md:mt-24 mb-16 p-6 animate-in fade-in zoom-in-95 duration-200" 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F2557]">Create New Case</h2>
              <p className="text-sm text-slate-500 mt-1">Start a new compliance investigation</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-500 hover:text-slate-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
          </div>

          <form onSubmit={handleSubmit((d) => createCase.mutate(d))} className="space-y-6">
            
            {/* Case Type & Entity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Case type <span className="text-red-500">*</span></label>
                <select {...register('caseType')} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] transition-all">
                  <option value="ONBOARDING">Onboarding Review</option>
                  <option value="KYB_REVIEW">Corporate KYB</option>
                  <option value="PERIODIC_REVIEW">Periodic Review</option>
                  <option value="TRANSACTION_MONITORING">Transaction Monitoring</option>
                  <option value="ENHANCED_DUE_DILIGENCE">EDD Escalation</option>
                  <option value="LENDING_REVIEW">Lending Assessment</option>
                  <option value="AD_HOC">Ad-hoc Investigation</option>
                </select>
                {errors.caseType && <span className="text-xs text-red-500">{errors.caseType.message}</span>}
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-sm font-semibold text-slate-700">Link to customer/company</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search entities..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-9 pr-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium text-right">Can be linked later</p>
              </div>
            </div>

            {/* Risk Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Initial Risk Level <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'LOW', label: 'Low', desc: 'Standard DD', color: 'green' },
                  { id: 'MEDIUM', label: 'Medium', desc: 'Enhanced montoring', color: 'amber' },
                  { id: 'HIGH', label: 'High', desc: 'EDD required', color: 'red' },
                  { id: 'CRITICAL', label: 'Critical', desc: 'MLRO escalation', color: 'red-900', border: 'border-red-900', bg: 'bg-red-50' }
                ].map((risk) => {
                  const isSelected = selectedRisk === risk.id;
                  const bdClass = isSelected ? (risk.border || `border-${risk.color}-500`) : 'border-slate-200';
                  const bgClass = isSelected ? (risk.bg || `bg-${risk.color}-50`) : 'hover:bg-slate-50';
                  
                  return (
                    <div 
                      key={risk.id}
                      onClick={() => setValue('riskLevel', risk.id as any)}
                      className={`rounded-xl border-2 p-3 text-center cursor-pointer transition-all ${bdClass} ${bgClass}`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full bg-${risk.color === 'red-900' ? '[#7F1D1D]' : risk.color+'-500'}`}></span>
                        <span className="font-bold text-slate-800 text-sm">{risk.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{risk.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assignee & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Assign to <span className="text-red-500">*</span></label>
                <select {...register('assignedTo')} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] transition-all">
                  <option value="me">Assign to me</option>
                  <option value="unassigned">Leave unassigned in queue</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  SLA deadline <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  {...register('dueDate')}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] transition-all"
                />
              </div>
            </div>

            {/* Description & Priority */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button type="button" onClick={() => setValue('priority', 'NORMAL')} className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md transition-colors ${selectedPriority === 'NORMAL' ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}>Normal</button>
                  <button type="button" onClick={() => setValue('priority', 'URGENT')} className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md transition-colors ${selectedPriority === 'URGENT' ? 'bg-red-100 text-red-700' : 'text-slate-500'}`}>Urgent</button>
                </div>
              </div>
              <textarea 
                {...register('description')}
                rows={3}
                placeholder="Brief summary of why this case was created..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 focus:border-[#1B4FD8] transition-all resize-none"
              ></textarea>
              <div className="flex justify-end">
                <span className="text-[10px] font-medium text-slate-400">{descriptionValue.length}/500</span>
              </div>
            </div>

            {createCase.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                Failed to create case. Please try again.
              </div>
            )}

            <button 
              type="submit" 
              disabled={createCase.isPending}
              className="w-full h-12 bg-[#1B4FD8] hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center transition-all disabled:opacity-70"
            >
              {createCase.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Case'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
