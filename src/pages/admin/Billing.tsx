import React from 'react';
import { CreditCard, ExternalLink, Zap } from 'lucide-react';

export default function Billing() {
  const isTrial = true;
  const trialDays = 5;

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#0F2557]">Subscriptions & Billing</h2>
          <p className="text-sm text-slate-500 mt-1">Manage standard and professional Stripe plans securely.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
         {/* Live Plan Node */}
         <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden bg-white shadow-sm">
            {isTrial && <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />}
            
            <div className="flex justify-between items-end mb-8">
               <div>
                 <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-lg mb-4 ${isTrial ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                   {isTrial ? 'Trialing Period' : 'Active Subscription'}
                 </span>
                 <h3 className="text-3xl font-black text-[#0F2557]">Standard Plan</h3>
               </div>
               {isTrial ? (
                  <div className="text-right">
                     <div className="text-4xl font-black text-amber-600">{trialDays}</div>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Days Remaining</span>
                  </div>
               ) : (
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#0F2557]">£850</span><span className="text-sm font-medium text-slate-500">/mo</span>
                  </div>
               )}
            </div>

            {isTrial && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
                 <p className="text-sm text-amber-900 font-medium">To avoid platform locking resulting in locked case generation algorithms, attach an FCA-authorised payment method before trial expiration.</p>
              </div>
            )}

            <div className="flex gap-4">
               {isTrial ? (
                 <button className="flex-1 bg-[#1B4FD8] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">Activate Stripe Gateway</button>
               ) : (
                 <button className="flex-1 bg-[#1B4FD8] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">Upgrade to Professional</button>
               )}
               <button className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold flex focus items-center justify-center gap-2 hover:bg-slate-100 transition">
                 <ExternalLink className="w-4 h-4"/> Stripe Portal
               </button>
            </div>
         </div>
         
         <p className="text-xs text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3"/> Payments are securely handled globally by Stripe Payments UK Ltd.</p>
      </div>
    </div>
  )
}
