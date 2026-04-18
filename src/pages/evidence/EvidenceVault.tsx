import React, { useEffect, useState } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Upload, LayoutGrid, List as ListIcon, FileText, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function EvidenceVault() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    document.title = 'Evidence Vault — RegShield AI';
    setPageTitle('Evidence Vault');
    setBreadcrumbs([{ label: 'Evidence Vault' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const mockEvidence = [
    { id: '1', filename: 'passport_scan.pdf', type: 'id_document', size: '2.4 MB', caseRef: 'RS-2026-0001', uploadedBy: 'Sarah Ahmed', date: '2026-04-15', status: 'verified' },
    { id: '2', filename: 'utility_bill_mar.png', type: 'address_proof', size: '1.1 MB', caseRef: 'RS-2026-0001', uploadedBy: 'Sarah Ahmed', date: '2026-04-16', status: 'verified' },
    { id: '3', filename: 'bank_statement.pdf', type: 'source_of_funds', size: '4.8 MB', caseRef: 'RS-2026-0002', uploadedBy: 'James Okonkwo', date: '2026-04-18', status: 'pending' },
    { id: '4', filename: 'cert_incorporation.pdf', type: 'corporate_doc', size: '1.5 MB', caseRef: null, uploadedBy: 'Priya Sharma', date: '2026-04-10', status: 'verified' },
  ];

  const storageUsed = 0.85; // 850MB
  const storageTotal = 5.0; // 5GB
  const pct = (storageUsed / storageTotal) * 100;

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Evidence Vault</h1>
          <p className="text-slate-500 text-sm mt-1">Secure document storage for all compliance evidence across your organisation.</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
           <button className="bg-[#1B4FD8] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
             <Upload className="w-4 h-4"/> Upload Document
           </button>
           <div className="flex flex-col items-end">
              <div className="text-xs font-bold text-slate-700 mb-1">{storageUsed}GB of {storageTotal}GB used</div>
              <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">5GB included with standard plan</div>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
           {['All Categories', 'ID Documents', 'Address Proof', 'Source of Funds', 'Corporate Profiles'].map(f => (
             <button key={f} className={`px-4 py-1.5 text-xs font-bold rounded-lg shrink-0 ${f === 'All Categories' ? 'bg-[#0F2557] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition'}`}>{f}</button>
           ))}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1B4FD8]' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon className="w-4 h-4"/></button>
           <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1B4FD8]' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4"/></button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Document</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Case Link</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Uploaded By</th>
                <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Verification</th>
              </tr>
            </thead>
            <tbody>
              {mockEvidence.map(doc => (
                <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50 group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-[#1B4FD8] transition">{doc.filename}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.size} · {format(new Date(doc.date), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium">
                    {doc.caseRef ? <a href={`/cases/${doc.caseRef}`} className="text-[#1B4FD8] hover:underline font-mono">{doc.caseRef}</a> : <span className="text-slate-400 italic">Not linked</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">{doc.type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{doc.uploadedBy}</td>
                  <td className="px-5 py-4">
                    {doc.status === 'verified' ? <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle className="w-4 h-4"/> Verified</span> : <span className="flex items-center gap-1 text-xs font-bold text-amber-600"><Clock className="w-4 h-4"/> Pending QA</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockEvidence.map(doc => (
             <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B4FD8] flex items-center justify-center mb-4"><FileText className="w-6 h-6"/></div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#1B4FD8] transition truncate mb-1">{doc.filename}</h4>
                <p className="text-xs text-slate-400 font-mono mb-4">{doc.size} · {format(new Date(doc.date), 'dd MMM yyyy')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-100">{doc.type.replace(/_/g, ' ')}</span>
                  {doc.status === 'verified' ? <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-green-100">Verified</span> : <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-amber-100">Pending</span>}
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">{doc.uploadedBy}</span>
                  {doc.caseRef && <span className="text-[#1B4FD8] font-bold font-mono">{doc.caseRef}</span>}
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
