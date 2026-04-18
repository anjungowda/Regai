import React from 'react';
import { Search, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function OrgAuditLog() {
  const mockLogs = [
    { id: 1, ts: '2026-04-18T09:42:11', user: 'Anju Narasegowda', role: 'admin', action: 'system_auth_login', entity: 'System', details: { ip: '192.168.1.1' } },
    { id: 2, ts: '2026-04-18T09:12:00', user: 'James Okonkwo', role: 'analyst', action: 'case_status_change', entity: 'Case RS-2026-0008', details: { from: 'open', to: 'resolved' } },
    { id: 3, ts: '2026-04-17T16:05:43', user: 'Sarah Ahmed', role: 'compliance_manager', action: 'user_invited', entity: 'User db_auditor@horizonpayments.com', details: { assigned_role: 'auditor' } },
  ];

  return (
    <div className="p-8 animate-in fade-in flex flex-col h-full">
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#0F2557]">Firm Audit Telemetry</h2>
          <p className="text-sm text-slate-500 mt-1">Immutable ledger tracking mutations across all users globally.</p>
        </div>
        <button className="bg-white border border-[#1B4FD8] text-[#1B4FD8] hover:bg-blue-50 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex gap-2 items-center">
          <Download className="w-4 h-4" /> Export CSV Envelope
        </button>
      </div>

      <div className="flex gap-4 mb-6">
         <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search trace elements..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
         </div>
         <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1B4FD8]">
            <option>All Actions</option>
         </select>
      </div>

      <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-white">
         <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50">
               <tr>
                 <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Timestamp</th>
                 <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Operator Node</th>
                 <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Action Type</th>
                 <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Target Entity</th>
                 <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Payload View</th>
               </tr>
            </thead>
            <tbody>
               {mockLogs.map(l => (
                 <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                   <td className="px-4 py-4 font-mono text-xs text-slate-500">{format(new Date(l.ts), 'dd MMM yyyy HH:mm:ss')}</td>
                   <td className="px-4 py-4">
                     <p className="font-bold text-slate-800">{l.user}</p>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest">{l.role}</p>
                   </td>
                   <td className="px-4 py-4">
                     <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{l.action}</span>
                   </td>
                   <td className="px-4 py-4 font-mono text-xs text-slate-600">{l.entity}</td>
                   <td className="px-4 py-4">
                     <button className="text-xs text-[#1B4FD8] font-bold underline hover:text-blue-800">Reveal JSON</button>
                   </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  )
}
