import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';

export const CompanyModal = ({ isOpen, onClose, company }: any) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: company || { directors: [], ubos: [] }
  });

  const { fields: directorFields, append: appendDirector, remove: removeDirector } = useFieldArray({ control, name: "directors" });
  const { fields: uboFields, append: appendUbo, remove: removeUbo } = useFieldArray({ control, name: "ubos" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
         <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
           <h2 className="text-xl font-bold text-[#0F2557]">Add Corporate Entity</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
         </div>

         <form className="space-y-8">
           {/* Section 1 */}
           <div>
             <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Business Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Company Name</label><input type="text" {...register('name')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" /></div>
               <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Registration Number</label><input type="text" {...register('registrationNumber')} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" /></div>
               <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Jurisdiction</label><select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]"><option>United Kingdom</option></select></div>
               <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Expected Turnover</label>
                 <select className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]">
                   <option>&lt; £100k</option><option>£100k - £1m</option><option>&gt; £10m</option>
                 </select>
               </div>
             </div>
           </div>

           {/* Section 2: Directors */}
           <div>
             <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="font-bold text-slate-800">Directors Registry</h3>
               <button type="button" onClick={() => appendDirector({ name: '', role: '', nationality: '' })} className="text-sm font-bold text-[#1B4FD8] flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add Director</button>
             </div>
             {directorFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center mb-2">
                  <input placeholder="Full Name" {...register(`directors.${index}.name` as const)} className="flex-1 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  <input placeholder="Role" {...register(`directors.${index}.role` as const)} className="w-32 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  <button type="button" onClick={() => removeDirector(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </div>
             ))}
           </div>

           {/* Section 3: UBOs */}
           <div>
             <div className="flex justify-between items-center mb-4 border-b pb-2">
               <h3 className="font-bold text-slate-800">Ultimate Beneficial Owners (PSC)</h3>
               <button type="button" onClick={() => appendUbo({ name: '', ownership: '', nationality: '' })} className="text-sm font-bold text-[#1B4FD8] flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add UBO</button>
             </div>
             {uboFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center mb-2">
                  <input placeholder="Full Name" {...register(`ubos.${index}.name` as const)} className="flex-1 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  <input placeholder="Ownership %" type="number" {...register(`ubos.${index}.ownership` as const)} className="w-32 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
                  <button type="button" onClick={() => removeUbo(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                </div>
             ))}
           </div>

           <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 text-sm rounded-xl transition">Cancel</button>
              <button type="button" className="px-4 py-2 font-medium text-white bg-[#1B4FD8] hover:bg-blue-700 text-sm rounded-xl transition shadow-sm">Save Corporation</button>
           </div>
         </form>
      </div>
    </div>
  );
};
