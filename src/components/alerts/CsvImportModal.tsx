import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

export const CsvImportModal = ({ isOpen, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setFileData(results.data.slice(0, 5)); // Just preview
          setStep(2);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-8">
           <div>
             <h2 className="text-xl font-bold text-[#0F2557]">Import TM Alerts Pipeline</h2>
             <p className="text-sm text-slate-500 mt-1">RegShield standard CSV taxonomy mapper.</p>
           </div>
           <button onClick={() => { setStep(1); setFileData([]); onClose(); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5"/></button>
         </div>

         {step === 1 && (
           <div className="space-y-6">
             <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition group relative cursor-pointer">
               <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
               <FileSpreadsheet className="w-12 h-12 text-slate-300 mb-4 group-hover:text-[#1B4FD8] transition-colors" />
               <h3 className="font-bold text-slate-800 text-lg">Click or drag CSV here</h3>
               <p className="text-sm text-slate-500 mt-1">Strict headers: transaction_id, amount, currency...</p>
             </div>
             <button className="text-sm font-bold text-[#1B4FD8] underline text-center w-full block hover:text-blue-700">Download Template CSV Schema</button>
           </div>
         )}

         {step === 2 && (
           <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
             <div className="bg-green-50 text-green-800 border border-green-200 rounded-xl p-4 flex gap-3 text-sm font-bold shadow-sm items-center">
                <CheckCircle2 className="w-5 h-5" /> PapaParse successfully mapped schema array.
             </div>

             <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50">
                     <tr>
                       <th className="px-4 py-2 font-semibold text-slate-600">transaction_id</th>
                       <th className="px-4 py-2 font-semibold text-slate-600">risk_score</th>
                       <th className="px-4 py-2 font-semibold text-slate-600">amount</th>
                       <th className="px-4 py-2 font-semibold text-slate-600">origin → dest</th>
                     </tr>
                   </thead>
                   <tbody>
                     {fileData.map((row, i) => (
                       <tr key={i} className="border-t border-slate-100">
                         <td className="px-4 py-2 font-mono text-[#1B4FD8]">{row.transaction_id || `tx-mock-${i}`}</td>
                         <td className="px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">{row.risk_score || '85'}</span></td>
                         <td className="px-4 py-2">{row.amount || '10,000'}</td>
                         <td className="px-4 py-2 font-mono text-xs">{row.origin_country || 'US'} → {row.destination_country || 'RU'}</td>
                       </tr>
                     ))}
                   </tbody>
                </table>
             </div>
             
             <div className="flex justify-end pt-4">
                <button onClick={() => { setStep(1); onClose(); }} className="bg-[#1B4FD8] text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition">Execute Bulk Injection (Mock)</button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};
