import React from 'react';
import { X, UploadCloud } from 'lucide-react';

export const UploadTemplateModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-[#0F2557]">Upload Custom Template</h2>
           <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full"><X className="w-4 h-4"/></button>
         </div>

         <form className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Template Name *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Category Type</label>
              <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]">
                <option>Policy</option>
                <option>Assessment</option>
                <option>Report</option>
                <option>Checklist</option>
                <option>Regulatory</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea rows={2} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8] resize-none" />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer group">
               <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-[#1B4FD8] transition-colors" />
               <p className="text-sm font-bold text-slate-700">Upload HTML Schema</p>
               <p className="text-xs text-slate-500 mt-1">File must be valid HTML mapping your desired DOCX parameters.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
               <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 text-sm rounded-xl transition">Cancel</button>
               <button type="button" className="px-5 py-2 font-bold text-white bg-[#1B4FD8] hover:bg-blue-700 text-sm rounded-xl transition shadow-sm">Save to Library</button>
            </div>
         </form>

      </div>
    </div>
  );
};
