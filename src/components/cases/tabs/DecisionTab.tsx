import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Crosshair, AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

const decisionSchema = z.object({
  outcome: z.enum(['approve_onboarding', 'decline_onboarding', 'escalate_to_edd', 'suspicious_activity', 'no_further_action', 'refer_to_mlro', 'periodic_review_complete']),
  rationale: z.string().min(50, "Rationale must be at least 50 characters to ensure detailed audit trailing"),
  riskScore: z.number().min(0).max(100),
  ddLevelApplied: z.enum(['SDD', 'CDD', 'EDD']),
  additionalNotes: z.string().optional(),
});

type DecisionFormData = z.infer<typeof decisionSchema>;

export const DecisionTab = ({ caseData, updateCase, isManager }: any) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DecisionFormData>({
    resolver: zodResolver(decisionSchema),
    defaultValues: { riskScore: 0, ddLevelApplied: 'CDD' }
  });

  const selectedOutcome = watch('outcome');
  const rationaleLength = watch('rationale')?.length || 0;
  const currentRiskScore = watch('riskScore') || 0;

  const isLocked = caseData.status === 'PENDING_REVIEW' || caseData.status === 'CLOSED';

  const onSubmit = (data: DecisionFormData) => {
    updateCase.mutate({ status: 'PENDING_REVIEW', resolution: JSON.stringify(data) });
  };

  if (isLocked) {
    const rawData = caseData.resolution ? JSON.parse(caseData.resolution) : { outcome: 'approve_onboarding', ddLevelApplied: 'CDD', riskScore: 42, rationale: 'Standard historical review matched internal risk matrices.' };
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wider ${rawData.outcome === 'suspicious_activity' ? 'bg-red-900 text-white' : rawData.outcome === 'decline_onboarding' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {rawData.outcome.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>
            {caseData.status === 'PENDING_REVIEW' && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/> Manager Review Required</span>
            )}
            {caseData.status === 'CLOSED' && (
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Case Closed</span>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Formal Rationale</h4>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{rawData.rationale}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
                <div className={`w-12 h-12 mx-auto rounded-full border-4 flex items-center justify-center font-bold text-lg mb-2 ${rawData.riskScore > 75 ? 'border-red-900 text-red-900' : rawData.riskScore > 50 ? 'border-red-500 text-red-600' : 'border-amber-400 text-amber-600'}`}>
                  {rawData.riskScore}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Risk Score</p>
             </div>
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center flex flex-col justify-center">
                <span className="bg-blue-50 text-blue-700 w-fit mx-auto px-3 py-1 rounded-md font-black tracking-widest mb-2">{rawData.ddLevelApplied}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DD Framework</p>
             </div>
             <div className="col-span-2 bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authorized By</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">SM</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Sarah Manager</p>
                    <p className="text-[10px] text-slate-500">{format(new Date(caseData.updatedAt), 'dd MMM yyyy HH:mm')}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-blue-800">
         <Info className="w-5 h-5 shrink-0 mt-0.5" />
         <p className="text-sm font-medium">Completing the decision record enables you to request a review and close this case. Once submitted, the decision is immutable.</p>
       </div>

       <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8">
         <div className="border-b border-slate-100 pb-4">
           <h3 className="font-bold text-xl text-[#0F2557]">Record Case Decision</h3>
         </div>

         {/* Section 1: Outcome */}
         <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">Decision Outcome <span className="text-red-500">*</span></label>
            <select {...register('outcome')} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 font-medium outline-none focus:ring-2 focus:ring-[#1B4FD8]">
              <option value="">Select official outcome...</option>
              <option value="approve_onboarding">Approve Onboarding</option>
              <option value="decline_onboarding">Decline Onboarding</option>
              <option value="escalate_to_edd">Escalate to Enhanced Due Diligence (EDD)</option>
              <option value="suspicious_activity">Suspicious Activity Identified (SAR to be filed)</option>
              <option value="no_further_action">No Further Action</option>
              <option value="periodic_review_complete">Close — Periodic Review Complete</option>
            </select>
            {errors.outcome && <span className="text-xs text-red-600 font-medium">{errors.outcome.message}</span>}

            {selectedOutcome === 'suspicious_activity' && (
              <div className="bg-red-50 border-2 border-red-600 rounded-xl p-4 mt-3 flex gap-3 text-red-900 animate-in slide-in-from-top-2">
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">⚠ Suspicious Activity Identified: Legal Obligation</p>
                  <p className="text-sm font-medium">You must file a Suspicious Activity Report (SAR) with the National Crime Agency (NCA). Do not inform the customer — tipping off is a criminal offence under POCA 2002.</p>
                </div>
              </div>
            )}
            
            {selectedOutcome === 'decline_onboarding' && (
              <div className="bg-amber-50 border border-amber-400 rounded-xl p-4 mt-3 flex gap-3 text-amber-900 animate-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">Declining Onboarding: Ensure you have documented the specific reasons for the decline decision in the rationale below.</p>
              </div>
            )}
         </div>

         {/* Section 2: Framework */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">Final Risk Score (0-100) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                 <input 
                   type="number" 
                   {...register('riskScore', { valueAsNumber: true })} 
                   min="0" max="100" 
                   className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-[#1B4FD8]" 
                 />
                 <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-lg transition-colors ${currentRiskScore > 75 ? 'border-red-900 text-red-900' : currentRiskScore > 50 ? 'border-red-500 text-red-600' : currentRiskScore > 25 ? 'border-amber-400 text-amber-600' : 'border-green-500 text-green-600'}`}>
                   {currentRiskScore || 0}
                 </div>
              </div>
              {errors.riskScore && <span className="text-xs text-red-600">{errors.riskScore.message}</span>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">DD Level Applied <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {['SDD', 'CDD', 'EDD'].map(lvl => (
                  <label key={lvl} className={`flex-1 flex items-center justify-center border-2 rounded-xl py-3 cursor-pointer transition-colors ${watch('ddLevelApplied') === lvl ? 'border-[#1B4FD8] bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <input type="radio" value={lvl} {...register('ddLevelApplied')} className="hidden" />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
         </div>

         {/* Section 3: Rationale */}
         <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 uppercase tracking-wide">Formal Rationale <span className="text-red-500">*</span></label>
            <textarea
              {...register('rationale')}
              rows={6}
              placeholder="Document the full rationale for this decision. Include: key risk factors identified, due diligence steps taken, sources of information reviewed, and the basis for the conclusion reached."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:border-transparent focus:ring-[#1B4FD8] resize-none"
            ></textarea>
            <div className="flex justify-between items-center">
               <span className={`text-xs font-semibold ${rationaleLength < 50 ? 'text-red-500' : 'text-slate-400'}`}>
                 {rationaleLength} characters (min 50)
               </span>
               {errors.rationale && <span className="text-xs text-red-600 font-medium">{errors.rationale.message}</span>}
            </div>
         </div>

         <div className="pt-6 border-t border-slate-100">
           <button type="submit" disabled={rationaleLength < 50} className="w-full h-12 bg-[#1B4FD8] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50">
             Save Decision & Request Review
           </button>
         </div>
       </form>
    </div>
  );
};
