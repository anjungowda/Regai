import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Users, UserPlus, Search, CheckCircle, Clock, XCircle, AlertTriangle, EllipsisVertical } from 'lucide-react';
import { CustomerModal } from '../../components/customers/CustomerModal';
import { format } from 'date-fns';

export default function CustomerList() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Customers — RegShield AI';
    setPageTitle('Customers');
    setBreadcrumbs([{ label: 'Customers' }]);
  }, [setPageTitle, setBreadcrumbs]);

  // Dummy Array
  const dummyCustomers = [
    { id: 'c1', firstName: 'John', lastName: 'Williams', nationality: 'GB', risk: { level: 'LOW', score: 18 }, verified: true, pep: false, sanctions: 'none', nextReview: '2027-01-15', openCases: 1 },
    { id: 'c2', firstName: 'Viktor', lastName: 'Petrov', nationality: 'RU', risk: { level: 'HIGH', score: 85 }, verified: false, pep: false, sanctions: 'potential', nextReview: '2026-03-01', openCases: 2 },
    { id: 'c3', firstName: 'Elena', lastName: 'Vasquez', nationality: 'CO', risk: null, verified: false, pep: true, sanctions: 'none', nextReview: '2026-04-20', openCases: 0 }
  ];

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-[#0F2557]">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">1,245 total customers</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-[#1B4FD8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus className="w-5 h-5" /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
         <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by name, nationality..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full outline-none focus:ring-1 focus:ring-[#1B4FD8]" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Risk Rating</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">ID Verified</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">PEP</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Sanctions</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Next Review</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">Cases</th>
              <th className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {dummyCustomers.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Users className="w-16 h-16 text-slate-200 mb-4" />
                    <p className="text-slate-600 font-medium">No customers yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first customer to begin risk assessments and case management.</p>
                  </div>
                </td>
              </tr>
            ) : (
              dummyCustomers.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${!c.risk ? 'bg-slate-100 text-slate-500' : c.risk.level === 'LOW' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <Link to={`/customers/${c.id}`} className="font-semibold text-slate-800 hover:text-[#1B4FD8] hover:underline">{c.firstName} {c.lastName}</Link>
                        <p className="text-xs text-slate-500 mt-0.5 tracking-wider uppercase">🇬🇧 {c.nationality}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {c.risk ? (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.risk.level === 'LOW' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {c.risk.level} ({c.risk.score})
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Not assessed</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {c.verified ? <span className="flex items-center gap-1.5 text-xs font-bold text-green-600"><CheckCircle className="w-4 h-4"/> Verified</span> : <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600"><Clock className="w-4 h-4"/> Pending</span>}
                  </td>
                  <td className="px-5 py-4">
                    {c.pep ? <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3"/> PEP</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    {c.sanctions === 'none' ? <span className="text-slate-300">—</span> : <span className="text-amber-600 text-xs font-bold">Potential Match</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm ${new Date(c.nextReview) < new Date() ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{format(new Date(c.nextReview), 'dd MMM yyyy')}</span>
                    {new Date(c.nextReview) < new Date() && <p className="text-[10px] text-red-600 font-bold uppercase">Overdue</p>}
                  </td>
                  <td className="px-5 py-4">
                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.openCases > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>{c.openCases}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                     <button className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"><EllipsisVertical className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
