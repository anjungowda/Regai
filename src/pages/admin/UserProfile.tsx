import React, { useEffect } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Lock, Bell, CheckCircle2 } from 'lucide-react';

export default function UserProfile() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();

  useEffect(() => {
    document.title = 'My Profile — RegShield AI';
    setPageTitle('My Profile Settings');
    setBreadcrumbs([{ label: 'Admin Console', href: '/admin' }, { label: 'My Profile' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="max-w-2xl mx-auto pb-10 animate-in fade-in duration-300">
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100">
             <h2 className="font-bold text-[#0F2557] text-lg">Personal Details</h2>
             <p className="text-slate-500 text-xs">Update your core identity record.</p>
          </div>
          <div className="p-6 space-y-4">
             <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Full Legal Name</label>
               <input defaultValue="Anju Narasegowda" className="w-full text-sm border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Allocated Institutional Email</label>
               <input readOnly value="admin@horizonpayments.com" className="w-full text-sm border-slate-200 bg-slate-50 rounded-lg p-2 font-mono text-slate-500" />
               <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Bound to Active Directory constraints. Cannot mutate manually.</p>
             </div>
             <button className="bg-[#1B4FD8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition">Save Identity</button>
          </div>
       </div>

       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <div>
               <h2 className="font-bold text-[#0F2557] text-lg flex items-center gap-2"><Lock className="w-4 h-4"/> Cryptographic Secrets</h2>
               <p className="text-slate-500 text-xs">Manage authentication vectors.</p>
             </div>
          </div>
          <div className="p-6 space-y-4">
             <div>
               <input type="password" placeholder="Current Secret Phrase" className="w-full text-sm border-slate-200 rounded-lg p-2 mb-3 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               <input type="password" placeholder="New Secret Phrase" className="w-full text-sm border-slate-200 rounded-lg p-2 mb-3 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
               <input type="password" placeholder="Confirm New Secret Phrase" className="w-full text-sm border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
             </div>
             <button className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-900 transition">Regenerate Keypair Limit</button>
          </div>
       </div>
    </div>
  );
}
