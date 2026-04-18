import React from 'react';
import { X, ArrowRight, ShieldAlert } from 'lucide-react';

export const AlertDetailModal = ({ isOpen, onClose, alert }: any) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
           <div>
             <h2 className="text-2xl font-black text-[#0F2557] font-mono">{alert.id}</h2>
             <p className="text-slate-500 text-sm mt-1">Transaction Trigger Evaluated: {alert.date}</p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
         </div>

         <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Risk Score</span>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white ${alert.riskScore >= 70 ? 'bg-red-600' : 'bg-amber-500'}`}>{alert.riskScore}</div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Route Vector</span>
              <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
                <span className="px-3 py-1 bg-white border rounded-lg shadow-sm">{alert.origin}</span>
                <ArrowRight className="w-5 h-5 text-amber-500" />
                <span className="px-3 py-1 bg-white border rounded-lg shadow-sm border-red-200 text-red-700">{alert.dest}</span>
              </div>
            </div>
         </div>

         <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center bg-white p-4 border border-slate-100 shadow-sm rounded-xl">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Amount</span>
               <span className="text-lg font-black text-slate-800">{alert.amount.toLocaleString()} <span className="text-sm font-medium text-slate-500">{alert.currency}</span></span>
            </div>
            
            <div className="flex flex-col bg-red-50 text-red-900 p-4 border border-red-200 shadow-sm rounded-xl gap-2">
               <span className="text-xs font-bold text-red-700 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Trigger Logic</span>
               <p className="font-bold text-lg">{alert.rule}</p>
               <p className="text-sm border-t border-red-200/50 pt-2">{alert.reason}</p>
            </div>
         </div>

         <div className="flex gap-3">
            <button className="flex-1 bg-[#1B4FD8] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">Attach to Open Case</button>
            <button className="flex-1 bg-white text-slate-700 font-bold border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition shadow-sm">Generate Null-Case (SAR)</button>
         </div>

      </div>
    </div>
  );
};
