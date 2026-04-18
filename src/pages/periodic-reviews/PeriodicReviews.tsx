import React, { useEffect, useState } from 'react';
import { useAppLayout } from '../../components/layout/AppLayout';
import { Info, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, isPast, isThisMonth, addDays } from 'date-fns';
import { SetReviewScheduleModal } from '../../components/reviews/SetReviewScheduleModal';

export default function PeriodicReviews() {
  const { setPageTitle, setBreadcrumbs } = useAppLayout();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    document.title = 'Periodic Reviews — RegShield AI';
    setPageTitle('Periodic Reviews');
    setBreadcrumbs([{ label: 'Periodic Reviews' }]);
  }, [setPageTitle, setBreadcrumbs]);

  const mockReviews = [
    { id: 1, name: 'Elena Vasquez', risk: 'HIGH', freq: '6-monthly', lastRev: '2025-08-10', nextRev: '2026-02-10', status: 'overdue' },
    { id: 2, name: 'Viktor Petrov', risk: 'HIGH', freq: '6-monthly', lastRev: '2025-09-01', nextRev: '2026-03-01', status: 'overdue' },
    { id: 3, name: 'John Williams', risk: 'LOW', freq: '3-yearly', lastRev: '2023-04-18', nextRev: '2026-04-18', status: 'due_this_month' },
    { id: 4, name: 'Maria Santos', risk: 'MEDIUM', freq: 'Annually', lastRev: '2025-05-20', nextRev: '2026-05-20', status: 'upcoming' },
  ];

  const getFilteredData = () => {
    if (activeTab === 'overdue') return mockReviews.filter(r => r.status === 'overdue');
    if (activeTab === 'upcoming') return mockReviews.filter(r => r.status !== 'overdue');
    return mockReviews;
  };

  const handleOpenModal = (cust: any) => {
    setSelectedCustomer(cust);
    setModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-[#0F2557]">Periodic Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Schedule and track mandatory periodic reviews based on risk algorithms.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-6 shadow-sm">
        <Info className="w-5 h-5 text-[#1B4FD8] shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm font-medium leading-relaxed">
          UK AML regulations require firms to conduct periodic reviews of existing customers. High-risk customers should be reviewed every 6 months. Standard customers annually. Low-risk customers every 1–3 years. Review frequency must be documented in your AML policy.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-white border-l-4 border-red-500 rounded-xl p-4 shadow-sm"><div className="text-2xl font-black text-red-600">6</div><p className="text-xs font-bold text-slate-500 uppercase">Overdue Reviews</p></div>
         <div className="bg-white border-l-4 border-amber-500 rounded-xl p-4 shadow-sm"><div className="text-2xl font-black text-amber-600">12</div><p className="text-xs font-bold text-slate-500 uppercase">Due This Month</p></div>
         <div className="bg-white border-l-4 border-blue-500 rounded-xl p-4 shadow-sm"><div className="text-2xl font-black text-blue-600">8</div><p className="text-xs font-bold text-slate-500 uppercase">Due Next Month</p></div>
         <div className="bg-white border-l-4 border-green-500 rounded-xl p-4 shadow-sm"><div className="text-2xl font-black text-green-600">4</div><p className="text-xs font-bold text-slate-500 uppercase">Completed This Month</p></div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 w-fit rounded-xl mb-6 shadow-sm border border-slate-200">
        {[
          { id: 'overdue', label: 'Overdue (6)' },
          { id: 'upcoming', label: 'Upcoming (20)' },
          { id: 'all', label: 'All Customers' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === t.id ? 'bg-white shadow-sm text-[#0F2557]' : 'text-slate-600 hover:text-slate-800'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
         <table className="w-full text-left whitespace-nowrap">
           <thead className="bg-slate-50">
             <tr>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Customer</th>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Risk Level</th>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Review Frequency</th>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Last Reviewed</th>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Next Due</th>
               <th className="px-5 py-3 border-b text-xs font-semibold text-slate-500 uppercase">Actions</th>
             </tr>
           </thead>
           <tbody>
             {getFilteredData().map(r => (
               <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${r.status === 'overdue' ? 'border-l-2 lg:border-l-4 border-l-red-500' : ''}`}>
                 <td className="px-5 py-4 font-bold text-slate-800">{r.name}</td>
                 <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.risk === 'HIGH' ? 'bg-red-100 text-red-800' : r.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{r.risk}</span></td>
                 <td className="px-5 py-4">
                   <button onClick={() => handleOpenModal(r)} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition">
                     {r.freq}
                   </button>
                 </td>
                 <td className="px-5 py-4 text-sm text-slate-600">{format(new Date(r.lastRev), 'dd MMM yyyy')}</td>
                 <td className="px-5 py-4">
                   <span className={`text-sm font-bold ${r.status === 'overdue' ? 'text-red-600' : r.status === 'due_this_month' ? 'text-amber-600' : 'text-slate-600'}`}>
                     {format(new Date(r.nextRev), 'dd MMM yyyy')}
                   </span>
                   {r.status === 'overdue' && <p className="text-[10px] text-red-600 font-bold uppercase mt-0.5">Days Overdue</p>}
                 </td>
                 <td className="px-5 py-4">
                   {r.status === 'overdue' ? (
                     <button className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition shadow-sm">Start Review</button>
                   ) : (
                     <button className="bg-white border border-[#1B4FD8] text-[#1B4FD8] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition shadow-sm">Schedule Review</button>
                   )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
      
      <SetReviewScheduleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} customer={selectedCustomer} />
    </div>
  );
}
