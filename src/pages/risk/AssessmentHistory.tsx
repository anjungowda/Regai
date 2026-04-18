import React, { useEffect } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Download, Search } from 'lucide-react';

export default function AssessmentHistory() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();

  useEffect(() => {
    document.title = 'Assessment History — RegShield AI';
    setPageTitle('Assessment History');
    setBreadcrumbs([{ label: 'Risk Scoring', href: '/risk-scoring' }, { label: 'History' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Assessment History</h1>
          <p className="text-slate-500 text-sm mt-1">Archive of all past risk evaluations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex justify-between items-center">
         <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by customer or assessor..." 
              className="pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:bg-white focus:border-[#1B4FD8]"
            />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
         <table className="w-full text-left">
           <thead>
             <tr>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Date</th>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Customer</th>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Assessed By</th>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Score</th>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Risk Level</th>
               <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Actions</th>
             </tr>
           </thead>
           <tbody>
              <tr>
                <td colSpan={6} className="text-center py-24 text-slate-500">Historical Assessments will compile here post-DB mapping.</td>
              </tr>
           </tbody>
         </table>
      </div>
    </div>
  );
}
