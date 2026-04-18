import React from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function OrgSettings() {
  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0F2557]">Firm Identity & Parameters</h2>
          <p className="text-sm text-slate-500 mt-1">Global settings affecting the RegShield namespace.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-10">
         {/* Detail Mapping */}
         <section className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg border-b pb-2">Institutional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Registered Entity Name</label>
                <input type="text" defaultValue="Horizon Payments Ltd" className="w-full text-sm border-slate-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Primary Jurisdiction</label>
                <select className="w-full text-sm border-slate-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-[#1B4FD8]"><option>United Kingdom</option></select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Administrative Contact Email</label>
                <input type="email" defaultValue="admin@horizonpayments.com" className="w-full text-sm border-slate-200 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Regulator Framework</label>
                <input readOnly value="FCA (Financial Conduct Authority)" className="w-full text-sm border-slate-200 rounded-xl p-2.5 bg-slate-50 font-medium text-slate-500" />
              </div>
            </div>
         </section>

         {/* SLAs */}
         <section className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg border-b pb-2">Global Alert SLAs</h3>
            <p className="text-sm text-slate-500">Determine global temporal parameters before warnings turn amber or red.</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
               <div>
                  <span className="font-bold text-sm text-slate-800 block">Transaction Escalation Threshold</span>
                  <span className="text-xs text-slate-500">How many hours before an open TM alert breaches firm SLA</span>
               </div>
               <div className="flex items-center gap-2">
                 <input type="number" defaultValue={24} className="w-20 text-center font-bold font-mono border-slate-200 p-2 rounded-lg" />
                 <span className="text-xs font-bold text-slate-400">Hours</span>
               </div>
            </div>
         </section>

         <div className="pt-4 border-t border-slate-100">
            <button className="bg-[#1B4FD8] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Commit Organisation Mutations</button>
         </div>
      </div>
    </div>
  )
}
