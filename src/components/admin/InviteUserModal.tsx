import React from 'react';
import { X, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const InviteUserModal = ({ isOpen, onClose }: any) => {
  const { register, handleSubmit } = useForm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-xl font-bold text-[#0F2557]">Invite Team Member</h2>
             <p className="text-sm text-slate-500 mt-1">Assign roles and trigger a Magic Link payload.</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
         </div>

         <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                 <input type="text" {...register('fullName')} className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Firm Email Address</label>
                 <input type="email" {...register('email')} className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               </div>
            </div>

            <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Role Authorisation</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {[
                   { val: 'admin', label: 'Admin', desc: 'Full access including billing and user management' },
                   { val: 'compliance_manager', label: 'Compliance Manager', desc: 'Can assign cases, approve closures, view all reports' },
                   { val: 'analyst', label: 'Analyst', desc: 'Can create and manage cases, upload evidence, run tests' },
                   { val: 'auditor', label: 'Auditor', desc: 'Read-only access to all cases and audit trails for NCA agents' }
                 ].map(o => (
                    <label key={o.val} className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition flex flex-col gap-1 hover:bg-slate-50 hover:border-[#1B4FD8]">
                       <input type="radio" value={o.val} {...register('role')} className="hidden" />
                       <span className="font-bold text-sm text-slate-800">{o.label}</span>
                       <span className="text-xs font-medium text-slate-500">{o.desc}</span>
                    </label>
                 ))}
               </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
               <button type="submit" className="px-5 py-2.5 font-bold text-white bg-[#1B4FD8] shadow-sm hover:bg-blue-700 text-sm rounded-xl transition flex gap-2 items-center"><Mail className="w-4 h-4"/> Transmit Invite Envelope</button>
            </div>
         </form>
      </div>
    </div>
  );
};
