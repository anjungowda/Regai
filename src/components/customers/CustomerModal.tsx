import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const CustomerModal = ({ isOpen, onClose, customer }: any) => {
  const { register, handleSubmit } = useForm({
    defaultValues: customer || {}
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-[#0F2557]">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
         </div>

         <form className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* LEFT */}
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name *</label>
                 <input type="text" {...register('fullName')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Date of Birth</label>
                 <input type="date" {...register('dateOfBirth')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Nationality</label>
                 <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]"><option>United Kingdom</option></select>
               </div>
             </div>

             {/* RIGHT */}
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Occupation</label>
                 <input type="text" {...register('occupation')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Source of Funds</label>
                 <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]"><option>Employment</option></select>
               </div>
             </div>
           </div>

           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Address</label>
             <textarea rows={3} {...register('address')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
           </div>

           <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 text-sm rounded-xl transition">Cancel</button>
              <button type="button" className="px-4 py-2 font-medium text-white bg-[#1B4FD8] hover:bg-blue-700 text-sm rounded-xl transition shadow-sm">Save Customer</button>
           </div>
         </form>
      </div>
    </div>
  );
};
