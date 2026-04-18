import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Building2, Plus, Search, EllipsisVertical } from 'lucide-react';
import { CompanyModal } from '../../components/companies/CompanyModal';

export default function CompanyList() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Companies — RegShield AI';
    setPageTitle('Corporate Entities');
    setBreadcrumbs([{ label: 'Companies' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Corporate Entities</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional and business counter-parties.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-[#1B4FD8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Company
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex justify-between items-center">
         <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by name, registration..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Risk Rating</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Jurisdiction</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Registration No.</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Next Review</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Cases</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7}>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Building2 className="w-16 h-16 text-slate-200 mb-4" />
                  <p className="text-slate-600 font-medium">No companies registered</p>
                  <p className="text-slate-400 text-sm mt-1">Sync KYB APIs or manually add corporate entities.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CompanyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
