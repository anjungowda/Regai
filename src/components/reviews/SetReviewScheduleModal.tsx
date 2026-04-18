import React, { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const SetReviewScheduleModal = ({ isOpen, onClose, customer }: any) => {
  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: { freq: 'Annually', lastDate: '2025-05-20', nextDate: '2026-05-20' }
  });

  useEffect(() => {
    if (customer) {
      setValue('freq', customer.freq);
      setValue('lastDate', customer.lastRev);
      setValue('nextDate', customer.nextRev);
    }
  }, [customer, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-xl font-bold text-[#0F2557]">Set Period Review Schedule</h2>
             <p className="text-sm text-slate-500 mt-1">Configuring threshold dates for {customer?.name}</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
         </div>

         <form className="space-y-6">
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Review Frequency</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {[
                   { val: 'Monthly', desc: 'For very high-risk customers (Critical)' },
                   { val: '6-monthly', desc: 'For High-risk customers. Recommended.' },
                   { val: 'Annually', desc: 'For Medium-risk customers. Standard practice.' },
                   { val: '3-yearly', desc: 'For Low-risk customers. Minimum frequency.' }
                 ].map(o => (
                    <label key={o.val} className={`p-4 border-2 rounded-xl cursor-pointer transition flex flex-col gap-1 ${watch('freq') === o.val ? 'border-[#1B4FD8] bg-blue-50 text-blue-900 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                       <input type="radio" value={o.val} {...register('freq')} className="hidden" />
                       <span className="font-bold text-sm">{o.val}</span>
                       <span className="text-xs font-medium opacity-80">{o.desc}</span>
                    </label>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Last Review Date</label>
                  <div className="relative">
                     <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                     <input type="date" {...register('lastDate')} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Next Review Date (Computed)</label>
                  <div className="relative">
                     <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                     <input type="date" {...register('nextDate')} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1B4FD8] outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  </div>
                  <p className="text-[10px] uppercase text-slate-400 mt-1 font-bold">Auto-calculated using {watch('freq')} frequency offset.</p>
               </div>
            </div>

            <div className="flex justify-end pt-4">
               <button type="button" onClick={onClose} className="px-5 py-2 font-bold text-white bg-[#1B4FD8] shadow-sm hover:bg-blue-700 text-sm rounded-xl transition">Apply Schedule Parameters</button>
            </div>
         </form>
      </div>
    </div>
  );
};
