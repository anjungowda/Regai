import React, { useEffect, useState } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Bell, FileUp, Search, Plus, ArrowRight, EllipsisVertical } from 'lucide-react';
import { AlertDetailModal } from '../../components/alerts/AlertDetailModal';
import { CsvImportModal } from '../../components/alerts/CsvImportModal';
import { format } from 'date-fns';

export default function AlertsModule() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [detailOpen, setDetailOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    document.title = 'TM Alerts — RegShield AI';
    setPageTitle('Transaction Monitoring Alerts');
    setBreadcrumbs([{ label: 'TM Alerts' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const mockAlerts = [
    { id: 'tx-8911', amount: 45000, currency: 'GBP', origin: 'GB', dest: 'RU', riskScore: 88, rule: 'Sanctioned Route Transfer', status: 'open', date: '2026-04-18', caseRef: null, reason: 'High value transfer attempting resolution to masked routing entity.' },
    { id: 'tx-8912', amount: 8500, currency: 'USD', origin: 'US', dest: 'NG', riskScore: 45, rule: 'Structured Cash Deposit', status: 'under_review', date: '2026-04-17', caseRef: 'RS-2026-0003', reason: 'Sequential small-denomination pooling below threshold limits.' },
    { id: 'tx-8913', amount: 150000, currency: 'EUR', origin: 'GB', dest: 'AE', riskScore: 72, rule: 'Large Cash Transaction', status: 'resolved', date: '2026-04-10', caseRef: 'RS-2026-0008', reason: 'Abnormal payload velocity contrasting historical averages.' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Transaction Monitoring Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Manage alerts from your external TM system and link them to cases.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setImportOpen(true)} className="bg-white border border-[#1B4FD8] text-[#1B4FD8] hover:bg-blue-50 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
             <FileUp className="w-4 h-4" /> Import CSV
           </button>
           <button className="bg-[#1B4FD8] text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-sm">
             <Plus className="w-4 h-4" /> Add Alert
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Alerts', val: 142, col: 'text-slate-800' },
          { label: 'Open', val: 12, col: 'text-blue-600' },
          { label: 'Under Review', val: 4, col: 'text-amber-600' },
          { label: 'Resolved This Month', val: 38, col: 'text-green-600' }
        ].map((s, i) => (
           <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
             <div className={`text-3xl font-black ${s.col}`}>{s.val}</div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
           </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-100">
           <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by transaction ID, rule, amount..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
           </div>
        </div>
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Transaction</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Route</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Risk Score</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Trigger Rule</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">Case</th>
              <th className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
             {mockAlerts.map(a => (
               <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-4">
                     <p className="font-mono text-sm font-bold text-[#1B4FD8]">{a.id}</p>
                     <p className="text-xs text-slate-500 truncate w-48 mt-0.5">{a.reason}</p>
                  </td>
                  <td className="px-5 py-4">
                     <div className="flex items-center gap-1 font-bold text-slate-800">
                        {a.currency === 'GBP' ? '£' : a.currency === 'USD' ? '$' : '€'}
                        {a.amount.toLocaleString()}
                     </div>
                     <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-bold uppercase">{a.currency}</span>
                  </td>
                  <td className="px-5 py-4">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                       <span>{a.origin}</span> <ArrowRight className="w-3 h-3 text-amber-500" /> <span>{a.dest}</span>
                     </div>
                  </td>
                  <td className="px-5 py-4">
                     <span className={`px-2 py-0.5 font-black text-white rounded text-xs ${a.riskScore >= 70 ? 'bg-red-600' : a.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'}`}>{a.riskScore}</span>
                  </td>
                  <td className="px-5 py-4">
                     <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{a.rule}</span>
                  </td>
                  <td className="px-5 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${a.status === 'open' ? 'bg-blue-100 text-blue-800' : a.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium">
                    {a.caseRef ? <a href={`/cases/${a.caseRef}`} className="text-[#1B4FD8] hover:underline font-mono">{a.caseRef}</a> : <button className="text-[#1B4FD8] text-xs underline">Link to case</button>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => { setSelectedAlert(a); setDetailOpen(true); }} className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"><EllipsisVertical className="w-5 h-5"/></button>
                  </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      <AlertDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} alert={selectedAlert} />
      <CsvImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
