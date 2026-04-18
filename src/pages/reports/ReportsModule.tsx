import React, { useEffect } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { FileBarChart, PieChart, Users, Scale, Bell } from 'lucide-react';
import { generateCaseSummaryReport, generateRiskDistributionReport, generateAnalystPerformanceReport, generateAuditPreparationReport, generateAlertVolumeReport } from '../../services/reports.service';

export default function ReportsModule() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const planTier = 'standard'; // Mock plan tier check

  useEffect(() => {
    document.title = 'Reports — RegShield AI';
    setPageTitle('Compliance Reports');
    setBreadcrumbs([{ label: 'Reports' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-[#0F2557]">Compliance Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate reports for internal oversight and regulatory submission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* REPORT 1 */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-[#1B4FD8] flex items-center justify-center rounded-xl shrink-0"><FileBarChart className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-[#0F2557] text-lg">Case Summary Report</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">All cases in a date range with status, risk level and decision outcomes.</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto mb-4 space-y-3">
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Date Range</label>
                 <select className="w-full text-sm border-slate-200 rounded-lg p-2"><option>Last 30 Days</option></select>
               </div>
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status Filter</label>
                 <select className="w-full text-sm border-slate-200 rounded-lg p-2"><option>All Statuses</option></select>
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={generateCaseSummaryReport} className="flex-1 bg-[#1B4FD8] text-white text-sm font-bold py-2 rounded-xl hover:bg-blue-700 transition">Export PDF</button>
               <button onClick={generateCaseSummaryReport} className="flex-1 bg-white border border-[#1B4FD8] text-[#1B4FD8] text-sm font-bold py-2 rounded-xl hover:bg-blue-50 transition">Export CSV</button>
            </div>
         </div>

         {/* REPORT 2 */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl shrink-0"><PieChart className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-[#0F2557] text-lg">Risk Distribution</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Customer risk portfolio breakdown across all entities.</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto mb-4 space-y-3">
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Snapshot Date</label>
                 <input type="date" className="w-full text-sm border-slate-200 rounded-lg p-2"/>
               </div>
               <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer mt-2 pt-2 border-t border-slate-200">
                 <input type="checkbox" className="rounded text-[#1B4FD8] focus:ring-[#1B4FD8]" /> Include Closed Cases
               </label>
            </div>
            <div className="flex gap-2">
               <button onClick={generateRiskDistributionReport} className="flex-1 bg-[#1B4FD8] text-white text-sm font-bold py-2 rounded-xl hover:bg-blue-700 transition">Export PDF</button>
               <button onClick={generateRiskDistributionReport} className="flex-1 bg-white border border-[#1B4FD8] text-[#1B4FD8] text-sm font-bold py-2 rounded-xl hover:bg-blue-50 transition">Export CSV</button>
            </div>
         </div>

         {/* REPORT 3 */}
         <div className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm relative ${planTier === 'standard' ? 'opacity-90' : ''}`}>
            {planTier === 'standard' && (
              <div className="absolute inset-x-4 top-20 bg-amber-50 border border-amber-200 p-4 rounded-xl z-10 text-center shadow-lg">
                <p className="text-sm font-bold text-amber-800 mb-2">Available on Professional plan</p>
                <button className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-amber-600 shadow-sm">Upgrade to Unlock</button>
              </div>
            )}
            <div className={`flex gap-3 mb-4 ${planTier === 'standard' ? 'blur-sm pointer-events-none' : ''}`}>
              <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-xl shrink-0"><Users className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-[#0F2557] text-lg">Analyst Performance</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Cases handled by analyst, average time to close, SLA breaches.</p>
              </div>
            </div>
            <div className={`bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto mb-4 space-y-3 ${planTier === 'standard' ? 'blur-sm pointer-events-none' : ''}`}>
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Analyst</label>
                 <select className="w-full text-sm border-slate-200 rounded-lg p-2"><option>All Analysts</option></select>
               </div>
            </div>
            <div className="flex gap-2">
               <button disabled={planTier === 'standard'} onClick={generateAnalystPerformanceReport} className="flex-1 bg-[#1B4FD8] text-white text-sm font-bold py-2 rounded-xl disabled:bg-slate-300">Export PDF</button>
            </div>
         </div>

         {/* REPORT 4 */}
         <div className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm relative ${planTier === 'standard' ? 'opacity-90' : ''}`}>
            {planTier === 'standard' && (
              <div className="absolute inset-x-4 top-20 bg-amber-50 border border-amber-200 p-4 rounded-xl z-10 text-center shadow-lg">
                <p className="text-sm font-bold text-amber-800 mb-2">Available on Professional plan</p>
                <button className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-amber-600 shadow-sm">Upgrade to Unlock</button>
              </div>
            )}
            <div className={`flex gap-3 mb-4 ${planTier === 'standard' ? 'blur-sm pointer-events-none' : ''}`}>
              <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center rounded-xl shrink-0"><Scale className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-[#0F2557] text-lg">Audit Preparation</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Regulatory submission mapping for FCA/NCA audits.</p>
              </div>
            </div>
            <div className={`bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto mb-4 space-y-3 ${planTier === 'standard' ? 'blur-sm pointer-events-none' : ''}`}>
               <p className="text-xs text-red-700 font-bold bg-red-50 border border-red-100 p-2 rounded">Warning: This report requires complete decision records attached for generation.</p>
            </div>
            <div className="flex gap-2">
               <button disabled={planTier === 'standard'} onClick={generateAuditPreparationReport} className="flex-1 bg-[#1B4FD8] text-white text-sm font-bold py-2 rounded-xl disabled:bg-slate-300">Export PDF</button>
            </div>
         </div>

         {/* REPORT 5 */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl shrink-0"><Bell className="w-6 h-6"/></div>
              <div>
                <h3 className="font-bold text-[#0F2557] text-lg">Alert Volume Mapping</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">TM alert trends categorized across rulesets and thresholds over temporal bounds.</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-auto mb-4 space-y-3">
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Temporal Grouping</label>
                 <select className="w-full text-sm border-slate-200 rounded-lg p-2"><option>Weekly Traces</option></select>
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={generateAlertVolumeReport} className="flex-1 bg-white border border-[#1B4FD8] text-[#1B4FD8] text-sm font-bold py-2 rounded-xl hover:bg-blue-50 transition">Export CSV Extrapolation</button>
            </div>
         </div>
      </div>
    </div>
  );
}
